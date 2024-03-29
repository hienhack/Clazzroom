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
import { useForm } from "react-hook-form";
import { MdOutlineRotateRight } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { useContext, useEffect, useRef, useState } from "react";
import { ClassContext } from "../../context/ClassContext";
import axios from "axios";
import InputFormat from "../../component/common/InputFormat";
import { toast } from "react-toastify";

function EditClassDialog({ open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const [classCode, setClassCode] = useState(currentClass?.class_code || "");
  const desInputRef = useRef(null);

  function onSubmit(data) {
    setProcessing(true);
    data.class_code = classCode;

    let description = desInputRef.current.innerHTML;
    description = description.replaceAll("<div><br></div>", "<br>");
    description = description.replaceAll("</div><div>", "<br>");
    const end = description.lastIndexOf("</div>");
    description = description.substring(0, end + 6);
    data.description = description;

    axios
      .patch("/classes/" + currentClass._id, data)
      .then((res) => {
        setCurrentClass(res.data.data);
        handleOpen();
        toast.success("Successfully updated class information");
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again!");
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function generateClassCode() {
    axios
      .get("/classes/generate-class_code", {})
      .then((res) => {
        setClassCode(res.data.data.class_code);
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again!");
      });
  }

  function removeClassCode() {
    setClassCode("");
  }

  function handleCancel() {
    setClassCode(currentClass.class_code);
    reset(currentClass);
    handleOpen();
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...currentClass,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    reset(currentClass);
    setClassCode(currentClass?.class_code || "");
    if (desInputRef.current == null) return;
    desInputRef.current.innerHTML = currentClass?.description || "";
  }, [currentClass]);

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      dismiss={{ enabled: false }}
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
                {classCode != "" ? (
                  <h1 className="text-blue-800 text-2xl font-semibold">
                    {classCode}
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
                  {classCode != "" && (
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
                ></Input>
              </div>
              <div>
                <Input
                  {...register("room")}
                  className="mb-4"
                  variant="standard"
                  label="Room"
                ></Input>
              </div>
              <div>
                <InputFormat
                  inputRef={desInputRef}
                  defaultValue={currentClass?.description || ""}
                  height="h-40"
                  label="Class description"
                ></InputFormat>
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
