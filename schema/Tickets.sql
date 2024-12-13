CREATE TABLE Tickets (
    Ticket_Number VARCHAR(50) NOT NULL PRIMARY KEY,
    Creation_Date DATETIME NOT NULL DEFAULT GETDATE(),
    Ticket_Type VARCHAR(100) NOT NULL,
    Ticket_Title VARCHAR(200) NOT NULL,
    Ticket_Description TEXT NOT NULL,
    Ticket_Priority VARCHAR(50) NOT NULL,
    Assignee_Dept VARCHAR(100) NOT NULL,
    Sub_Task VARCHAR(100) NOT NULL,
    Task_Label VARCHAR(100) NOT NULL,
    Assignee_EmpID NVARCHAR(50) NOT NULL,
    Reporter_Location VARCHAR(100) NOT NULL,
    Reporter_Department VARCHAR(100) NOT NULL,
    Reporter_EmpID NVARCHAR(50) NOT NULL,
    Reporter_Name VARCHAR(100) NOT NULL,
    Reporter_Email VARCHAR(100) NOT NULL,
    Expected_Completion_Date DATETIME NULL,
	TStatus VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (Assignee_EmpID) REFERENCES EMP(EmpID),
    FOREIGN KEY (Reporter_EmpID) REFERENCES EMP(EmpID)
);