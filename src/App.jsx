import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Navbar from "./component/partials/Navbar";
import LoginPage from "./page/Login/LoginPage";
import { AuthContext } from "./context/AuthContext";
import { useContext, useMemo, useState } from "react";
import VerificationPage from "./page/Verification/VerificationPage";
import RegisterPage from "./page/Register/RegisterPage";
import Sidebar from "./component/partials/Sidebar";
import AccountPage from "./page/Account/AccountPage";
import ResetPasswordPage from "./page/ResetPassword/ResetPasswordPage";
import ClassesListPage from "./page/Class/ClassesListPage";
import ClassPage from "./page/Class/ClassPage";
import ClassMember from "./page/Class/ClassMember";
import ClassDetail from "./page/Class/ClassDetail";
import ClassGrade from "./page/Class/ClassGrade";
import WelcomePage from "./page/Login/WelcomePage";
import ErrorPage from "./page/Error/ErrorPage";
import NotFoundPage from "./page/Error/NotFoundPage";
import ForbiddenPage from "./page/Error/ForbiddenPage";
import JoinClass from "./page/Class/JoinClass";

function PrivatePage({ element }) {
  const { token, user, setRedirect } = useContext(AuthContext);
  const { pathname: path } = useLocation();

  if (token == null) {
    setRedirect(window.location.href);
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

const isNoNavbarPaths = [
  "/sign-in",
  "/sign-up",
  "/verification",
  "/reset-password",
  "/welcome",
  "/errors/forbidden",
  "/errors/not-found",
  "/join/.*",
];

function App() {
  const { pathname: currentPath } = useLocation();
  const isNoNavbar = useMemo(() => {
    return (
      isNoNavbarPaths.findIndex((path) => currentPath.match(path) != null) != -1
    );
  }, [currentPath]);

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
            ></Route>
            <Route
              path="/class/:classId"
              element={<PrivatePage element={<ClassPage />} />}
            >
              <Route path="" element={<ClassDetail />}></Route>
              <Route path="members" element={<ClassMember />} />
              <Route path="grade" element={<ClassGrade />} />
            </Route>
            <Route
              path="/join/:classId"
              element={<PrivatePage element={<JoinClass />} />}
            />
            <Route
              path="/account"
              element={<PrivatePage element={<AccountPage />} />}
            />
            <Route path="/welcome" element={<WelcomePage />}></Route>
            <Route path="/errors" element={<ErrorPage />}>
              <Route path="not-found" element={<NotFoundPage />}></Route>
              <Route path="forbidden" element={<ForbiddenPage />}></Route>
            </Route>
          </Routes>
        </div>
      </div>
      <ToastContainer
        autoClose={3500}
        hideProgressBar
        theme="colored"
        position="bottom-left"
        style={{ zIndex: 999999999 }}
      />
    </div>
  );
}

export default App;
