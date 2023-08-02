import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import UserAuthProvider from "./contexts/UserAuthProvider.tsx";
import UserDataProvider from "./contexts/UserDataProvider.tsx";
import ThemeProvider from "./contexts/ThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <UserAuthProvider>
          <UserDataProvider>
            <App />
          </UserDataProvider>
        </UserAuthProvider>
      </Router>
    </ThemeProvider>
          <ToastContainer />
  </React.StrictMode>
);
