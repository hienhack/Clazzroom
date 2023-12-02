import React from "react";
import { createButton } from "react-social-login-buttons";
import '@fortawesome/fontawesome-free/css/all.min.css';

const config = {
  text: "Facebook",
  icon: "facebook",
  iconFormat: name => `fab fa-${name}`,
  style: { background: "#3b5998" },
  activeStyle: { background: "#293e69" }
};
/** My Facebook login button. */
const MyFacebookLoginButton = createButton(config);

export default MyFacebookLoginButton;
