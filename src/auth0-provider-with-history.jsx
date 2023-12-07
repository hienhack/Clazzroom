import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = "dev-3cbpv7st47pr6uhr.us.auth0.com";
  const clientId = "1Ozu9uQIsahvKt7ioJHf8k2CRfQ7iGfC";




  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  )
};
export default Auth0ProviderWithHistory;
