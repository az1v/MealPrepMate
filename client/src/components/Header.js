import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../src/components/Contexts/UserContext";
import styled from "styled-components";

const Nav = styled.nav`
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
`;

const NavItem = styled.li`
  margin-left: 1.5rem;

  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #0077ff;
    }
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Greeting = styled.span`
  font-weight: 600;
  color: #555;
`;

const Header = () => {
  const { currentUser, logOut } = useContext(UserContext);

  return (
    <Nav>
      <NavList>
        <LeftGroup>
          <NavItem><Link to="/">Home</Link></NavItem>
        </LeftGroup>

        <RightGroup>
          {!currentUser ? (
            <>
              <NavItem><Link to="/signin">Sign In</Link></NavItem>
              <NavItem><Link to="/signup">Sign Up</Link></NavItem>
            </>
          ) : (
            <>
              <Greeting>Hello, {currentUser.name || currentUser.email}</Greeting>
              <NavItem><Link to="/recipes">Recipes</Link></NavItem>
              <NavItem><Link to="/favorites">Favorites</Link></NavItem>
              <NavItem><Link to="/grocery-list">Grocery List</Link></NavItem>
              <NavItem><Link to="/" onClick={logOut}>Log Out</Link></NavItem>
            </>
          )}
        </RightGroup>
      </NavList>
    </Nav>
  );
};

export default Header;