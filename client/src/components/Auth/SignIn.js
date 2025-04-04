import React, { useState, useContext } from 'react';
import axios from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Contexts/UserContext"
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [ status, setStatus ] = useState("idle");
  const [password, setPassword] = useState('');
  const [ showError, setShowError ] = useState("false");
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const { currentUser, setCurrentUser, logIn } = useContext(UserContext); 


  const handleSubmit = async (ev) => {
        try {
            ev.preventDefault();
            setShowError("false");
            setError("");
            setStatus("logging")
            const logInData = {
                email,
                password
            }
            const body = JSON.stringify( logInData );
            const options = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body
            };
            const response = await fetch('/logIn', options); 
            const data = await response.json();
            if (data.status !== 200) {
                setStatus("idle");
                setShowError("true")
                setError("We could not find an account with that email...");
            } else {
            setCurrentUser( data.data);
            navigate(`/`);
            logIn(data.data)
            }

        } catch (err) {
            setStatus("idle");
            setShowError("true");
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
            <p>Sign up to buy our Techwear!</p>
            <button onClick={() => navigate("/signUp")}>Sign Up</button>
          </div>
        </div>
      );
    };

export default SignIn;