import { Outlet, useNavigate, useParams } from "react-router-dom";
import TabBar from "../../component/common/TabBar";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ClassContext } from "../../context/ClassContext";

function ClassPage() {
  const [controller, setController] = useState();
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/classes/" + classId, {})
      .then((res) => {
        setCurrentClass(res.data.data);
      })
      .catch((error) => {
        navigate("/errors/not-found", { replace: true });
      });
    return () => {
      if (currentClass == null) return;
      setCurrentClass(null);
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
      to: `/class/${classId}/grade`,
      title: "Grade",
    },
  ];

  return (
    <div className="h-[calc(100vh-66px)] w-full">
      <div className="flex flex-col h-full">
        <TabBar tabs={tabs}>{controller}</TabBar>
        <div className="h-full overflow-y-auto">
          <Outlet context={{ setController }} />
        </div>
      </div>
    </div>
  );
}

export default ClassPage;
