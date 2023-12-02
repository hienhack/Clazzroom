import "./App.css";
import Navbar from "./component/common/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./page/Home/HomePage";
import LoginPage from "./page/Login/LoginPage";
import VerificationPage from "./page/Verification/VerificationPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import RegisterPage from "./page/Register/RegisterPage";

function PrivatePage({ element }) {
  const { user } = useContext(AuthContext);
  const path = useLocation().pathname;

  if (user == null) {
    return <Navigate to="/sign-in" />;
  } else if (!user.is_verified) {
    return path == "/verification" ? (
      <VerificationPage />
    ) : (
      <Navigate to="/verification" />
    );
  }

  return element;
}

function PublicPage({ element, restricted }) {
  restricted = restricted || false;
  const { user } = useContext(AuthContext);

  return restricted && user != null ? <Navigate to="/" /> : element;
}

function App() {
  const isNoNavbarPaths = ["/sign-in", "/sign-up", "/verification"];
  const isNoNavbar = isNoNavbarPaths.includes(useLocation().pathname);

  return (
    <>
      {!isNoNavbar && <Navbar />}
      <Routes>
        <Route
          path="/sign-in"
          element={<PublicPage element={<LoginPage />} />}
        />
        <Route
          path="/sign-up"
          element={<PublicPage element={<RegisterPage />} />}
        />
        <Route
          path="/verification"
          element={<PrivatePage element={<VerificationPage />} />}
        />
        <Route path="/" element={<PrivatePage element={<HomePage />} />} />
      </Routes>
    </>
  );
}

export default App;
