import { Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
function JoinClass() {
  const navigate = useNavigate();
  const { search: query } = useLocation();
  const { classId } = useParams();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const classCode = new URLSearchParams(query).get("join_code");
    console.log(classId + "   " + classCode);
    if (classCode == null) {
      navigate(`/class/${classId}`, { replace: true });
    }

    if (processing) return;

    setProcessing(true);
    axios
      .post("/classes/join", { class_code: classCode })
      .then((res) => {
        navigate(`/class/${classId}`, { replace: true });
        setProcessing(!processing);
      })
      .catch((error) => {
        navigate("/errors/not-found");
      });

    // call api here
    // sucess => navigate(`/class/${classId}`, {replace: true});
    // failed => navigate("/errors/not-found")
  }, []);

  return (
    <div className="h-screen w-full bg-blue-100 pt-20">
      <div className="flex justify-center items-center gap-3 opacity-80">
        <Spinner className="h-6 text-blue-gray-700" />
        <h1 className="text-blue-gray-700 text-xl">Processing...</h1>
      </div>
    </div>
  );
}

export default JoinClass;
