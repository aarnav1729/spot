import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Bar, Pie, Line, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartJS_Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartJS_Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px); /* Adjusting for header height */
  background-color: #FFFFFF;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
`;

const DashboardTitle = styled.h1`
  color: #0F6AB0;
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 30px;
  margin-bottom: 40px;
`;

const ChartWrapper = styled.div`
  width: 45%;
  min-width: 300px;
  max-height: 450px;
  background-color: #F7F7F7;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChartTitleStyled = styled.h3`
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
`;

const ChartDescription = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 15px;
`;

const ChartCanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Metrics = () => {
  // Mock data for demonstration purposes
  const barData = {
    labels: ['Open', 'In Progress', 'Closed', 'Overdue', 'Rejected', 'Resolved'],
    datasets: [
      {
        label: 'Tickets Status',
        data: [12, 19, 8, 5, 7, 10],
        backgroundColor: '#F57C00',
      },
    ],
  };

  const pieData = {
    labels: ['IT', 'Finance', 'HR', 'Marketing'],
    datasets: [
      {
        label: 'Tickets by Department',
        data: [25, 15, 20, 10],
        backgroundColor: ['#61B847', '#0F6AB0', '#FFDD00', '#FF6D6D'],
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Tickets Created Over Time',
        data: [10, 15, 8, 20, 18, 25],
        borderColor: '#0F6AB0',
        backgroundColor: 'rgba(15, 106, 176, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        label: 'Priority Levels',
        data: [40, 30, 20],
        backgroundColor: ['#FF6D6D', '#FFDD00', '#61B847'],
      },
    ],
  };

  const stackedBarData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'IT',
        data: [15, 20, 30, 25],
        backgroundColor: '#0F6AB0',
      },
      {
        label: 'Finance',
        data: [10, 25, 20, 30],
        backgroundColor: '#61B847',
      },
      {
        label: 'HR',
        data: [12, 15, 25, 20],
        backgroundColor: '#F57C00',
      },
    ],
  };

  const radarData = {
    labels: ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Technical Skills'],
    datasets: [
      {
        label: 'Team Skills Assessment',
        data: [85, 90, 80, 75, 95],
        backgroundColor: 'rgba(15, 106, 176, 0.2)',
        borderColor: '#0F6AB0',
        pointBackgroundColor: '#0F6AB0',
      },
    ],
  };

  const departmentEfficiencyData = {
    labels: ['IT', 'Finance', 'HR', 'Marketing'],
    datasets: [
      {
        label: 'Department Efficiency (%)',
        data: [85, 78, 90, 72],
        backgroundColor: ['#0F6AB0', '#61B847', '#F57C00', '#FF6D6D'],
      },
    ],
  };

  const polarAreaData = {
    labels: ['IT', 'Finance', 'HR', 'Marketing', 'Sales'],
    datasets: [
      {
        label: 'Departmental Impact Score',
        data: [30, 25, 20, 15, 10],
        backgroundColor: ['#61B847', '#0F6AB0', '#FFDD00', '#FF6D6D', '#F57C00'],
      },
    ],
  };

  return (
    <div>
      <Container>
        <Sidebar activeTab="Metrics" />
        <Content>
          <DashboardTitle>Metrics Dashboard</DashboardTitle>
          <ChartContainer>
            <ChartWrapper>
              <ChartTitleStyled>Tickets Status Overview</ChartTitleStyled>
              <ChartDescription>A breakdown of ticket statuses across different categories. Calculated based on the current number of tickets in each status.</ChartDescription>
              <ChartCanvasWrapper>
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
            <ChartWrapper>
              <ChartTitleStyled>Tickets by Department</ChartTitleStyled>
              <ChartDescription>Distribution of tickets across various departments. Calculated by summing tickets assigned to each department.</ChartDescription>
              <ChartCanvasWrapper>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
          </ChartContainer>
          <ChartContainer>
            <ChartWrapper>
              <ChartTitleStyled>Tickets Created Over Time</ChartTitleStyled>
              <ChartDescription>Tracking the number of tickets created each month over time. Calculated based on ticket creation dates.</ChartDescription>
              <ChartCanvasWrapper>
                <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
            <ChartWrapper>
              <ChartTitleStyled>Priority Levels Breakdown</ChartTitleStyled>
              <ChartDescription>Tickets categorized by priority levels: High, Medium, and Low. Calculated by categorizing tickets based on their priority level.</ChartDescription>
              <ChartCanvasWrapper>
                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
          </ChartContainer>
          <ChartContainer>
            <ChartWrapper>
              <ChartTitleStyled>Quarterly Performance by Department</ChartTitleStyled>
              <ChartDescription>Department performance metrics across each quarter of the year. Calculated based on key performance indicators per department.</ChartDescription>
              <ChartCanvasWrapper>
                <Bar data={stackedBarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
            <ChartWrapper>
              <ChartTitleStyled>Team Skills Assessment</ChartTitleStyled>
              <ChartDescription>Assessment of key skills within the team, based on recent evaluations. Calculated through team member self-assessments and peer reviews.</ChartDescription>
              <ChartCanvasWrapper>
                <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
          </ChartContainer>
          <ChartContainer>
            <ChartWrapper>
              <ChartTitleStyled>Department Efficiency</ChartTitleStyled>
              <ChartDescription>Efficiency levels of different departments in the organization. Calculated as a percentage based on output versus input for each department.</ChartDescription>
              <ChartCanvasWrapper>
                <Doughnut data={departmentEfficiencyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
            <ChartWrapper>
              <ChartTitleStyled>Departmental Impact Score</ChartTitleStyled>
              <ChartDescription>Assessing the impact of each department based on recent metrics. Calculated using various performance and impact indicators.</ChartDescription>
              <ChartCanvasWrapper>
                <PolarArea data={polarAreaData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </ChartCanvasWrapper>
            </ChartWrapper>
          </ChartContainer>
        </Content>
      </Container>
    </div>
  );
};

export default Metrics;