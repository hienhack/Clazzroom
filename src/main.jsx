import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ClassProvider } from "./context/ClassContext.jsx";

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
