import React from 'react';
import reactDOM from "react-dom/client";
import App from "./App";
import UserProvider from '../src/components/Contexts/UserContext';

const root = reactDOM.createRoot(document.getElementById("root"))

root.render(
    
   
<UserProvider>
 <App />
</UserProvider>

    
)