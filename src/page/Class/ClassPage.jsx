import { Outlet, useNavigate, useParams } from "react-router-dom";
import TabBar from "../../component/common/TabBar";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ClassContext } from "../../context/ClassContext";

function ClassPage() {
  const [controller, setController] = useState();
  const [loading, setLoading] = useState(true);
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/classes/" + classId, {})
      .then((res) => {
        setCurrentClass(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        navigate("/errors/not-found", { replace: true });
      });
    return () => {
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
        <div className="grow overflow-y-auto">
          <Outlet context={{ setController, loading }} />
        </div>
      </div>
    </div>
  );
}

export default ClassPage;
