import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Dialog,
  Button,
} from "@material-tailwind/react";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ClassContext } from "../../context/ClassContext";
import { toast } from "react-toastify";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import InputFormat from "../../component/common/InputFormat";

function CreateClassForm({ open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const { classList, setClassList } = useContext(ClassContext);
  const desInputRef = useRef(null);

  function onSubmit(data) {
    setProcessing(true);
    let description = desInputRef.current.innerHTML;
    description = description.replaceAll("<div><br></div>", "<br>");
    description = description.replaceAll("</div><div>", "<br>");
    const end = description.lastIndexOf("</div>");
    description = description.substring(0, end + 6);

    axios
      .post("/classes", {
        ...data,
        description: description,
      })
      .then((res) => {
        setClassList([...classList, res.data.data]);
        reset();
        handleOpen();
        toast.success("Successfully created class");
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again!");
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
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
      dismiss={{ enabled: !processing }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto p-2 w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography className="mb-3" variant="h4" color="blue-gray">
              Create a new class
            </Typography>
            <div className="flex flex-col gap-6">
              <div>
                <Input
                  {...register("class_name", {
                    required: {
                      value: true,
                      message: "Class name is required!",
                    },
                  })}
                  className="mb-4"
                  variant="standard"
                  label="Class name"
                ></Input>
                <ErrorMessage
                  errors={errors}
                  name="class_name"
                  render={({ message }) => (
                    <small className="text-red-600 italic mb-5">
                      {message}
                    </small>
                  )}
                />
              </div>
              <Input
                {...register("topic")}
                className="mb-4"
                variant="standard"
                label="Topic"
              ></Input>
              <Input
                {...register("room")}
                className="mb-4"
                variant="standard"
                label="Room"
              ></Input>
              <InputFormat
                inputRef={desInputRef}
                height="h-52"
                label="Class description"
              ></InputFormat>
            </div>
          </CardBody>
          <CardFooter className="pt-0 mt-2 h-">
            <div className="flex justify-end items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="text"
                color="red"
                onClick={handleCancel}
                className="normal-case rounded-md"
                disabled={processing}
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
                <span>{processing ? "Processing..." : "Create"}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default CreateClassForm;
