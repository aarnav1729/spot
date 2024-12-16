import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaSearch, FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";

// Main Container for Layout
const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px); /* Adjusting for header height */
  background-color: #f5f6f8;
`;
const ActionIcon = styled(FaArrowRight)`
  cursor: pointer;
  color: #0f6ab0;
`;

const PercentageChange = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 14px;
  color: ${(props) => (props.isIncrease ? "green" : "red")};
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WelcomeText = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 600;
`;

const EmployeeDetails = styled.p`
  color: #777;
  font-size: 16px;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f4f7;
  border-radius: 30px;
  padding: 10px 20px;
  width: 25%;
  margin-right: 20px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: #333;
`;

const SearchIcon = styled(FaSearch)`
  margin-right: 10px;
  color: #0f6ab0;
`;

const Button = styled.button`
  background-color: ${(props) => (props.active ? "#0f6ab0" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#0f6ab0")};
  border: 2px solid #0f6ab0;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0f6ab0;
    color: white;
  }
`;

/* New Container to Group Status Cards */
const StatusCardGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  width: max-content; /* Adjust the width to fit content */
  margin-left: auto; /* Center the group horizontally */
  margin-right: auto; /* Center the group horizontally */
`;

const StatusCardContainer = styled.div`
  display: flex;
  align-items: stretch;
  margin: 10px 0;
  flex-wrap: wrap;
  justify-content: flex-start;
  border-radius: 10px;
  border: 1px solid #666; /* Change border to darker gray */
`;

/* Add border to each Status Card */
const StatusCard = styled.div`
  background-color: #ffffff;
  color: #000; /* Change text color to black */
  width: 170px;
  border-right: 1px solid #666; /* Change border to darker gray */
  padding: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:last-child {
    border-right: none; /* Removes border for the last card */
  }
`;

const StatusTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
`;

const StatusCount = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border-bottom: 2px solid #cccccc;
  padding: 12px;
  text-align: left;
  background-color: #f9f9f9;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10000;
`;

const TableData = styled.td`
  border-bottom: 1px solid #e0e0e0;
  padding: 12px;
  font-family: "Montserrat", sans-serif;
`;

const PriorityStar = styled.span`
  color: gold;
  font-size: 20px;
  cursor: pointer;
`;

const CreateTicketButton = styled.button`
  position: absolute;
  top: 90px; /* Adjusted to ensure it is below the sticky header */
  right: 20px;
  background-color: #61b847;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  width: 700px;
  max-width: 90%;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const CloseButton = styled.span`
  cursor: pointer;
  font-size: 24px;
  color: #999;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ModalBody = styled.div`
  margin-top: 20px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
