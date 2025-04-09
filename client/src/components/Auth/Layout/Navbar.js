import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/mealprepmate">Home</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/recipes">Recipes</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/grocery-list">Grocery List</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;