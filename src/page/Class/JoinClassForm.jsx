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

function JoinClassForm({ open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const { reloadClassList } = useContext(ClassContext);

  function onSubmit(data) {
    setProcessing(true);
    axios
      .post("/classes/join", { class_code: data.class_code })
      .then((res) => {
        setProcessing(false);
        reloadClassList();
        reset();
        handleOpen();
        toast.success("Successfully joined the class");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
        setFocus("class_code");
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleCancel() {
    reset();
    handleOpen();
  }

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      class_code: "",
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
              Join a class
            </Typography>
            <div className="flex flex-col gap-6">
              <h1 className="text-sm">
                Enter your class code below to join your class
              </h1>
              <div>
                <Input
                  {...register("class_code", {
                    required: {
                      value: true,
                      message: "Class code can not be empty!",
                    },
                  })}
                  className="mb-4"
                  variant="standard"
                  label="Class code"
                ></Input>
                <ErrorMessage
                  errors={errors}
                  name="class_code"
                  render={({ message }) => (
                    <small className="text-red-600 italic mb-5">
                      {message}
                    </small>
                  )}
                />
              </div>
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
                <span>{processing ? "Processing..." : "Join"}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default JoinClassForm;
