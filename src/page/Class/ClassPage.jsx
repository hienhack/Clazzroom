import { Outlet, useNavigate, useParams } from "react-router-dom";
import TabBar from "../../component/common/TabBar";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ClassContext } from "../../context/ClassContext";

const testComposition = [
  { _id: "1", state: "In-progress", name: "Addtition", scale: 10 },
  { _id: "3", state: "Finalized", name: "Assignment 2", scale: 10 },
  { _id: "5", state: "In-progress", name: "Midterm", scale: 30 },
  { _id: "6", state: "In-progress", name: "Final", scale: 50 },
];

function ClassPage() {
  const [controller, setController] = useState();
  const [loading, setLoading] = useState(true);
  const { setCurrentClass } = useContext(ClassContext);
  const [studentList, setStudentList] = useState(null);
  const [mappedAccount, setMappedAccount] = useState(null);
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/classes/" + classId, {})
      .then((res) => {
        const clazz = res.data.data;
        clazz.grade_compositions = testComposition;
        setCurrentClass(clazz);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/errors/not-found", { replace: true });
      });
    return () => {
      setCurrentClass(null);
      setStudentList(null);
      setMappedAccount(null);
    };
  }, [classId]);

  const tabs = [
    {
      to: `/class/${classId}`,
      title: "Detail",
    },
    {
      to: `/class/${classId}/members`,
      title: "Members",
    },
    {
      to: `/class/${classId}/grade-structure`,
      title: "Grade Structure",
    },
    {
      to: `/class/${classId}/grade-management`,
      title: "Grade Management",
    },
  ];

  return (
    <div className="h-[calc(100vh-66px)] w-full">
      <div className="flex flex-col h-full w-full">
        <TabBar tabs={tabs}>{controller}</TabBar>
        <div className="grow overflow-y-auto">
          <Outlet
            context={{
              setController,
              loading,
              studentList,
              setStudentList,
              mappedAccount,
              setMappedAccount,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ClassPage;
