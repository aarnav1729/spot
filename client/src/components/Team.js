import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import axios from "axios";

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  background-color: #e8f5e9;
  overflow: auto;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(135deg, #f3f9fd 0%, #ffffff 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h1`
  color: #0f6ab0;
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 40px;
`;

const TeamMemberCard = styled.div`
  background: linear-gradient(135deg, #ffebee 0%, #e3f2fd 100%);
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 180px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const TeamMemberName = styled.h3`
  color: #d32f2f;
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: bold;
`;

const TeamMemberDetails = styled.p`
  color: #388e3c;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
`;

const Team = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEmpID = localStorage.getItem("empID");
        if (!storedEmpID) {
          console.error("Employee ID missing in local storage");
          setLoading(false);
          return;
        }

        // Fetch the employees in the same department
        const response = await axios.get("http://localhost:5000/api/team-structure", {
          params: { empID: storedEmpID },
        });

        if (response.data && response.data.employees) {
          setEmployees(response.data.employees);
        } else {
          console.warn("No employees data received");
        }
      } catch (error) {
        console.error("Error fetching team structure:", error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Sidebar activeTab="Team Structure" />
        <Content>
          <Title>Loading Team Structure...</Title>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar activeTab="Team Structure" />
      <Content>
        <Title>Team Structure</Title>
        <ChartContainer>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TeamMemberCard key={employee.EmpID}>
                <TeamMemberName>{employee.EmpName}</TeamMemberName>
                <TeamMemberDetails>Employee ID: {employee.EmpID}</TeamMemberDetails>
              </TeamMemberCard>
            ))
          ) : (
            <p>No employees found in your department.</p>
          )}
        </ChartContainer>
      </Content>
    </Container>
  );
};

export default Team;