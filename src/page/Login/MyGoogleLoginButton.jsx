import React from "react";
import { createButton } from "react-social-login-buttons";
import '@fortawesome/fontawesome-free/css/all.min.css';

const config = {
  text: "Google",
  icon: "google",
  iconFormat: name => `fab fa-${name}`,
  style: { background: '#dd4b39' },
  activeStyle: { background: '#c23321' }
};
/** My Facebook login button. */
const MyGoogleLoginButton = createButton(config);

export default MyGoogleLoginButton;
