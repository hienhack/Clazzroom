import { Outlet, useNavigate, useParams } from "react-router-dom";
import TabBar from "../../component/common/TabBar";
import { useState, useEffect, useContext, useMemo } from "react";
import { ClassContext } from "../../context/ClassContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function ClassPage() {
  const [controller, setController] = useState();
  const [loading, setLoading] = useState(true);
  const { setCurrentClass } = useContext(ClassContext);
  const { user } = useContext(AuthContext);
  const [gradeCompositions, setGradeCompositions] = useState(null);
  const [studentList, setStudentList] = useState(null);
  const [mappedAccount, setMappedAccount] = useState(null);
  const { classId } = useParams();
  const navigate = useNavigate();

  const teacherTabs = useMemo(
    () => [
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
    ],
    [classId]
  );

  const studentTabs = useMemo(
    () => [
      {
        to: `/class/${classId}`,
        title: "Detail",
      },
      {
        to: `/class/${classId}/members`,
        title: "Members",
      },
      {
        to: `/class/${classId}/grade`,
        title: "Grade",
      },
    ],
    [classId]
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get("/classes/" + classId, {})
      .then((res) => {
        setCurrentClass(res.data.data);
      })
      .catch((error) => {
        navigate("/errors/not-found", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });

    axios
      .get(`classes/${classId}/grades`)
      .then((res) => {
        setGradeCompositions(res.data.data);
      })
      .catch((error) => {
        setGradeCompositions([]);
        toast.error("Something went wrong, please try again later!");
      });

    return () => {
      setCurrentClass(null);
      setStudentList(null);
      setGradeCompositions(null);
      setMappedAccount(null);
    };
  }, [classId]);

  return (
    <div className="h-[calc(100vh-66px)] w-full">
      <div className="flex flex-col h-full w-full">
        <TabBar tabs={user?.role === "teacher" ? teacherTabs : studentTabs}>
          {controller}
        </TabBar>
        <div className="grow overflow-y-auto">
          <Outlet
            context={{
              setController,
              loading,
              studentList,
              setStudentList,
              mappedAccount,
              setMappedAccount,
              gradeCompositions,
              setGradeCompositions,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ClassPage;
