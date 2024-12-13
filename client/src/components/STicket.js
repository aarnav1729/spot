import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  background: linear-gradient(to bottom right, #f0f4f8, #d9e2ec);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Content = styled.div`
  flex: 1;
  position: relative;
  padding: 40px;
  box-sizing: border-box;
`;

const TicketDetails = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 40px;
  padding-right: ${({ isHistoryVisible }) => (isHistoryVisible ? '440px' : '80px')};
  box-sizing: border-box;
  transition: box-shadow 0.3s ease, padding-right 0.3s ease;

  &:hover {
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 25px;
  font-weight: 600;
  text-align: left;
  letter-spacing: 0.5px;
`;

const BackButton = styled.button`
  position: absolute; /* Positioning the button in the top-left corner */
  top: 40px;
  left: 40px;
  background-color: #0f6ab0;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0d5a8e;
    transform: translateY(-1px);
  }
`;

const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
  font-size: 16px;
  color: #444;
  line-height: 1.5;

  strong {
    width: 200px;
    color: #555;
    font-weight: 600;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.label`
  width: 200px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-size: 15px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #0f6ab0;
    outline: none;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #0f6ab0;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 100px;
  resize: vertical;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #0f6ab0;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #0f6ab0;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 500;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #0d5a8e;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const HistoryPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 360px; /* Increase width for more spacious layout */
  max-height: calc(100% - 40px);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: ${({ visible }) => (visible ? 'translateX(0)' : 'translateX(380px)')};
  z-index: 10;

  &:hover {
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }
`;

const HistoryTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
`;

const HistoryItem = styled.div`
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  font-size: 14px;
  line-height: 1.4;

  &:last-child {
    border-bottom: none;
  }

  strong {
    display: inline-block;
    width: 100px;
    color: #555;
    font-weight: 600;
  }

  .history-comment {
    margin-top: 5px;
    font-style: italic;
    color: #666;
  }

  & + & {
    margin-top: 15px;
  }
`;

const HistoryToggleButton = styled.button`
  position: absolute;
  top: 40px;
  right: ${({ visible }) => (visible ? '370px' : '40px')};
  background-color: #0f6ab0;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: right 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);

  &:hover {
    background-color: #0d5a8e;
  }
`;

const STicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(location.state.ticket);
  const [emailUser, setEmailUser] = useState(() => {
    const userEmail = location.state.emailUser;
    return userEmail.includes("@")
      ? userEmail
      : `${userEmail}@premierenergies.com`;
  });

  const [updatedExpectedDate, setUpdatedExpectedDate] = useState(
    ticket.Expected_Completion_Date
      ? new Date(ticket.Expected_Completion_Date).toISOString().split("T")[0]
      : ""
  );

  const [updatedPriority, setUpdatedPriority] = useState(
    ticket.Ticket_Priority || ""
  );
  const [updatedStatus, setUpdatedStatus] = useState(ticket.TStatus || "");
  const [updatedAssigneeDept, setUpdatedAssigneeDept] = useState(
    ticket.Assignee_Dept || ""
  );
  const [updatedAssigneeSubDept, setUpdatedAssigneeSubDept] = useState(
    ticket.Assignee_SubDept || ""
  );
  const [updatedAssigneeEmpID, setUpdatedAssigneeEmpID] = useState(
    ticket.Assignee_EmpID || ""
  );
  const [remarks, setRemarks] = useState("");

  const [assigneeDepts, setAssigneeDepts] = useState([]);
  const [assigneeSubDepts, setAssigneeSubDepts] = useState([]);
  const [assigneeEmpIDs, setAssigneeEmpIDs] = useState([]);

  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  // Fetching ticket history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ticket-history?ticketNumber=${ticket.Ticket_Number}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [ticket.Ticket_Number]);

  // Fetching all departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptResponse = await axios.get(
          "http://localhost:5000/api/departments"
        );
        setAssigneeDepts(deptResponse.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetching sub-departments when department changes
  useEffect(() => {
    if (updatedAssigneeDept) {
      axios
        .get("http://localhost:5000/api/subdepartments", {
          params: { department: updatedAssigneeDept },
        })
        .then((response) => {
          setAssigneeSubDepts(response.data);
          if (!response.data.includes(updatedAssigneeSubDept)) {
            setUpdatedAssigneeSubDept("");
            setUpdatedAssigneeEmpID("");
          }
        })
        .catch((error) => {
          console.error("Error fetching subdepartments:", error);
        });
    } else {
      setAssigneeSubDepts([]);
      setUpdatedAssigneeSubDept("");
      setUpdatedAssigneeEmpID("");
    }
  }, [updatedAssigneeDept]);

  // Fetching employees when sub-department changes
  useEffect(() => {
    if (updatedAssigneeDept && updatedAssigneeSubDept) {
      axios
        .get("http://localhost:5000/api/employees", {
          params: {
            department: updatedAssigneeDept,
            subdepartment: updatedAssigneeSubDept,
          },
        })
        .then((response) => {
          setAssigneeEmpIDs(response.data);
          if (
            !response.data.some((emp) => emp.EmpID === updatedAssigneeEmpID)
          ) {
            setUpdatedAssigneeEmpID("");
          }
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    } else {
      setAssigneeEmpIDs([]);
      setUpdatedAssigneeEmpID("");
    }
  }, [updatedAssigneeSubDept]);

  const handleUpdateTicket = async (e) => {
    e.preventDefault();

    try {
      if (!emailUser) {
        console.error("No emailUser found");
        return;
      }

      const updatedTicketData = {
        Ticket_Number: ticket.Ticket_Number,
        Expected_Completion_Date: updatedExpectedDate,
        Ticket_Priority: updatedPriority,
        TStatus: updatedStatus,
        Assignee_Dept: updatedAssigneeDept,
        Assignee_SubDept: updatedAssigneeSubDept,
        Assignee_EmpID: updatedAssigneeEmpID,
        UserID: emailUser,
        Comment: remarks,
      };

      await axios.post("http://localhost:5000/api/update-ticket", updatedTicketData);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating ticket:", error.response || error);
    }
  };

  return (
    <div>
      <Container>
        <Sidebar activeTab="Ticket Details" />
        <Content>
          <TicketDetails isHistoryVisible={isHistoryVisible}>
            <BackButton onClick={() => navigate("/profile")}>Back</BackButton>
            <Title>Ticket Details - {ticket.Ticket_Number}</Title>

            <DetailRow>
              <strong>Creation Date:</strong> {ticket.Creation_Date}
            </DetailRow>
            <DetailRow>
              <strong>Ticket Title:</strong> {ticket.Ticket_Title}
            </DetailRow>
            <DetailRow>
              <strong>Description:</strong> {ticket.Ticket_Description}
            </DetailRow>
            <DetailRow>
              <strong>Reporter Name:</strong> {ticket.Reporter_Name}
            </DetailRow>
            <DetailRow>
              <strong>Reporter Email:</strong> {ticket.Reporter_Email}
            </DetailRow>

            {/* Editable fields */}
            <FormRow>
              <Label>Status:</Label>
              <Select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Overdue">Overdue</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </Select>
            </FormRow>

            <FormRow>
              <Label>Assignee Department:</Label>
              <Select
                value={updatedAssigneeDept}
                onChange={(e) => setUpdatedAssigneeDept(e.target.value)}
              >
                <option value="">Select Department</option>
                {assigneeDepts.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow>
              <Label>Assignee SubDept:</Label>
              <Select
                value={updatedAssigneeSubDept}
                onChange={(e) => setUpdatedAssigneeSubDept(e.target.value)}
                disabled={!updatedAssigneeDept}
              >
                <option value="">Select SubDept</option>
                {assigneeSubDepts.map((subDept) => (
                  <option key={subDept} value={subDept}>
                    {subDept}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow>
              <Label>Assignee Employee:</Label>
              <Select
                value={updatedAssigneeEmpID}
                onChange={(e) => setUpdatedAssigneeEmpID(e.target.value)}
                disabled={!updatedAssigneeSubDept}
              >
                <option value="">Select Employee</option>
                {assigneeEmpIDs.map((emp) => (
                  <option key={emp.EmpID} value={emp.EmpID}>
                    {emp.EmpName}
                  </option>
                ))}
              </Select>
            </FormRow>

            <FormRow>
              <Label>Expected Completion Date:</Label>
              <Input
                type="date"
                value={updatedExpectedDate}
                onChange={(e) => setUpdatedExpectedDate(e.target.value)}
              />
            </FormRow>

            <FormRow>
              <Label>Priority:</Label>
              <Select
                value={updatedPriority}
                onChange={(e) => setUpdatedPriority(e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </FormRow>

            <FormRow>
              <Label>Remarks:</Label>
              <TextArea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any remarks (optional)"
              />
            </FormRow>

            <SubmitButton
              type="button"
              onClick={(e) => handleUpdateTicket(e)}
            >
              Submit
            </SubmitButton>
          </TicketDetails>

          <HistoryToggleButton
            visible={isHistoryVisible}
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          >
            {isHistoryVisible ? "Hide History" : "Show History"}
          </HistoryToggleButton>

          <HistoryPanel visible={isHistoryVisible}>
            <HistoryTitle>Ticket History</HistoryTitle>
            {history.map((item, index) => (
              <HistoryItem key={index}>
                <div>
                  <strong>Action:</strong> {item.Action_Type}
                </div>
                <div>
                  <strong>Before:</strong> {item.Before_State || "N/A"}
                </div>
                <div>
                  <strong>After:</strong> {item.After_State || "N/A"}
                </div>
                <div className="history-comment">
                  {item.Comment ? `Comment: ${item.Comment}` : ""}
                </div>
                <div>
                  <strong>Timestamp:</strong> {new Date(item.Timestamp).toLocaleString()}
                </div>
              </HistoryItem>
            ))}
          </HistoryPanel>
        </Content>
      </Container>
    </div>
  );
};

export default STicket;