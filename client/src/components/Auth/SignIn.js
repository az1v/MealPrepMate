import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Contexts/UserContext";
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Heading = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  color: #555;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0077ff;
  }
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: #0077ff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bd1;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  margin-top: 1rem;
  color: red;
  font-weight: 500;
`;

const Section = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState("idle");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  // Working logout handler
  const handleLogout = async () => {
    try {
      await fetch("/signout", {
        method: "POST",
        credentials: "include",
      });

      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setShowError(false);
    setError('');
    setStatus("logging");

    try {
      const response = await fetch('/signin', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        setStatus("idle");
        setShowError(true);
        setError(data.message || "Could not log in. Please try again.");
      } else {
        setCurrentUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user)); // Optional
        navigate("/");
      }
    } catch (err) {
      setStatus("idle");
      setShowError(true);
      setError("Could not log in. Please try again.");
    }
  };

  return (
    <Container>
      {currentUser ? (
        <Section>
          <Paragraph>You're already signed in as <strong>{currentUser.email}</strong>.</Paragraph>
          <Button onClick={handleLogout}>🚪 Log Out</Button>
        </Section>
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <Heading>Log In</Heading>
            <Paragraph>Please enter your information</Paragraph>

            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value);
                setShowError(false);
                setError('');
              }}
              required
            />

            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
                setShowError(false);
                setError('');
              }}
              required
            />

            <Button type="submit" disabled={!email || status === "logging"}>
              {status === "logging" ? "Logging in..." : "Log In"}
            </Button>

            {showError && <Error>{error}</Error>}
          </Form>

          <Section>
            <Heading>New Here?</Heading>
            <Paragraph>Sign up to find meals and plan your prep!</Paragraph>
            <Button onClick={() => navigate("/signUp")}>Sign Up</Button>
          </Section>
        </>
      )}
    </Container>
  );
};

export default SignIn;