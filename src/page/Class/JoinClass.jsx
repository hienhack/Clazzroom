import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

let count = 0;

function JoinClass() {
  const navigate = useNavigate();
  const [message, setMessage] = useState();
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
        setMessage(
          "You are a member of this class. Click OK to visit the class now!"
        );
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.statusCode == 400) {
          setMessage(
            "You have joined this class before. Click OK to visit the class now!"
          );
        } else {
          navigate("/errors/not-found");
        }
      });
  }, []);

  function handleOkClick() {
    window.location.href = window.location.origin + "/class/" + classId;
  }

  return (
    <>
      <div className="h-screen w-full bg-blue-100 pt-20">
        <div className="flex justify-center items-center gap-3 opacity-80">
          <Spinner className="h-6 text-blue-gray-700" />
          <h1 className="text-blue-gray-700 text-xl">Processing...</h1>
        </div>
      </div>
      {message && (
        <Dialog
          open={true}
          size="xs"
          handler={() => {}}
          dismiss={{ enabled: false }}
          className="p-3"
        >
          <DialogHeader>Join class</DialogHeader>
          <DialogBody>{message}</DialogBody>
          <DialogFooter>
            <Button
              className="normal-case"
              size="sm"
              variant="gradient"
              color="blue"
              onClick={handleOkClick}
            >
              <span>OK</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}

export default JoinClass;
