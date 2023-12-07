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
    <Auth0ProviderWithHistory>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Auth0ProviderWithHistory>

  </React.StrictMode>
);
