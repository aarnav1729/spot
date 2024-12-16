
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 70px); /* Adjust for header height */
  background: linear-gradient(to bottom right, #f0f4f8, #d9e2ec);

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const TitleInput = styled.input`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 400px;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  box-sizing: border-box;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    width: auto;
    margin: 40px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  color: #0f6ab0;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Input = styled.input`
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 250px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #0f6ab0;
    box-shadow: 0 0 6px rgba(15, 106, 176, 0.2);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 260px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #0f6ab0;
    box-shadow: 0 0 6px rgba(15, 106, 176, 0.2);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 90%;
  max-width: 800px;
  height: 150px;
  margin: 20px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #0f6ab0;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
`;

const Message = styled.p`
  color: ${({ success }) => (success ? "green" : "red")};
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
`;

const CreateTicketPage = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [taskLabels, setTaskLabels] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState("");
  const [selectedSubTask, setSelectedSubTask] = useState("");
  const [selectedTaskLabel, setSelectedTaskLabel] = useState("");

  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the logged-in user's username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      // If no user is logged in, redirect to login page
      navigate("/login");
    } else {
      setReporterEmail(storedUsername);
    }
  }, []);

  // Fetch departments on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  // Fetch subdepartments when department changes
  useEffect(() => {
    if (selectedDepartment) {
      axios
        .get(
          `http://localhost:5000/api/subdepartments?department=${selectedDepartment}`
        )
        .then((response) => {
          setSubDepartments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subdepartments:", error);
        });
    } else {
      setSubDepartments([]);
    }
    // Reset dependent fields
    setSubTasks([]);
    setTaskLabels([]);
    setSelectedSubDepartment("");
    setSelectedSubTask("");
    setSelectedTaskLabel("");
  }, [selectedDepartment]);

  // Fetch subtasks when subdepartment changes
  useEffect(() => {
    if (selectedDepartment && selectedSubDepartment) {
      axios
        .get(
          `http://localhost:5000/api/subtasks?department=${selectedDepartment}&subdepartment=${selectedSubDepartment}`
        )
        .then((response) => {
          setSubTasks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subtasks:", error);
        });
    } else {
      setSubTasks([]);
    }
    // Reset dependent fields
    setTaskLabels([]);
    setSelectedSubTask("");
    setSelectedTaskLabel("");
  }, [selectedSubDepartment]);

  // Fetch task labels when subtask changes
  useEffect(() => {
    if (selectedDepartment && selectedSubDepartment && selectedSubTask) {
      axios
        .get(
          `http://localhost:5000/api/tasklabels?department=${selectedDepartment}&subdepartment=${selectedSubDepartment}&subtask=${selectedSubTask}`
        )
        .then((response) => {
          setTaskLabels(response.data);
        })
        .catch((error) => {
          console.error("Error fetching task labels:", error);
        });
    } else {
      setTaskLabels([]);
    }
    setSelectedTaskLabel("");
  }, [selectedSubTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure reporterEmail is available
    if (!reporterEmail) {
      setErrorMessage("User not logged in. Please log in again.");
      return;
    }

    const ticketData = {
      title: ticketTitle,
      type: ticketType,
      department: selectedDepartment,
      subDepartment: selectedSubDepartment,
      subTask: selectedSubTask,
      taskLabel: selectedTaskLabel,
      priority: ticketPriority,
      description: ticketDescription,
      reporterEmail: reporterEmail, // You should replace this with the actual email
    };

    axios
      .post("http://localhost:5000/api/create-ticket", ticketData)
      .then((response) => {
        setSuccessMessage(
          "Your ticket was created successfully and auto-assigned, please check your inbox for a confirmation email!"
        );
        setErrorMessage("");

        // Clear form fields
        setTicketTitle("");
        setTicketType("");
        setSelectedDepartment("");
        setSelectedSubDepartment("");
        setSelectedSubTask("");
        setSelectedTaskLabel("");
        setTicketPriority("");
        setTicketDescription("");

        // Clear dependent fields
        setSubDepartments([]);
        setSubTasks([]);
        setTaskLabels([]);
      })
      .catch((error) => {
        setErrorMessage(
          "An error occurred while creating the ticket. Please try again."
        );
        setSuccessMessage("");
        console.error("Error creating ticket:", error);
      });
  };

  return (
    <div>
      <Container>
        <Sidebar activeTab="Create Ticket" />
        <Content>
          <Title>Create New Ticket</Title>
          <Subtitle>
            All fields are mandatory and must be filled before ticket submission
          </Subtitle>
          <Form onSubmit={handleSubmit}>
            <InputRow>
              <TitleInput
                type="text"
                placeholder="Ticket Title:"
                required
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
              />
              <Select
                required
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
              >
                <option value="">Ticket Type:</option>
                <option value="Task">Task</option>
                <option value="Issue">Issue</option>
                <option value="Change Management">Change Management</option>
              </Select>
              <Select
                required
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Department:</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
              <Select
                required
                value={selectedSubDepartment}
                onChange={(e) => setSelectedSubDepartment(e.target.value)}
              >
                <option value="">Sub-Department:</option>
                {subDepartments.map((subDept, index) => (
                  <option key={index} value={subDept}>
                    {subDept}
                  </option>
                ))}
              </Select>
              <Select
                required
                value={selectedSubTask}
                onChange={(e) => setSelectedSubTask(e.target.value)}
              >
                <option value="">Subtask:</option>
                {subTasks.map((subTask, index) => (
                  <option key={index} value={subTask}>
                    {subTask}
                  </option>
                ))}
              </Select>
              <Select
                required
                value={selectedTaskLabel}
                onChange={(e) => setSelectedTaskLabel(e.target.value)}
              >
                <option value="">Task Label:</option>
                {taskLabels.map((label, index) => (
                  <option key={index} value={label}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select
                required
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value)}
              >
                <option value="">Ticket Priority:</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </InputRow>
            <TextArea
              placeholder="Ticket Description:"
              required
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
            ></TextArea>
            <SubmitButton type="submit">Create Ticket</SubmitButton>
          </Form>
          {successMessage && (
            <p style={{ color: "green", textAlign: "center" }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
        </Content>
      </Container>
    </div>
  );
};

export default CreateTicketPage;