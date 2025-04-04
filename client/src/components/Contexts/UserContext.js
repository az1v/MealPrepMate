import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
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
    }, []);

    const logIn = (user) => {
        localStorage.setItem("email", user.email);
        localStorage.setItem("password", user.password); // Insecure: avoid in production
        setCurrentUser(user);
    };

    const logOut = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        setCurrentUser(null);
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, logIn, logOut }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;