import { FiMenu } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import AccountMenu from "./AccountMenu";

function Navbar() {
  return (
    <header class="w-full px-6 border-b-gray-300 border-b-[1px]">
      <div className="w-full h-[65px] flex justify-between items-center">
        <div className="flex gap-6">
          <button className="p-[12px] -m-[12px] hover:bg-blue-gray-50 rounded-full">
            <FiMenu size="1.3rem" className="fill-blue-gray-800" />
          </button>
          <div className="flex gap-2 items-center">
            <img className="h-[20px]" src="/vite.svg"></img>
            <h1 className="text-xl font-semibold text-blue-gray-800">
              Clazzroom
            </h1>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <FaBell size="1.3rem" className="fill-blue-gray-300" />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
