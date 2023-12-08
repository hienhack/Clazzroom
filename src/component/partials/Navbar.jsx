import { FiMenu } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import AccountMenu from "./AccountMenu";
import { Link } from "react-router-dom";

function Navbar({ handleSidebar }) {
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