`;

const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
  font-size: 16px;
  color: #444;

  strong {
    width: 200px;
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
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ModalFooter = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background-color: #0f6ab0;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: #000;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]); // State for filtered tickets
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [statusCounts, setStatusCounts] = useState({});
  const [viewMode, setViewMode] = useState("assignedByMe");
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updatedExpectedDate, setUpdatedExpectedDate] = useState("");
  const [updatedPriority, setUpdatedPriority] = useState("");
  const [statusDataState, setStatusDataState] = useState([]);
  // Editable fields
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedAssigneeDept, setUpdatedAssigneeDept] = useState("");
  const [updatedAssigneeSubDept, setUpdatedAssigneeSubDept] = useState("");
  const [updatedAssigneeEmpID, setUpdatedAssigneeEmpID] = useState("");

  // Dropdown options
  const [assigneeDepts, setAssigneeDepts] = useState([]);
  const [assigneeSubDepts, setAssigneeSubDepts] = useState([]);
  const [assigneeEmpIDs, setAssigneeEmpIDs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
          navigate("/login");
          return;
        }

        // Fetch user data
        const userResponse = await axios.get("http://localhost:5000/api/user", {
          params: { email: storedUsername },
        });
        setUserData(userResponse.data);

        console.log("username is", storedUsername);

        // Fetch tickets assigned to the user by default
        fetchTickets("assignedByMe", userResponse.data.EmpID);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  const fetchTickets = async (mode, empID) => {
    try {
      const response = await axios.get("http://localhost:5000/api/tickets", {
        params: {
          mode,
          empID,
        },
      });
      setTickets(response.data.tickets);
      setStatusCounts(response.data.statusCounts);
      // Calculate percentage changes
      const previousCounts = response.data.previousStatusCounts;
      const currentCounts = response.data.statusCounts;

      const calculatePercentageChange = (current, previous) => {
        if (previous === 0) {
          if (current === 0) return 0;
          return 100; // Avoid division by zero
        }
        return ((current - previous) / previous) * 100;
      };

      const statusDataArray = [
        {
          key: "total",
          title: "Total",
          color: "#FF6F61",
          count: currentCounts.total,
          previousCount: previousCounts.total,
        },
        {
          key: "unassigned",
          title: "Date Unassigned",
          color: "#FBC02D",
          count: currentCounts.unassigned,
          previousCount: previousCounts.unassigned,
        },
        {
          key: "inProgress",
          title: "In-Progress",
          color: "#4CAF50",
          count: currentCounts.inProgress,
          previousCount: previousCounts.inProgress,
        },
        {
          key: "overdue",
          title: "Overdue",
          color: "#E53935",
          count: currentCounts.overdue,
          previousCount: previousCounts.overdue,
        },
        {
          key: "resolved",
          title: "Resolved",
          color: "#1E88E5",
          count: currentCounts.resolved,
          previousCount: previousCounts.resolved,
        },
        {
          key: "closed",
          title: "Closed",
          color: "#8E24AA",
          count: currentCounts.closed,
          previousCount: previousCounts.closed,
        },
      ];

      // Update statusData with percentage changes
      const updatedStatusData = statusDataArray.map((status) => {
        const percentageChange = calculatePercentageChange(
          status.count,
          status.previousCount
        );

        let isIncrease;
        if (["unassigned", "overdue"].includes(status.key)) {
          // For "Date Unassigned" and "Overdue", an increase is bad
          isIncrease = percentageChange <= 0;
        } else {
          // For other statuses, an increase is good
          isIncrease = percentageChange >= 0;
        }

        return {
          ...status,
          percentageChange: Math.abs(percentageChange.toFixed(2)),
          isIncrease,
        };
      });

      setStatusDataState(updatedStatusData);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleCreateTicket = () => {
    navigate("/ticket");
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredTickets(tickets); // Show all tickets when search is cleared
      return;
    }

    const filtered = tickets.filter((ticket) =>
      Object.values(ticket).some((value) => {
        if (value === null || value === undefined) return false; // Skip null/undefined values
        if (typeof value !== "string" && typeof value !== "number")
          return false; // Skip non-string/number fields
        return value.toString().toLowerCase().includes(term); // Check if term is included
      })
    );

    setFilteredTickets(filtered);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    fetchTickets(mode, userData.EmpID);
  };

  // Fetch SubDepartments when Assignee Department changes
  useEffect(() => {
    if (updatedAssigneeDept) {
      axios
        .get("http://localhost:5000/api/subdepartments", {
          params: { department: updatedAssigneeDept },
        })
        .then((response) => {
          setAssigneeSubDepts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subdepartments:", error);
        });
    } else {
      setAssigneeSubDepts([]);
    }
    setUpdatedAssigneeSubDept("");
    setAssigneeEmpIDs([]);
    setUpdatedAssigneeEmpID("");
  }, [updatedAssigneeDept]);

  // Fetch Employees when Assignee SubDept changes
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
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    } else {
      setAssigneeEmpIDs([]);
    }
    setUpdatedAssigneeEmpID("");
  }, [updatedAssigneeSubDept]);

  // Update the click handler to navigate to STicket page
  const handleActionClick = (ticket) => {
    const storedUsername = localStorage.getItem("username");
    const fullEmailUser = `${storedUsername}@premierenergies.com`; // Append domain
    navigate(`/ticket/${ticket.Ticket_Number}`, {
      state: { ticket, emailUser: fullEmailUser },
    });
  };

  const handleModalSubmit = async () => {
    try {
      const updatedTicketData = {
        Ticket_Number: selectedTicket.Ticket_Number,
        Expected_Completion_Date: updatedExpectedDate,
        Ticket_Priority: updatedPriority,
        TStatus: updatedStatus,
        Assignee_Dept: updatedAssigneeDept,
        Assignee_SubDept: updatedAssigneeSubDept,
        Assignee_EmpID: updatedAssigneeEmpID,
      };
      await axios.post(
        "http://localhost:5000/api/update-ticket",
        updatedTicketData
      );

      // Update the tickets state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.Ticket_Number === selectedTicket.Ticket_Number
            ? {
                ...ticket,
                Expected_Completion_Date: updatedExpectedDate,
                Ticket_Priority: updatedPriority,
                TStatus: updatedStatus,
                Assignee_Dept: updatedAssigneeDept,
                Assignee_SubDept: updatedAssigneeSubDept,
                Assignee_EmpID: updatedAssigneeEmpID,
              }
            : ticket
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  return (
    <div>
      <Container>
        <Sidebar activeTab="User Profile" />
        <Content>
          <CreateTicketButton onClick={handleCreateTicket}>
            Create Ticket
          </CreateTicketButton>
          <WelcomeText>Welcome Back {userData.EmpName}!</WelcomeText>
          <EmployeeDetails>
            Employee ID: {userData.EmpID}
            <br />
            Department: {userData.Dept}
          </EmployeeDetails>

          <StatusCardGroup>
            <StatusCardContainer>
              {statusDataState.map((status, index) => (
                <StatusCard key={index} color={status.color}>
                  <StatusTitle>{status.title}</StatusTitle>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <StatusCount>{status.count || 0}</StatusCount>
                    <PercentageChange isIncrease={status.isIncrease}>
                      {status.isIncrease ? (
                        <FaArrowUp style={{ marginRight: "5px" }} />
                      ) : (
                        <FaArrowDown style={{ marginRight: "5px" }} />
                      )}
                      {status.percentageChange}%
                    </PercentageChange>
                  </div>
                </StatusCard>
              ))}
            </StatusCardContainer>
          </StatusCardGroup>

          <ButtonGroup>
            <SearchBar>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search Your Tickets"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchBar>
            <Button
              active={viewMode === "assignedByMe"}
              onClick={() => handleViewModeChange("assignedByMe")}
            >
              Assigned by Me
            </Button>
            <Button
              active={viewMode === "assignedToMe"}
              onClick={() => handleViewModeChange("assignedToMe")}
            >
              Assigned to Me
            </Button>
          </ButtonGroup>

          <Table>
            <thead>
              <tr>
                <TableHeader>Ticket Number</TableHeader>
                <TableHeader>Creation Date</TableHeader>
                <TableHeader>Ticket Title</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>
                  {viewMode === "assignedToMe" ? "Assigned By" : "Assigned To"}
                </TableHeader>
                <TableHeader>Deadline</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.Ticket_Number}>
                  <TableData>{ticket.Ticket_Number}</TableData>
                  <TableData>
                    {ticket.Creation_Date
                      ? new Date(ticket.Creation_Date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </TableData>
                  <TableData>{ticket.Ticket_Title}</TableData>
                  <TableData>{ticket.Ticket_Priority}</TableData>
                  <TableData>
                    {viewMode === "assignedToMe"
                      ? ticket.Reporter_Name // Use Reporter_Name in "Assigned By" view
                      : ticket.Assignee_Name}{" "}
                  </TableData>
                  <TableData>
                    {ticket.Expected_Completion_Date
                      ? (() => {
                          const expectedDate = new Date(
                            ticket.Expected_Completion_Date
                          );
                          const currentDate = new Date();
                          // Reset time components to midnight to avoid partial day differences
                          expectedDate.setHours(0, 0, 0, 0);
                          currentDate.setHours(0, 0, 0, 0);
                          const timeDiff = expectedDate - currentDate;
                          const daysDiff = Math.ceil(
                            timeDiff / (1000 * 60 * 60 * 24)
                          );

                          if (daysDiff > 0) {
                            return `In ${daysDiff} day${
                              daysDiff !== 1 ? "s" : ""
                            }`;
                          } else if (daysDiff === 0) {
                            return "Today";
                          } else {
                            return `Overdue by ${Math.abs(daysDiff)} day${
                              Math.abs(daysDiff) !== 1 ? "s" : ""
                            }`;
                          }
                        })()
                      : "N/A"}
                  </TableData>
                  <TableData>{ticket.TStatus}</TableData>
                  <TableData>
                    <ActionIcon onClick={() => handleActionClick(ticket)} />
                  </TableData>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal */}
          {showModal && selectedTicket && (
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>
                  <h2>Ticket Details</h2>
                  <CloseButton onClick={() => setShowModal(false)}>
                    ×
                  </CloseButton>
                </ModalHeader>
                <ModalBody>
                  {/* Display ticket details */}
                  <DetailRow>
                    <strong>Ticket Number:</strong>{" "}
                    {selectedTicket.Ticket_Number}
                  </DetailRow>
                  <DetailRow>
                    <strong>Creation Date:</strong>{" "}
                    {selectedTicket.Creation_Date}
                  </DetailRow>
                  <DetailRow>
                    <strong>Ticket Title:</strong> {selectedTicket.Ticket_Title}
                  </DetailRow>
                  <DetailRow>
                    <strong>Description:</strong>{" "}
                    {selectedTicket.Ticket_Description}
                  </DetailRow>
                  <DetailRow>
                    <strong>Ticket Type:</strong> {selectedTicket.Ticket_Type}
                  </DetailRow>
                  <DetailRow>
                    <strong>Sub Task:</strong> {selectedTicket.Sub_Task}
                  </DetailRow>
                  <DetailRow>
                    <strong>Task Label:</strong> {selectedTicket.Task_Label}
                  </DetailRow>
                  <DetailRow>
                    <strong>Ticket Priority:</strong>{" "}
                    {selectedTicket.Ticket_Priority}
                  </DetailRow>
                  <DetailRow>
                    <strong>Assignee Department:</strong>{" "}
                    {selectedTicket.Assignee_Dept}
                  </DetailRow>
                  <DetailRow>
                    <strong>Assignee SubDept:</strong>{" "}
                    {selectedTicket.Assignee_SubDept}
                  </DetailRow>
                  <DetailRow>
                    <strong>Assignee Employee ID:</strong>{" "}
                    {selectedTicket.Assignee_EmpID}
                  </DetailRow>
                  <DetailRow>
                    <strong>Reporter Location:</strong>{" "}
                    {selectedTicket.Reporter_Location}
                  </DetailRow>
                  <DetailRow>
                    <strong>Reporter Department:</strong>{" "}
                    {selectedTicket.Reporter_Department}
                  </DetailRow>
                  <DetailRow>
                    <strong>Reporter Employee ID:</strong>{" "}
                    {selectedTicket.Reporter_EmpID}
                  </DetailRow>
                  <DetailRow>
                    <strong>Reporter Name:</strong>{" "}
                    {selectedTicket.Reporter_Name}
                  </DetailRow>
                  <DetailRow>
                    <strong>Reporter Email:</strong>{" "}
                    {selectedTicket.Reporter_Email}
                  </DetailRow>
                  <DetailRow>
                    <strong>Status:</strong> {selectedTicket.TStatus}
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
                      onChange={(e) =>
                        setUpdatedAssigneeSubDept(e.target.value)
                      }
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
                </ModalBody>
                <ModalFooter>
                  <SubmitButton onClick={handleModalSubmit}>
                    Submit
                  </SubmitButton>
                  <CancelButton onClick={() => setShowModal(false)}>
                    Cancel
                  </CancelButton>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}
        </Content>
      </Container>
    </div>
  );
};

export default Dashboard;
