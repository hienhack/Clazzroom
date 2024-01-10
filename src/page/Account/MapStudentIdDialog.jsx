import { ErrorMessage } from "@hookform/error-message";
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Dialog,
  Button,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ClassContext } from "../../context/ClassContext";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function MapStudentIdDialog({ open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  function onSubmit(data) {
    setProcessing(true);
    axios
      .patch("/users/profile", { ...user, student_id: data.student_id })
      .then((res) => {
        setUser(res.data.data);
        toast.success("Saved student ID");
        handleOpen();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.statusCode == 400) {
          setError("Student ID existed");
        } else {
          toast.error("Something went wrong, please try again!");
        }
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleCancel() {
    reset();
    handleOpen();
    setError(null);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student_id: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleOpen}
      dismiss={{ enabled: !processing }}
      className="bg-transparent shadow-none"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto p-2 w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography className="mb-3" variant="h4" color="blue-gray">
              Map student ID
            </Typography>
            <div className="flex flex-col gap-6">
              {error && (
                <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>
              )}
              <div>
                <Input
                  {...register("student_id", {
                    required: {
                      value: true,
                      message: "ID cannot be empty",
                    },
                  })}
                  className="mb-4"
                  variant="standard"
                  label="Student ID"
                ></Input>
                <ErrorMessage
                  errors={errors}
                  name="student_id"
                  render={({ message }) => (
                    <small className="text-red-600 italic mb-5">
                      {message}
                    </small>
                  )}
                />
              </div>
              <p className="text-xs font-light mt-2 text-justify">
                <b className="font-medium">Notice:</b> You will not be able to
                change your student ID after it is mapped, make sure you have
                entered the right value!
              </p>
            </div>
          </CardBody>
          <CardFooter className="pt-0 mt-2">
            <div className="flex justify-end items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="text"
                color="red"
                onClick={handleCancel}
                disabled={processing}
                className="normal-case rounded-md"
              >
                <span>Cancel</span>
              </Button>
              <Button
                type="submit"
                className="normal-case rounded-md"
                size="sm"
                variant="gradient"
                color="blue"
                disabled={processing}
              >
                <span>{processing ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default MapStudentIdDialog;
