import React, { useContext } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { MdOutlineRateReview } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { ClassContext } from "../../context/ClassContext";

function MenuItem({ open, link, content, children: icon }) {
  return (
    <NavLink to={link.path} end={link.isEnd}>
      {({ isActive }) => (
        <div className="pr-4">
          <div
            className={`pl-6 pr-4 -mr-1 rounded-r-full py-3 flex gap-6 items-center ${
              isActive ? "bg-light-blue-50" : "hover:bg-gray-100"
            }`}
          >
            <div
              className={`w-6 h-6 flex justify-center ${
                isActive ? "fill-blue-gray-900" : "fill-blue-gray-700"
              }`}
            >
              {icon}
            </div>
            <span
              className={`truncate pe-5 text-sm ${
                isActive
                  ? "text-blue-gray-900 font-medium"
                  : "text-blue-gray-700"
              } ${!open && "hidden"}`}
            >
              {content}
            </span>
          </div>
        </div>
      )}
    </NavLink>
  );
}

function Sidebar({ open }) {
  const { classList: classes } = useContext(ClassContext);

  return (
    <div
      className={`h-[calc(100vh-66px)] transition-[width] ease-linear duration-100 border-r border-gray-300 ${
        open && "w-[300px]"
      }`}
    >
      <div className="pt-2 h-full flex flex-col">
        <MenuItem
          isChosen={true}
          content="Classes"
          link={{ path: "/", isEnd: true }}
          open={open}
        >
          <SiGoogleclassroom size="1.3rem" className="fill-inherit" />
        </MenuItem>
        <MenuItem
          isChosen={false}
          content="Grade review"
          link={{ path: "/class/1/members", isEnd: true }}
          open={open}
        >
          <MdOutlineRateReview size="1.5rem" className="fill-inherit" />
        </MenuItem>
        <hr className="my-2"></hr>
        <div className={`grow overflow-y-auto ${!open && "hidden"}`}>
          {classes.map((clazz) => (
            <MenuItem
              key={clazz._id}
              isChosen={false}
              content={clazz.class_name}
              link={{ path: `/class/classId=${clazz._id}`, isEnd: false }}
              open={open}
            >
              <FaGraduationCap size="1.2rem" className="fill-inherit" />
            </MenuItem>
          ))}
          {/* <MenuItem
            isChosen={false}
            content="das fasd fasd fasd fsad fsad fsad f sdafsda f sdf "
            link="/"
          >
            <FaGraduationCap size="1.2rem" className="fill-inherit" />
          </MenuItem> */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
