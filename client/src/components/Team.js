import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px); /* Adjusting for header height */
  background-color: #E8F5E9;
  overflow: auto;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(135deg, #F3F9FD 0%, #FFFFFF 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h1`
  color: #0F6AB0;
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
  background: linear-gradient(135deg, #FFEBEE 0%, #E3F2FD 100%);
  border: 1px solid #E0E0E0;
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
  color: #D32F2F;
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: bold;
`;

const TeamMemberDetails = styled.p`
  color: #388E3C;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
`;

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch team members based on the department of the logged-in user.
    // For now, we use mock data.
    const fetchTeamMembers = async () => {
      const department = localStorage.getItem('department'); // Assuming department info is stored in local storage
      // Mock data for demonstration purposes.
      const members = [
        { name: 'Ashwin Lakra', role: 'Team Lead', id: 'IT001', department: department, reportsTo: null, openTickets: 5 },
        { name: 'Madhur K', role: 'Senior Backend Developer', id: 'IT002', department: department, reportsTo: 'Ashwin Lakra', openTickets: 3 },
        { name: 'Nilesh G', role: 'Frontend Developer', id: 'IT003', department: department, reportsTo: 'Ashwin Lakra', openTickets: 2 },
        { name: 'Meghana T', role: 'UI/UX Designer', id: 'IT004', department: department, reportsTo: 'Madhur K', openTickets: 1 },
      ];
      setTeamMembers(members);
    };

    fetchTeamMembers();
  }, []);

  // Utility function to find subordinates for a given team member
  const findSubordinates = (name) => {
    return teamMembers.filter(member => member.reportsTo === name);
  };

  // Recursive function to generate TreeNodes
  const renderTreeNode = (member) => (
    <TreeNode
      label={
        <TeamMemberCard>
          <TeamMemberName>{member.name}</TeamMemberName>
          <TeamMemberDetails>Role: {member.role}</TeamMemberDetails>
          <TeamMemberDetails>Employee ID: {member.id}</TeamMemberDetails>
          <TeamMemberDetails>Open Tickets: {member.openTickets}</TeamMemberDetails>
        </TeamMemberCard>
      }
    >
      {findSubordinates(member.name).map(subordinate => renderTreeNode(subordinate))}
    </TreeNode>
  );

  const teamLead = teamMembers.find(member => member.reportsTo === null);

  return (
    <div>
      <Container>
        <Sidebar activeTab="Team Structure" />
        <Content>
          <Title>Team Structure</Title>
          <ChartContainer>
            {teamLead && (
              <Tree
                lineWidth={"3px"}
                lineColor={"#FF7043"}
                lineBorderRadius={"10px"}
                label={
                  <TeamMemberCard>
                    <TeamMemberName>{teamLead.name}</TeamMemberName>
                    <TeamMemberDetails>Role: {teamLead.role}</TeamMemberDetails>
                    <TeamMemberDetails>Employee ID: {teamLead.id}</TeamMemberDetails>
                    <TeamMemberDetails>Open Tickets: {teamLead.openTickets}</TeamMemberDetails>
                  </TeamMemberCard>
                }
              >
                {findSubordinates(teamLead.name).map(subordinate => renderTreeNode(subordinate))}
              </Tree>
            )}
          </ChartContainer>
        </Content>
      </Container>
    </div>
  );
};

export default Team;