import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../component/common/Loading";

let count = 0;

function JoinClass() {
  const navigate = useNavigate();
  const { search: query } = useLocation();
  const { classId } = useParams();

  useEffect(() => {
    if (count > 0) {
      return;
    }

    count = 1;

    const classCode = new URLSearchParams(query).get("join_code");
    if (classCode == null) {
      navigate(`/errors/not-found`, { replace: true });
    }

    axios
      .post("/classes/join", { class_code: classCode })
      .then((res) => {
        toast.success("Successfully join the class");
        navigate("/class/" + classId);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.statusCode == 400) {
          toast.info("You have joined this class before");
          navigate("/class/" + classId);
        } else {
          navigate("/errors/not-found");
        }
      });
  }, []);

  return (
    <div className="h-screen w-full pt-16 bg-gray-50">
      <div className="mx-auto w-fit h-fit mb-20">
        <div className="flex justify-center gap-2">
          <img className="w-[30px]" src="/logo.png" />
          <h1 className="text-xl font-semibold text-gray-500">Clazzroom</h1>
        </div>
      </div>
      <div className="pt-28">
        <Loading
          text="Processing"
          fontSize="text-lg"
          size="w-7 h-7"
          width="4px"
          bg="bg-transparent"
        ></Loading>
      </div>
    </div>
  );
}

export default JoinClass;
