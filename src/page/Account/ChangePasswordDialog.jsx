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

function ChangePasswordDialog({ open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  function onSubmit(data) {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success("Saved student ID");
    }, 2000);
  }

  function handleCancel() {
    reset();
    handleOpen();
  }

  const {
    register,
    handleSubmit,
    reset,
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
      size="xs"
      open={open}
      handler={handleOpen}
      dismiss={{ enabled: !processing }}
      className="bg-transparent shadow-none"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto p-2 w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography className="mb-3" variant="h4" color="blue-gray">
              Change password
            </Typography>
            <div className="flex flex-col gap-6">
              <div>
                <Input
                  {...register("current_password", {
                    required: {
                      value: true,
                      message: "Current password is required ",
                    },
                    minLength: {
                      value: 8,
                      message: "Password must have at last 8 characters",
                    },
                  })}
                  className="mb-4"
                  variant="standard"
                  label="Current password"
                ></Input>
                <ErrorMessage
                  errors={errors}
                  name="current_password"
                  render={({ message }) => (
                    <small className="text-red-600 italic mb-5">
                      {message}
                    </small>
                  )}
                />
              </div>
              <div>
                <Input
                  {...register("new_password", {
                    required: {
                      value: true,
                      message: "New password is required ",
                    },
                    minLength: {
                      value: 8,
                      message: "Password must have at last 8 characters",
                    },
                  })}
                  className="mb-4"
                  variant="standard"
                  label="New password"
                ></Input>
                <ErrorMessage
                  errors={errors}
                  name="new_password"
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
                <span>{processing ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default ChangePasswordDialog;
