import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaSearch, FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
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

const SearchIcon = styled(FaSearch)`
  margin-right: 10px;
  color: #0f6ab0;
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

const StatusCardGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  width: max-content;
  margin-left: auto;
  margin-right: auto;
`;

const StatusCardContainer = styled.div`
  display: flex;
  align-items: stretch;
  margin: 10px 0;
  flex-wrap: wrap;
  justify-content: flex-start;
  border-radius: 10px;
  border: 1px solid #666;
`;

const StatusCard = styled.div`
  background-color: #ffffff;
  color: #000;
  width: 170px;
  border-right: 1px solid #666;
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
    border-right: none;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 25px;
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
  color: #0f6ab0;
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

const CreateTicketButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #61b847;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
`;

const DepartmentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]); // To store filtered tickets
  const [searchTerm, setSearchTerm] = useState(""); // To store search input
  const [statusCounts, setStatusCounts] = useState({});
  const [viewMode, setViewMode] = useState("assignedByDept");
  const [statusDataState, setStatusDataState] = useState([]);

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

        // Fetch department tickets assigned by the department by default
        fetchTickets("assignedByDept", userResponse.data.Dept);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const fetchTickets = async (mode, department) => {
    try {
      const response = await axios.get("http://localhost:5000/api/tickets", {
        params: {
          mode,
          department,
        },
      });
      setTickets(response.data.tickets);
      setFilteredTickets(response.data.tickets);

      setStatusCounts(response.data.statusCounts);

      // Calculate percentage changes
      const previousCounts = response.data.previousStatusCounts;
      const currentCounts = response.data.statusCounts;

      const calculatePercentageChange = (current, previous) => {
        if (previous === 0) {
          if (current === 0) return 0;
          return 100;
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

      const updatedStatusData = statusDataArray.map((status) => {
        const percentageChange = calculatePercentageChange(
          status.count,
          status.previousCount
        );

        let isIncrease;
        if (["unassigned", "overdue"].includes(status.key)) {
          isIncrease = percentageChange <= 0;
        } else {
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

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    fetchTickets(mode, userData.Dept);
  };

  useEffect(() => {
    setFilteredTickets(tickets); // Sync filteredTickets with tickets
  }, [tickets]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredTickets(tickets); // Reset to all tickets when search is cleared
      return;
    }

    const filtered = tickets.filter((ticket) =>
      Object.values(ticket).some((value) => {
        if (value === null || value === undefined) return false; // Skip null/undefined
        if (typeof value !== "string" && typeof value !== "number")
          return false; // Skip non-string/number
        return value.toString().toLowerCase().includes(term);
      })
    );

    setFilteredTickets(filtered);
  };

  const handleActionClick = (ticket) => {
    const storedUsername = localStorage.getItem("username");
    const fullEmailUser = `${storedUsername}@premierenergies.com`;
    navigate(`/ticket/${ticket.Ticket_Number}`, {
      state: { ticket, emailUser: fullEmailUser },
    });
  };

  return (
    <div>
      <Container>
        <Sidebar activeTab="Department" />
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
                placeholder="Search Department Tickets"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchBar>
            <Button
              active={viewMode === "assignedByDept"}
              onClick={() => handleViewModeChange("assignedByDept")}
            >
              Assigned by Me
            </Button>
            <Button
              active={viewMode === "assignedToDept"}
              onClick={() => handleViewModeChange("assignedToDept")}
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
                  {viewMode === "assignedToDept"
                    ? "Assigned By"
                    : "Assigned To"}
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
                    {viewMode === "assignedToDept"
                      ? ticket.Reporter_Name
                      : ticket.Assignee_Name}
                  </TableData>
                  <TableData>
                    {ticket.Expected_Completion_Date
                      ? (() => {
                          const expectedDate = new Date(
                            ticket.Expected_Completion_Date
                          );
                          const currentDate = new Date();
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
        </Content>
      </Container>
    </div>
  );
};

export default DepartmentDashboard;
