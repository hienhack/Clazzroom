import Navbar from "../component/partials/Navbar";
import { useState } from "react";
import Sidebar from "../component/partials/Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  const [openSidebar, setOpenSidebar] = useState(true);

  function handleOpen() {
    setOpenSidebar(!openSidebar);
  }

  return (
    <div>
      <Navbar handleSidebar={handleOpen}></Navbar>
      <div className="h-[calc(100vh-66px)]">
        <div className="float-left">
          <Sidebar open={openSidebar}></Sidebar>
        </div>
        <div className="h-full bg-gray-50 overflow-auto">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default Layout;
