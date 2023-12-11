import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ClassContext } from "../../context/ClassContext";

function InvitationDialog({ open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const { currentClass } = useContext(ClassContext);

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const response = await axios.post(`/classes/${currentClass._id}/request-send-invitation`, [data]);
      console.log(response.data); // Xử lý dữ liệu phản hồi nếu cần thiết
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing(false);
      handleOpen();
    }
  };


  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
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
              Invite new member
            </Typography>
            <h6 className="text-sm text-blue-gray-700">
              Please enter the user's email, we will send a mail including the
              invitation link used to join this class
            </h6>
            <div>
              <Input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required!",
                  },
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email",
                  },
                })}
                className="mb-4"
                variant="standard"
                label="Email"
              ></Input>
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <small className="text-red-600 italic mb-5">{message}</small>
                )}
              />
            </div>
          </CardBody>
          <CardFooter className="pt-0 mt-2">
            <div className="flex justify-end items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="text"
                color="red"
                onClick={handleOpen}
                className="normal-case rounded-md"
                disabled={processing}
              >
                <span>Close</span>
              </Button>
              <Button
                type="submit"
                className="normal-case rounded-md"
                size="sm"
                variant="gradient"
                color="blue"
                disabled={processing}
              >
                <span>Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default InvitationDialog;
