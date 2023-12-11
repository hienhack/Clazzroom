import { Outlet, useNavigate, useParams } from "react-router-dom";
import TabBar from "../../component/common/TabBar";
import { useState, useContext, useEffect } from "react";
import { ClassContext } from "../../context/ClassContext";
import axios from "axios";

function ClassPage() {
  const [controller, setController] = useState();
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentClass != null) {
      return;
    }

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
  }, [currentClass]);

  const tabs = [
    {
      to: `/class/${currentClass?._id}`,
      title: "Detail",
    },
    {
      to: `/class/${currentClass?._id}/members`,
      title: "Members",
    },
    {
      to: `/class/${currentClass?._id}/grade`,
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
