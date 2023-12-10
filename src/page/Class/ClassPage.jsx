import { Outlet } from "react-router-dom";
import TabBar from "../../component/common/TabBar";
import { Tooltip } from "@material-tailwind/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useState, useContext } from "react";
import { ClassContext } from "../../context/ClassContext";

const clazz = {
  _id: "1",
  name: "Advanced web development",
  topic: "Using ReactJS to develop web application",
  grade_status: "Open",
  owner: {
    _id: "abcd",
    full_name: "Thai Hien",
    image: "",
    email: "hienthai@gmail.com",
  },
  teachers: [
    {
      _id: "1233",
      full_name: "Toi Ten La",
      email: "toitenla@gmail.com",
      image: "",
    },
    {
      _id: "1234",
      full_name: "No Name Man",
      email: "noname@gmail.com",
      image: "",
    },
  ],
  students: [
    {
      _id: "1233",
      full_name: "Toi Ten La",
      email: "toitenla@gmail.com",
      image: "",
    },
    {
      _id: "1234",
      full_name: "No Name Man",
      email: "noname@gmail.com",
      image: "",
    },
  ],
};

function ClassPage() {
  const [controller, setController] = useState();
  const { currentClass } = useContext(ClassContext);

  const tabs = [
    {
      to: `/class/classId=${currentClass._id}`,
      title: "Detail",
    },
    {
      to: `/class/classId=${currentClass._id}/members`,
      title: "Members",
    },
    {
      to: `/class/classId=${currentClass._id}/grade`,
      title: "Grade",
    },
  ];

  return (
    <div className="h-[calc(100vh-66px)] w-full">
      <div className="flex flex-col h-full">
        <TabBar tabs={tabs}>{controller}</TabBar>
        <div className="h-full overflow-y-auto">
          <Outlet context={setController} />
        </div>
      </div>
    </div>
  );
}

export default ClassPage;
