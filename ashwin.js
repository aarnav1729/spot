import { ClientSecretCredential } from '@azure/identity';
import fetch from 'node-fetch';
import XLSX from 'xlsx';  

// Replace with your credentials
const APPLICATION_CLIENT_ID = "b73ee084-ed92-4300-b488-3e5e7183dfe5";
const APPLICATION_CLIENT_SECRET = "53e194ab-aa75-4fa2-9adf-0d902b78fb4f";
const TENANT_ID = "1c3de7f3-f8d1-41d3-8583-2517cf3ba3b1";

// Microsoft Graph OAuth2.0 token endpoint and scope
const tokenScope = "https://graph.microsoft.com/.default";

// Create credential object for client credentials flow
const credential = new ClientSecretCredential(
  TENANT_ID, 
  APPLICATION_CLIENT_ID, 
  APPLICATION_CLIENT_SECRET
);

// The sender's email we are filtering by
const senderEmail = 'scm.mis@premierenergies.com';

// Create a new workbook in memory for our final output
let outputWorkbook = XLSX.utils.book_new();
let outputWorksheetData = [];
// We'll keep a header row if needed (adjust as required)
// For example, columns: InvoiceNumber (A), then B to AL (total 37 columns including A)
let headers = ['InvoiceNumber'];
// Add placeholders for remaining columns to total 37 columns
for (let i = 2; i <= 37; i++) {
  headers.push(`Col${i}`);
}
outputWorksheetData.push(headers);

// A helper function to get the access token using the credential object
async function getAccessToken() {
  const tokenResponse = await credential.getToken(tokenScope);
  if (!tokenResponse || !tokenResponse.token) {
    throw new Error("Could not obtain access token from Azure AD");
  }
  return tokenResponse.token;
}

// Once we have the token, we can use fetch with the Authorization header
async function graphFetch(url, accessToken, options = {}) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${url}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph API error ${res.status}: ${text}`);
  }
  return res.json();
}

(async () => {
  // Step 1: Acquire token
  const accessToken = await getAccessToken();

  // Step 2: Find all emails from the given sender
  const messages = await graphFetch(`/me/messages?$filter=from/emailAddress/address eq '${senderEmail}'`, accessToken);
  
  for (const message of messages.value) {
    const messageId = message.id;

    // Step 3: Get attachments from this message
    const attachments = await graphFetch(`/me/messages/${messageId}/attachments?$expand=microsoft.graph.itemAttachment/item`, accessToken);

    // Identify the PDF invoice and XLSX attachment
    let pdfAttachment = null;
    let xlsxAttachment = null;

    for (const attachment of attachments.value) {
      if (attachment['@odata.type'] === "#microsoft.graph.fileAttachment") {
        const fileName = attachment.name || '';
        if (fileName.toLowerCase().endsWith('.pdf') && fileName.startsWith('IN')) {
          pdfAttachment = attachment;
        } else if (fileName.toLowerCase().endsWith('.xlsx')) {
          xlsxAttachment = attachment;
        }
      }
    }

    // If we don't have both attachments, skip
    if (!pdfAttachment || !xlsxAttachment) {
      console.log(`Skipping message ${messageId} due to missing required attachments.`);
      continue;
    }

    // Extract invoice number from the PDF filename
    // Example: IN12345.pdf => invoiceNumber = "12345"
    const pdfName = pdfAttachment.name;
    const invoiceNumber = pdfName.replace(/^IN/, '').replace(/\.pdf$/i, '');

    // Step 4: Download and parse the XLSX attachment
    const xlsxData = Buffer.from(xlsxAttachment.contentBytes, 'base64');
    const workbook = XLSX.read(xlsxData, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    // Convert sheet to array of arrays
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // For each row in the XLSX, extract columns B to AL 
    // B=1-based index 2nd column, AL ~ 38th column (we need total 37 columns)
    // A=0, B=1, ..., AL=?
    // We established 37 columns total, with A as invoice number, 
    // so columns B to AL would be 36 columns from the XLSX.
    // slice(1, 37) will give us indexes 1 to 36 (36 columns).
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const dataCols = row.slice(1, 37); // columns B to AL
      const outputRow = [invoiceNumber, ...dataCols];
      outputWorksheetData.push(outputRow);
    }
  }

  // Step 5: Create final worksheet and save
  const outputSheet = XLSX.utils.aoa_to_sheet(outputWorksheetData);
  XLSX.utils.book_append_sheet(outputWorkbook, outputSheet, "ConsolidatedData");

  // Write to a file (e.g., ConsolidatedData.xlsx)
  XLSX.writeFile(outputWorkbook, 'ConsolidatedData.xlsx');

  console.log("Process completed. ConsolidatedData.xlsx has been created.");
})().catch(err => {
  console.error("An error occurred:", err);
});