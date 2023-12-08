import React from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { MdOutlineRateReview } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";

function MenuItem({ open, isChosen, link, content, children: icon }) {
  isChosen = isChosen || false;
  if (open == undefined) {
    open = true;
  }

  return (
    <Link to={link}>
      <div className="pr-4">
        <div
          className={`pl-6 pr-4 -mr-1 rounded-r-full py-3 flex gap-6 items-center ${
            isChosen ? "bg-light-blue-50" : "hover:bg-gray-100"
          }`}
        >
          <div
            className={`w-6 h-6 flex justify-center ${
              isChosen ? "fill-blue-gray-900" : "fill-blue-gray-700"
            }`}
          >
            {icon}
          </div>
          <span
            className={`truncate pe-5 ${
              isChosen ? "text-blue-gray-900 font-medium" : "text-blue-gray-700"
            } ${!open && "hidden"}`}
          >
            {content}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Sidebar({ open }) {
  return (
    <div
      className={`h-[calc(100vh-66px)] transition-[width] ease-linear duration-100 border-r border-gray-300 ${
        open && "w-[300px]"
      }`}
    >
      <div className="pt-2 h-full flex flex-col">
        <MenuItem isChosen={true} content="Classes" link="/" open={open}>
          <SiGoogleclassroom size="1.3rem" className="fill-inherit" />
        </MenuItem>
        <MenuItem isChosen={false} content="Grade review" link="/" open={open}>
          <MdOutlineRateReview size="1.5rem" className="fill-inherit" />
        </MenuItem>
        <hr className="my-2"></hr>
        <div className={`grow overflow-y-auto ${!open && "hidden"}`}>
          <MenuItem
            isChosen={false}
            content="das fasd fasd fasd fsad fsad fsad f sdafsda f sdf "
            link="/"
          >
            <FaGraduationCap size="1.2rem" className="fill-inherit" />
          </MenuItem>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
