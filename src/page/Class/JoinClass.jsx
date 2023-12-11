import { Spinner } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClassContext } from "../../context/ClassContext";

function JoinClass() {
  const navigate = useNavigate();
  const { search: query } = useLocation();
  const { classId } = useParams();
  const { classList, setClassList } = useContext(ClassContext);

  useEffect(() => {
    const classCode = new URLSearchParams(query).get("join_code");
    if (classCode == null) {
      navigate(`/errors/not-found`, { replace: true });
    }

    axios
      .post("/classes/join", { class_code: classCode })
      .then((res) => {
        axios
          .get(`/classes/${classId}`, {})
          .then(() => {
            setClassList([...classList, res.data.data]);
            navigate(`/classes/${classId}`);
          })
          .catch((error) => {});
      })
      .catch((error) => {
        navigate("/errors/not-found");
      });
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
