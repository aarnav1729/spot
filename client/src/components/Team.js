import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import { Tree, TreeNode } from "react-organizational-chart";
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
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow: visible;
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
  const [loggedInUser, setLoggedInUser] = useState(null); // Organizational chart data
  const [loading, setLoading] = useState(true); // Loading state

  // Recursive function to render the organizational chart
  const renderTree = (node) => {
    if (!node) return null; // Handle edge case where node is undefined or null
    return (
      <TreeNode
        label={
          <TeamMemberCard>
            <TeamMemberName>{node.empName}</TeamMemberName>
            <TeamMemberDetails>Employee ID: {node.empID}</TeamMemberDetails>
          </TeamMemberCard>
        }
      >
        {node.children.map((child) => renderTree(child))}
      </TreeNode>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEmpID = localStorage.getItem("empID");
        if (!storedEmpID) {
          console.error("Employee ID missing in local storage");
          setLoading(false);
          return;
        }

        // Fetch the organizational chart data
        const response = await axios.get("http://localhost:5000/api/team-structure", {
          params: { empID: storedEmpID },
        });
        

        if (response.data && response.data.orgChart) {
          setLoggedInUser(response.data.orgChart);
        } else {
          console.warn("No organizational chart data received");
          setLoggedInUser(null);
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
    <div>
      <Container>
        <Sidebar activeTab="Team Structure" />
        <Content>
          <Title>Team Structure</Title>
          <ChartContainer>
            {loggedInUser ? (
              <Tree
                lineWidth={"3px"}
                lineColor={"#ff7043"}
                lineBorderRadius={"10px"}
                label={
                  <TeamMemberCard>
                    <TeamMemberName>{loggedInUser.empName}</TeamMemberName>
                    <TeamMemberDetails>
                      Employee ID: {loggedInUser.empID}
                    </TeamMemberDetails>
                  </TeamMemberCard>
                }
              >
                {loggedInUser.children.map((child) => renderTree(child))}
              </Tree>
            ) : (
              <p>No team structure available.</p>
            )}
          </ChartContainer>
        </Content>
      </Container>
    </div>
  );
};

export default Team;