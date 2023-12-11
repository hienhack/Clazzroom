import "./Style.css";
import { NavLink } from "react-router-dom";

// const tab = {
//   to: "/link",
//   title: "Memebers"
// }

function TabBar({ tabs, activeTab, children }) {
  return (
    <div className="w-full px-6 h-[50px] min-h-[50px] flex justify-between items-center bg-white border-b border-gray-300">
      <div className="h-full flex">
        {tabs.map((tab, index) => (
          <NavLink
            key={index}
            className="tab hover:bg-gray-200"
            to={tab.to}
            end
          >
            <div className="h-full px-6 flex items-center justify-center">
              <span className="text-sm">{tab.title}</span>
            </div>
          </NavLink>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default TabBar;
