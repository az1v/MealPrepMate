import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../src/components/Contexts/UserContext";
import styled from "styled-components";

// Styled Components
const HomeWrapper = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #222;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h3`
  font-size: 1.3rem;
  color: #555;
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  color: #0077ff;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #005bd1;
  }
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #444;
`;

function Home() {
  const { currentUser } = useContext(UserContext);

  return (
    <HomeWrapper>
      <Title>Meal Prep Mate</Title>
      <Subtitle>Where you can get recipes by ingredients, add them to your favorites list and create a grocery list of the missing ingredients</Subtitle>

      {!currentUser ? (
        <Paragraph>
          Please <StyledLink to="/signin">Sign In</StyledLink> or{" "}
          <StyledLink to="/signup">Sign Up</StyledLink> to enjoy our website!
        </Paragraph>
      ) : (
        <Paragraph>
          Welcome back, <strong>{currentUser.name || currentUser.email}</strong>! 👋
        </Paragraph>
      )}
    </HomeWrapper>
  );
}

export default Home;