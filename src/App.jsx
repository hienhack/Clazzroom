import "./App.css";
import Navbar from "./component/common/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./component/page/Home/HomePage";
import LoginPage from "./component/page/Login/LoginPage";

const isNoNavbarPaths = ["/sign-in", "/sign-up"];

function App() {
  const location = useLocation();
  const isNoNavbar = isNoNavbarPaths.includes(location.pathname);

  return (
    <>
      {!isNoNavbar && <Navbar />}
      <Routes>
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
