import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axiosConfig from "./config/axios.config.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import Auth0ProviderWithHistory from "./auth0-provider-with-history";

axiosConfig();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Auth0ProviderWithHistory>
          <App />
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
