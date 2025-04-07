import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Contexts/UserContext";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState("idle");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setShowError(false);
    setError('');
    setStatus("logging");

    try {
      const response = await fetch('http://localhost:8000/signin', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        setStatus("idle");
        setShowError(true);
        setError(data.message || "Could not log in. Please try again.");
      } else {
        setCurrentUser(data.user);
        navigate("/");
      }
    } catch (err) {
      setStatus("idle");
      setShowError(true);
      setError("Could not log in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-section">
        {currentUser ? (
          <section>
            <p>You're already signed in.</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Log In</h3>
            <p>Please enter your information</p>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  setShowError(false);
                  setError('');
                }}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                  setShowError(false);
                  setError('');
                }}
                required
              />
            </div>
            <button type="submit" disabled={!email || status === "logging"}>
              {status === "logging" ? "Logging in..." : "Log In"}
            </button>
            {showError && <p style={{ color: "red" }}>{error}</p>}
          </form>
        )}
      </div>
      <div className="signup-section">
        <h3>New Here?</h3>
        <p>Sign up to find meals and plan your prep!</p>
        <button onClick={() => navigate("/signUp")}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignIn;