import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axiosConfig from "./config/axios.config.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ClassProvider } from "./context/ClassContext.jsx";

axiosConfig();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ClassProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClassProvider>
    </AuthProvider>
  </React.StrictMode>
);
