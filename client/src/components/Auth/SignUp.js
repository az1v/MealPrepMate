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

const Section = styled.section`
  margin-bottom: 2rem;
  text-align: center;
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
`;

const Success = styled.div`
  text-align: center;
  color: #2c7a2c;
  margin-top: 2rem;
`;

const SignUp = () => {
  const { currentUser, setCurrentUser, logIn } = useContext(UserContext); 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newUser = { email, name, password };

    try {
      const response = await fetch("/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentUser(result.user);
        logIn(result.user);
        setEmail('');
        setName('');
        setPassword('');
        setError('');
        setSuccessMessage("Sign up successful!");
        setTimeout(() => navigate("/mealprepmate"), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Could not create account. Please try again.");
    }
  };

  return (
    <Container>
      <Section>
        <Heading>Already have an account?</Heading>
        <Paragraph>Click below to log in</Paragraph>
        <Button onClick={() => navigate("/signIn")}>Log In</Button>
      </Section>

      <Section>
        {currentUser && !successMessage ? (
          <>
            <Paragraph>You're already signed in.</Paragraph>
            <Paragraph>Sign out first to create a new account.</Paragraph>
          </>
        ) : currentUser && successMessage ? (
          <Success>
            <h3>{successMessage}</h3>
            <p>Welcome to MealPrepMate!</p>
          </Success>
        ) : (
          <Form onSubmit={handleSignUp}>
            <Heading>Create an Account</Heading>
            <Paragraph>Please fill out all entries</Paragraph>

            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />

            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
            />

            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />

            <Button type="submit" disabled={!email || !name || !password}>
              Sign Up
            </Button>

            {error && <Error>{error}</Error>}
          </Form>
        )}
      </Section>
    </Container>
  );
};

export default SignUp;