import React, { useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Contexts/UserContext";

const SignUp = () => {

  const { currentUser, setCurrentUser, logIn} = useContext(UserContext); 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newUser = { email, name, password }; //  Define newUser before sending
    try {
        const response = await fetch("/signUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });
        const result = await response.json();
        if (response.ok) {
            setCurrentUser(result.user);
            logIn(result.user)
            setEmail("");
            setName("");
            setError("");
            setSuccessMessage("Sign up successful!");
            setTimeout(() => navigate("/"), 2000); // ✅ Redirect to home after signup
        } else {
            setError(result.message);
        }
    } catch (error) {
        setError("Could not create account. Please try again.");
    }
};

return (
    <div>
      <section>
        <h3>Already have an account?</h3>
        <p>Click here to log in!</p>
        <button onClick={() => navigate("/signIn")}>Log In</button>
      </section>

      <section>
        {currentUser && !successMessage ? (
          <>
            <p>You're already signed in.</p>
            <p>Please sign out first if you wish to sign up with a different account.</p>
          </>
        ) : currentUser && successMessage ? (
          <div>
            <h3>{successMessage}</h3>
            <p>Welcome to PrepMealMate!</p>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
            <h3>Create an Account</h3>
            <p>Please fill out all entries</p>

            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  setError('');
                }}
              />
            </div>

            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(ev) => {
                  setName(ev.target.value);
                  setError('');
                }}
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                  setError('');
                }}
              />
            </div>

            <button type="submit" disabled={!email || !name || !password}>
              Sign Up
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        )}
      </section>
    </div>
  );
};

export default SignUp;