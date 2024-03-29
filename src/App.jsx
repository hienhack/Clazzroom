import "./App.css";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import LoginPage from "./page/Login/LoginPage";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect, useLayoutEffect } from "react";
import VerificationPage from "./page/Verification/VerificationPage";
import RegisterPage from "./page/Register/RegisterPage";
import AccountPage from "./page/Account/AccountPage";
import ResetPasswordPage from "./page/ResetPassword/ResetPasswordPage";
import ClassesListPage from "./page/Class/ClassesListPage";
import ClassPage from "./page/Class/ClassPage";
import ClassMember from "./page/Class/ClassMember";
import ClassDetail from "./page/Class/ClassDetail";
import WelcomePage from "./page/Login/WelcomePage";
import ErrorPage from "./page/Error/ErrorPage";
import NotFoundPage from "./page/Error/NotFoundPage";
import ForbiddenPage from "./page/Error/ForbiddenPage";
import JoinClass from "./page/Class/JoinClass";
import useCustomLocation from "./hook/useCustomLocation";
import ClassGradeStructure from "./page/Class/ClassGradeStructure";
import ClassGradeManagement from "./page/Class/ClassGradeManagement";
import ReviewPage from "./page/Review/ReviewPage";
import ReviewDetail from "./page/Review/ReviewDetail";
import ReviewList from "./page/Review/ReviewList";
import Layout from "./layout/Layout";
import axiosConfig from "./config/axios.config";
import ClassGrade from "./page/Class/ClassGrade";
import LoginSuccess from "./page/Login/LoginSuccess";
import MoreInfoPage from "./page/Register/MoreInfoPage";
import LoginFailed from "./page/Login/LoginFailed";
import AccountBanned from "./page/Error/AccountBanned";

function PrivatePage({ element }) {
  const { token, user, setRedirect } = useContext(AuthContext);
  const { relativeHref } = useCustomLocation();

  if (token == null) {
    setRedirect(relativeHref);
    return <Navigate to="/sign-in" />;
  }

  return element;
}

function PublicPage({ element, restricted }) {
  restricted = restricted | false;
  const { user } = useContext(AuthContext);

  return restricted && user != null ? <Navigate to="/" /> : element;
}

function App() {
  const { token } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  axiosConfig(token);

  // useEffect(() => , [token]);

  useLayoutEffect(() => {
    if (user == null) {
      return;
    }
    // if (!user.status) {
    //   navigate("/errors/account-banned");
    //   return;
    // }
    if (user.role == "not_set") {
      if (pathname != "/sign-up/more-info") {
        navigate("/sign-up/more-info");
      } else {
        return;
      }
    } else if (!user.is_verified) {
      if (pathname != "/verification") {
        navigate("/verification");
      } else {
        return;
      }
    }
  }, [user]);

  return (
    <>
      <Routes>
        <Route
          path="/sign-in"
          element={<PublicPage element={<LoginPage />} />}
        />
        <Route
          path="/login/success"
          element={<PublicPage element={<LoginSuccess />} />}
        />
        <Route
          path="/login/failed"
          element={<PublicPage element={<LoginFailed />} />}
        />
        <Route
          path="/sign-up"
          element={<PublicPage element={<RegisterPage />} />}
        />
        <Route
          path="/sign-up/more-info"
          element={<PrivatePage element={<MoreInfoPage />} />}
        />
        <Route
          path="/reset-password"
          element={<PublicPage element={<ResetPasswordPage />} />}
        />
        <Route
          path="/verification"
          element={<PublicPage element={<VerificationPage />} />}
        />
        <Route path="/welcome" element={<WelcomePage />}></Route>
        <Route path="/errors" element={<ErrorPage />}>
          <Route path="not-found" element={<NotFoundPage />}></Route>
          <Route path="forbidden" element={<ForbiddenPage />}></Route>
          <Route path="account-banned" element={<AccountBanned />} />
        </Route>
        <Route
          path="/join/:classId"
          element={<PrivatePage element={<JoinClass />} />}
        />
        <Route path="/test" element={<Layout></Layout>} />
        <Route element={<Layout></Layout>}>
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
            <Route path="grade-structure" element={<ClassGradeStructure />} />
            <Route path="grade-management" element={<ClassGradeManagement />} />
            <Route path="grade" element={<ClassGrade />} />
          </Route>
          <Route path="/review" element={<ReviewPage />}>
            <Route path="" element={<ReviewList />} />
            <Route path=":reviewId" element={<ReviewDetail />} />
          </Route>

          <Route
            path="/account"
            element={<PrivatePage element={<AccountPage />} />}
          />
        </Route>
      </Routes>
      <ToastContainer
        autoClose={3500}
        hideProgressBar
        theme="colored"
        position="bottom-left"
        style={{ zIndex: 999999999 }}
      />
    </>
  );
}

export default App;
