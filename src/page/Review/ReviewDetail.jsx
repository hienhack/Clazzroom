import { Link, useParams } from "react-router-dom";
import InputFormat from "../../component/common/InputFormat";
import { TbSend } from "react-icons/tb";
import { BiSolidMessageCheck } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Radio,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function CloseReviewDialog({ review, open, handleOpen, handler }) {
  const [keep, setKeep] = useState(false);
  const [processing, setProcessing] = useState(false);
  const {
    register,
    reset,
    trigger,
    formState: { isValid, errors },
  } = useForm({ defaultValues: {}, mode: "onBlur", reValidateMode: "onBlur" });

  function handleSubmit() {
    if (keep) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        toast.success("Review closed!");
        handleOpen();
      }, 2000);
    } else {
      trigger();
      if (isValid) {
        console.log("Go here");
        setProcessing(true);
        setTimeout(() => {
          setProcessing(false);
          toast.success("Updated grade, review is now closed");
          handleOpen();
        }, 2000);
      }
    }
  }

  function handleCancel() {
    reset();
    handleOpen();
  }

  return (
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      dismiss={{ enabled: false }}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto p-2 w-full">
        <CardBody className="flex flex-col gap-4">
          <Typography className="mb-3" variant="h4" color="blue-gray">
            Mark reivew as finalized
          </Typography>
          <div className="flex flex-col gap-1">
            <h1 className="text-sm text-blue-gray-700 font-medium">
              Final decision
            </h1>
            <label
              className={`flex gap-3 p-3 hover:bg-gray-100 rounded-md has-[:checked]:bg-black  ${
                keep && "bg-gray-100"
              }`}
              onClick={() => setKeep(true)}
            >
              <input
                name="decision"
                type="radio"
                className="w-6 h-6 peer"
              ></input>
              <div className="peer-checked:text-black">
                <h6 className="text-sm font-semibold">Keep current grade</h6>
                <div>
                  <small className="mr-2 inline-block">Current grade:</small>
                  <small className="mr-2 inline-block font-medium">9</small>
                </div>
              </div>
            </label>
            <label
              className={`flex gap-3 p-3 hover:bg-gray-100 rounded-md has-[:checked]:bg-black  ${
                !keep && "bg-gray-100"
              }`}
              onClick={() => setKeep(false)}
            >
              <input
                name="decision"
                type="radio"
                className="w-6 h-6 peer"
                defaultChecked
              ></input>
              <div className="grow peer-checked:text-black">
                <h6 className="text-sm font-semibold mb-5">Update grade</h6>
                <div className={`${keep ? "hidden" : "block"}`}>
                  <form>
                    <Input
                      {...register("new_grade", {
                        valueAsNumber: true,
                        validate: (value) => {
                          if (isNaN(value)) {
                            return "Not a number";
                          } else if (value < 0) {
                            return "Grade must not be a negative number";
                          }
                        },
                      })}
                      type="number"
                      className="mb-4"
                      label="New grade"
                      disabled={processing}
                    ></Input>
                  </form>
                  <ErrorMessage
                    errors={errors}
                    name="new_grade"
                    render={({ message }) => (
                      <small className="text-red-600 italic mb-5">
                        {message}
                      </small>
                    )}
                  />
                </div>
              </div>
            </label>
            <p className="text-xs font-light mt-2 text-justify">
              <b className="font-medium">Notice:</b> The comment feature will be
              closed and your student can not create a new review for this
              composition after review is finalized!
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
              onClick={handleSubmit}
              disabled={processing}
            >
              <span>{processing ? "Processing..." : "Continue"}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

function ReviewDetail() {
  const [showDialog, setShowDialog] = useState(true);
  const { reviewId } = useParams();
  console.log("Id: ", reviewId);

  return (
    <>
      <div className="h-full p-6 overflow-y-auto">
        <div className="mx-auto w-[700px] rouned-md drop-shadow-md bg-white rounded-md">
          <div className="px-6 pb-3 pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-semibold text-blue-gray-900">
                  Phát triển ứng dụng web
                </h1>
                <h1 className="text-xs">Assignment 1</h1>
              </div>
              <div>
                {/* <h1 className="text-green-700 font-bold text-sm">Closed</h1> */}
                <Tooltip
                  content="Mark as finalized"
                  placement="bottom"
                  className="bg-gray-700 text-xs py-1"
                >
                  <button
                    onClick={() => setShowDialog(true)}
                    className="fill-green-400 hover:fill-green-700"
                  >
                    <BiSolidMessageCheck
                      size="1.4rem"
                      className="fill-inherit"
                    />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <hr className="border-gray-300"></hr>
          <div className="px-6 py-3">
            <div className="grid grid-cols-7 gap-3">
              <div className="col-span-3 flex gap-2 items-center">
                <img
                  src="/default-user-image.png"
                  className="w-7 h-7 rouned-full"
                ></img>
                <div className="flex flex-col">
                  <h6 className="text-xs truncate">Thai Ngoc Vinh Hien</h6>
                  <h6 className="text-[10px]">20120472</h6>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <small className="text-gray-800">Current grade:</small>
                <small className="font-medium">8</small>
              </div>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <small className="text-gray-800">Expected grade:</small>
                <small className="font-medium">10</small>
              </div>
            </div>
            <div>
              <h6 className="text-sm font-medium mt-3 mb-2">Explanation</h6>
              <p className="text-sm text-blue-gray-800 font-light">
                I think that I should get 10 for this assignment. I have
                completed all the tasks and made a huge enhancement on
                performance. Anyway, it's just a sample explanation =))
              </p>
            </div>
          </div>
          <hr className="border-gray-300"></hr>
          <div className="px-6 py-3">
            <div className="flex flex-col gap-3">
              <h6 className="text-sm font-medium my-2">Comments</h6>
              <div className="rounded-md bg-light-blue-50 p-3">
                <div className="flex gap-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/default-user-image.png"
                  ></img>
                  <div>
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs">Thai Ngoc Vinh Hien</h6>
                    </div>
                    <p className="text-xs font-light">
                      Khong co dau em Khong co dau em Khong co dau em Khong co
                      dau em Khong co dau em Khong co dau em Khong co dau em
                    </p>
                  </div>
                </div>
                <h6 className="text-xs float-right">9:30</h6>
              </div>
              <div className="rounded-md bg-light-blue-50 p-3">
                <div className="flex gap-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/default-user-image.png"
                  ></img>
                  <div>
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs">Thai Ngoc Vinh Hien</h6>
                    </div>
                    <p className="text-xs font-light">
                      Khong co dau em Khong co dau em Khong co dau em Khong co
                      dau em Khong co dau em Khong co dau em Khong co dau em
                    </p>
                  </div>
                </div>
                <h6 className="text-xs float-right">9:30</h6>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <div>
                  <p className="text-green-900 font-medium text-sm inline-block mr-2">
                    Grade updated:
                  </p>
                  <span className="text-sm text-green-700 font-bold">10</span>
                </div>
                <h6 className="text-xs float-right">9:30</h6>
              </div>
              <div className="bg-red-50 p-3 rounded-md">
                <div>
                  <h6 className="text-red-900 text-center font-medium text-sm mr-2">
                    Review closed
                  </h6>
                </div>
                <h6 className="text-xs float-right">9:30</h6>
              </div>
            </div>
          </div>
          <div className="px-6 pt-2">
            <div className="flex items-end gap-3">
              <InputFormat label="Add a comment" height="h-16"></InputFormat>
              <Tooltip
                content="Post"
                className="bg-gray-700 text-xs py-1"
                placement="bottom"
              >
                <button className="bg-gray-200 w-10 h-10 text-blue-gray-600 hover:text-blue-gray-900 hover:bg-gray-300 flex items-center justify-center rounded-md">
                  <TbSend size="1.4rem"></TbSend>
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="p-6">
            <div className="w-fit">
              <Link to="/review">
                <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <IoIosArrowRoundBack size="1.5rem" />
                  <span className="text-sm">Go to reviews list</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <CloseReviewDialog
        open={showDialog}
        handleOpen={() => setShowDialog(false)}
      ></CloseReviewDialog>
    </>
  );
}

export default ReviewDetail;
