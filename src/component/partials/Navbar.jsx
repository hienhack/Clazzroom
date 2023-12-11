import { FiMenu } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import AccountMenu from "./AccountMenu";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { ClassContext } from "../../context/ClassContext";

function Navbar({ handleSidebar }) {
  const { currentClass } = useContext(ClassContext);

  return (
    <header className="w-full px-6 border-b-gray-300 border-b-[1px]">
      <div className="w-full h-[65px] flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <button
            className="p-3 -m-3 hover:bg-blue-gray-50 rounded-full h-fit"
            onClick={() => {
              handleSidebar();
            }}
          >
            <FiMenu size="1.3rem" className="fill-blue-gray-800 w-6 h-6" />
          </button>
          <Link to="/">
            <div className="flex gap-2 items-center">
              <img className="h-[30px] m-1" src="/logo.png"></img>
              <h1 className="text-xl font-semibold text-gray-500">Clazzroom</h1>
            </div>
          </Link>
          {currentClass && (
            <>
              <MdKeyboardArrowRight
                size="1.2rem"
                className="fill-blue-gray-900"
              />
              <Link to={`/class/${currentClass._id}`}>
                <div className="hover:underline">
                  {currentClass?.topic != "" ? (
                    <div>
                      <h1 className="text-blue-gray-900">
                        {currentClass?.class_name}
                      </h1>
                      <small className="text-blue-gray-600">
                        {currentClass?.topic}
                      </small>
                    </div>
                  ) : (
                    <h1 className="text-blue-gray-900 text-lg">
                      {currentClass?.class_name}
                    </h1>
                  )}
                </div>
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button className="p-2 -m-2 rounded-full hover:bg-blue-gray-50 fill-blue-gray-300 hover:fill-blue-gray-600">
            <FaBell size="1.3rem" className="fill-inherit" />
          </button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
