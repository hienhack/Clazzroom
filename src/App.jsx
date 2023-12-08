import "./App.css";
import Navbar from "./component/partials/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./page/Login/LoginPage";
import VerificationPage from "./page/Verification/VerificationPage";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import RegisterPage from "./page/Register/RegisterPage";
import Sidebar from "./component/partials/Sidebar";
import AccountPage from "./page/Account/AccountPage";
import ResetPasswordPage from "./page/ResetPassword/ResetPasswordPage";
import ClassesListPage from "./page/Class/ClassesListPage";

function PrivatePage({ element }) {
  const { token, user } = useContext(AuthContext);
  const path = useLocation().pathname;

  if (token == null) {
    return <Navigate to="/sign-in" />;
  } else if (user && !user.is_verified) {
    return path == "/verification" ? (
      <VerificationPage />
    ) : (
      <Navigate to="/verification" />
    );
  }

  return element;
}

function PublicPage({ element, restricted }) {
  restricted = restricted | false;
  const { user } = useContext(AuthContext);

  return restricted && user != null ? <Navigate to="/" /> : element;
}

function App() {
  const isNoNavbarPaths = [
    "/sign-in",
    "/sign-up",
    "/verification",
    "/reset-password",
  ];
  const isNoNavbar = isNoNavbarPaths.includes(useLocation().pathname);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div>
      {!isNoNavbar && (
        <Navbar handleSidebar={() => setShowSidebar(!showSidebar)} />
      )}
      <div className="flex w-full">
        {!isNoNavbar && (
          <div>
            <Sidebar open={showSidebar} />
          </div>
        )}
        <div className="grow bg-gray-50">
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
              path="/reset-password"
              element={<PublicPage element={<ResetPasswordPage />} />}
            />
            <Route
              path="/verification"
              element={<PublicPage element={<VerificationPage />} />}
            />
            <Route
              path="/"
              element={<PrivatePage element={<ClassesListPage />} />}
            />
            <Route
              path="/account"
              element={<PrivatePage element={<AccountPage />} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
