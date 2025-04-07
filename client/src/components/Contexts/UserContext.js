import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'

  useEffect(() => {
    // Auto-login
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      const body = JSON.stringify({ email: savedEmail, password: savedPassword });

      fetch("/logIn", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body,
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            setCurrentUser(data.data);
          }
        })
        .catch((error) => console.error("Auto-login failed:", error));
    }

    // Theme load from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      // Add dark.css
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/dark.css";
      link.id = "dark-mode-style";
      document.head.appendChild(link);
    } else {
      // Remove dark.css if exists
      const darkLink = document.getElementById("dark-mode-style");
      if (darkLink) {
        darkLink.remove();
      }
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const logIn = (user) => {
    localStorage.setItem("email", user.email);
    localStorage.setItem("password", user.password); // 🔥 Don't do this in production
    setCurrentUser(user);
  };

  const logOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logIn, logOut, theme, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;