import "./App.css";
import Navbar from "./component/common/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./page/Home/HomePage";
import LoginPage from "./page/Login/LoginPage";
import VerificationPage from "./page/Verification/VerificationPage";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import RegisterPage from "./page/Register/RegisterPage";
import Sidebar from "./component/common/Sidebar";
import AccountPage from "./page/Account/AccountPage";

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
  const isNoNavbarPaths = ["/sign-in", "/sign-up", "/verification"];
  const isNoNavbar = isNoNavbarPaths.includes(useLocation().pathname);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div>
      {!isNoNavbar && (
        <Navbar handleSidebar={() => setShowSidebar(!showSidebar)} />
      )}
      <div className="flex w-full min-h-screen">
        {!isNoNavbar && (
          <div
            className={`transition-[width] ease-linear duration-100 ${
              showSidebar ? "w-[0] invisible" : "w-[300px]"
            }`}
          >
            <Sidebar />
          </div>
        )}
        <div className="grow bg-blue-gray-50">
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
              element={<PublicPage element={<VerificationPage />} />}
            />
            <Route path="/" element={<PrivatePage element={<HomePage />} />} />
            <Route
              path="/account"
              element={<PublicPage element={<AccountPage />} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
