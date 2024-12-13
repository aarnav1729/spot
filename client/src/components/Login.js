import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SVideo from "../assets/spot.mp4";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 70px); /* Adjusting for header height */
  overflow: hidden; /* Prevents scrollbars */
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column-reverse; /* Stack the video below the form on mobile */
  }
`;

const LeftHalf = styled.div`
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensures no scrollbars due to video */
  @media (max-width: 768px) {
    height: 300px; /* Set a fixed height on mobile */
  }
`;

const RightHalf = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Heading = styled.h1`
  color: #0f6ab0;
  font-size: 48px;
  margin-bottom: 30px;
  @media (max-width: 768px) {
    font-size: 36px;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 18px;
  color: #000000;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 15px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const EmailInputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;
const EmailInput = styled.input`
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  padding-right: 120px; /* Space for the fixed text */
  @media (max-width: 768px) {
    padding-right: 140px; /* Adjusted for smaller screens */
  }
`;

const FixedText = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  font-size: 18px;
  font-family: "Montserrat";
  
  color: #0d1c08;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  @media (max-width: 768px) {
    right: 12px;
    font-size: 14px;
  }
`;

const SubmitButton = styled.button`
  background-color: #0f6ab0;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  padding: 15px;
  font-size: 18px;
  cursor: pointer;
  width: 200px;
  align-self: center;
  margin-bottom: 20px;
`;

const ForgotPassword = styled.p`
  color: #0d1c08;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const [emailUser, setEmailUser] = useState("");
  const [password, setPassword] = useState("");
  const [empID, setEmpID] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleEmailChange = (e) => {
    // Prevent the user from typing '@' and beyond
    const value = e.target.value.split("@")[0];
    setEmailUser(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email: emailUser,
        password: password,
      });

      // Login successful
      setErrorMessage("");

      // Store user information in localStorage
      localStorage.setItem("username", emailUser);

      console.log(emailUser);
      navigate("/profile");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Your Username or Password are incorrect");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container>
      <Content>
        <LeftHalf>
          <Video autoPlay loop muted playsInline>
            <source src={SVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>
        </LeftHalf>
        <RightHalf>
          <Heading>Welcome Back!</Heading>
          <Form onSubmit={handleSubmit}>
            <Label htmlFor="username">Username</Label>
            <EmailInputContainer>
              <EmailInput
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={emailUser}
                onChange={handleEmailChange}
                required
              />
              <FixedText>@premierenergies.com</FixedText>
            </EmailInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <SubmitButton type="submit">Submit</SubmitButton>
          </Form>
          <ForgotPassword onClick={handleForgotPassword}>
            Forgot Password?
          </ForgotPassword>
        </RightHalf>
      </Content>
    </Container>
  );
};


export default Login;