import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <h1>WELCOME TO MealPrepMate</h1>
      <h3> 
        Where you can get recipes by ingredients.
      </h3>
      <p>Please <Link to="/signin">Sign In</Link> or <Link to="/signup">Sign Up</Link> to enjoy our website! </p>
     
     
    </div>
  );
}

export default Home;