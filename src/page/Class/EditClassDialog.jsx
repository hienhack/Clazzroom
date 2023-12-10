import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Typography,
  Input,
  Tooltip,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineRotateRight } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import axios from "axios";
import { ClassContext } from "../../context/ClassContext";

const testClass = {
  class_name: "ba c av",
  // class_code: "12n8asdf",
  class_code: "",
  topic: "adsfd",
  room: "E403",
  description: "asdf asdf sdaf sdaf sadf asd f",
};

function EditClassDialog({ open, handleOpen, clazz }) {
  const [processing, setProcessing] = useState(false);
  // For testing only. You must load the current class from context
  const [classCode, setClassCode] = useState(clazz.class_code);

  function onSubmit(data) {
    setProcessing(true);
    console.log(data);
    axios
      .patch("/classes/" + clazz._id, data)
      .then((res) => {
        // Nếu yêu cầu thành công, làm mới trang
        window.location.reload();
      })
      .catch((error) => {
        // Xử lý lỗi trong trường hợp yêu cầu thất bại
        console.log(error);
      })
      .finally(() => {
        // Kết thúc xử lý sau một khoảng thời gian nhất định (trong trường hợp này là 3000ms)
        setTimeout(() => {
          setProcessing(false);
        }, 3000);
      });
  }

  function generateClassCode() {
    let newCode = (Math.random() + 1).toString(36).substring(2);
    setClassCode(newCode);
  }

  function removeClassCode() {
    setClassCode("");
  }

  const {
    register,
    handleSubmit,
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
      dismiss={{ enabled: !processing }}
      className="bg-transparent shadow-none z-0"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto p-2 w-full">
          <CardBody className="flex flex-col gap-6">
            <Typography className="mb-3" variant="h4" color="blue-gray">
              Edit class information
            </Typography>
            <div>
              <h6 className="text-sm text-blue-gray-400">Class code</h6>
              <div className="flex justify-between items-center mt-3">
                {clazz?.class_code != "" ? (
                  <h1 className="text-blue-800 text-2xl font-semibold">
                    {clazz?.class_code}
                  </h1>
                ) : (
                  <h1 className="text-blue-gray-400 col-span-4 text-lg font-semibold align-top">
                    Removed
                  </h1>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="fill-blue-gray-300 hover:fill-blue-gray-600"
                    title="Generate new class code"
                    onClick={generateClassCode}
                  >
                    <MdOutlineRotateRight
                      size="1.4rem"
                      className="fill-inherit"
                    />
                  </button>
                  {clazz?.class_code != "" && (
                    <button
                      type="button"
                      className="fill-blue-gray-300 hover:fill-blue-gray-600"
                      title="Remove class code"
                      onClick={removeClassCode}
                    >
                      <FaRegTrashCan size="1.2rem" className="fill-inherit" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <Input
                  {...register("class_name", {
                    required: {
                      value: true,
                      message: "Class name is required!",
                    },
                  })}
                  className="mb-4"
                  defaultValue={clazz.class_name}
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

              <div>
                <Input
                  {...register("topic")}
                  className="mb-4"
                  variant="standard"
                  label="Topic"
                  defaultValue={clazz.topic}
                ></Input>
              </div>
              <div>
                <Input
                  {...register("room")}
                  className="mb-4"
                  variant="standard"
                  label="Room"
                  defaultValue={clazz.room}

                ></Input>
              </div>
              <div>
                <Textarea
                  rows={8}
                  {...register("description")}
                  variant="standard"
                  label="Class description"
                  defaultValue={clazz.description}
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
                onClick={handleOpen}
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
                <span>{processing ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default EditClassDialog;
