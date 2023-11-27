import "./App.css";
import Navbar from "./component/common/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./component/page/Home";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;
