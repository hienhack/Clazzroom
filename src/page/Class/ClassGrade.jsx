import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useState, useRef, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import InputFormat from "../../component/common/InputFormat";
import { getStandardText } from "../../utils/InputFormatHelper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

function total(grades) {
  let result = 0;
  grades.forEach((g) => {
    if (g.value != null && !isNaN(g.value)) {
      result = result + (g.value * g.scale) / 100;
    }
  });

  return result.toFixed(2);
}

function ClassGrade() {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gradeBoard, setGradeBoard] = useState(null);
  const [composition, setComposition] = useState(null);
  const { classId } = useParams();
  const { user } = useContext(AuthContext);

  function handleReviewClick(index) {
    setComposition(gradeBoard[index]);
    setShowReviewDialog(true);
  }

  function handleReviewSuccess() {
    const index = gradeBoard.findIndex((r) => r._id == composition._id);
    if (index == -1) return;
    const newGradeBoard = gradeBoard.slice();
    newGradeBoard[index].is_reviewed = true;
    setGradeBoard(newGradeBoard);
  }

  useEffect(() => {
    if (user && !user.student_id) return;
    axios
      .get(`/classes/${classId}/grade-board`)
      .then((res) => {
        setGradeBoard(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        alert("Something went wrong, please reload the page!");
      });
  }, []);

  return (
    <>
      <div className="p-6 h-full overflow-y-auto">
        {user?.student_id == null && (
          <div className="mt-20 flex flex-col items-center">
            <h6 className="text-blue-gray-800">
              You have to map your student ID to be able to see your grades
            </h6>
            <Link to="/account">
              <span className="text-indigo-600 text-sm hover:underline hover:text-indigo-800 font-medium">
                Go to my account
              </span>
            </Link>
          </div>
        )}
        {user?.student_id != null && !loading && (
          <div className="w-[600px] bg-white mx-auto drop-shadow-md rounded-lg">
            <div className="grid grid-cols-10 bg-indigo-800 text-white rounded-t-lg font-medium">
              <div className="py-4">
                <h6 className="text-sm text-center leading-6">#</h6>
              </div>
              <div className="col-span-4 py-4">
                <span className="text-sm">Composition name</span>
              </div>
              <div className="col-span-2 py-4 text-center">
                <span className="text-sm">Scale (%)</span>
              </div>
              <div className="col-span-2 py-4 text-center">
                <span className="text-sm">Point</span>
              </div>
              <div className="py-4"></div>
            </div>
            <div className="grid grid-cols-10">
              {gradeBoard?.map((r, index) => (
                <>
                  <hr className="border-gray-300 col-span-10" />
                  <div className="py-4 text-center">
                    <span className="text-sm">{index + 1}</span>
                  </div>
                  <div className="col-span-4 py-4">
                    <span className="text-sm">{r.name}</span>
                  </div>
                  <div className="col-span-2 py-4 text-center">
                    <span className="text-sm">{r.scale}</span>
                  </div>
                  <div className="col-span-2 py-4 text-center">
                    <span className="text-sm">{r.value}</span>
                  </div>
                  <div className="py-4">
                    {!r.is_reviewed && (
                      <div className="flex items-center h-full">
                        <Tooltip
                          className="bg-gray-700 text-xs py-1"
                          placement="bottom"
                          content="Request a review"
                        >
                          <button className="fill-blue-gray-500 hover:fill-blue-gray-800">
                            <MdOutlineQuestionAnswer
                              className="fill-inherit"
                              size="1.2rem"
                              onClick={() => handleReviewClick(index)}
                            />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </>
              ))}
              <hr className="border-gray-300 col-span-10" />
              <div className="col-span-7 text-center py-4">
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="col-span-2 text-center py-4">
                <span className="text-sm font-medium">
                  {gradeBoard ? total(gradeBoard) : 0}
                </span>
              </div>
            </div>
          </div>
        )}
        {user?.student_id != null && loading && (
          <div className="w-[600px] bg-white mx-auto drop-shadow-md rounded-lg">
            <div className="grid grid-cols-10 bg-indigo-800 text-white rounded-t-lg font-medium">
              <div className="py-4">
                <h6 className="text-sm text-center leading-6">#</h6>
              </div>
              <div className="col-span-4 py-4">
                <span className="text-sm">Composition name</span>
              </div>
              <div className="col-span-2 py-4 text-center">
                <span className="text-sm">Scale (%)</span>
              </div>
              <div className="col-span-2 py-4 text-center">
                <span className="text-sm">Point</span>
              </div>
              <div className="py-4"></div>
            </div>
            <div className="grid grid-cols-10">
              {[1, 2, 3, 4, 5].map((v) => (
                <>
                  <hr className="border-gray-300 col-span-10" />
                  <div className="py-4">
                    <div className="w-4/12 h-2 animate-pulse bg-gray-300 mx-auto"></div>
                  </div>
                  <div className="col-span-4 py-4">
                    <div className="w-7/12 h-2 animate-pulse bg-gray-300"></div>
                  </div>
                  <div className="col-span-2 py-4 text-center">
                    <div className="w-4/12 h-2 animate-pulse bg-gray-300 mx-auto"></div>
                  </div>
                  <div className="col-span-2 py-4 text-center">
                    <div className="w-4/12 h-2 animate-pulse bg-gray-300 mx-auto"></div>
                  </div>
                  <div className="py-4"></div>
                </>
              ))}
              <hr className="border-gray-300 col-span-10" />
              <div className="col-span-7 text-center py-4">
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="col-span-2 text-center py-4">
                <div className="w-4/12 h-2 animate-pulse bg-gray-300 mx-auto mt-1"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <CreateReviewDialog
        composition={composition}
        open={showReviewDialog}
        handleOpen={() => setShowReviewDialog(false)}
        handleSuccess={handleReviewSuccess}
      />
    </>
  );
}

function CreateReviewDialog({ composition, handleSuccess, open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const { classId } = useParams();
  const explanationRef = useRef(null);
  const [error, setError] = useState(null);

  function onSubmit(data) {
    setProcessing(true);
    const explanation = getStandardText(explanationRef.current.innerHTML);
    if (explanation == "") {
      setError("Explanation is required");
      return;
    }
    data.explanation = explanation;
    data.class_id = classId;
    data.grade_composition_id = composition._id;

    axios
      .post("/reviews", data)
      .then((res) => {
        toast.success("Review created");
        handleSuccess();
        handleCancel();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => setProcessing(false));
  }

  if (explanationRef.current != null) {
    explanationRef.current.onChange = (event) => {
      console.log(event.target.value);
    };
  }

  function handleCancel() {
    reset();
    setError(null);
    explanationRef.current.innerHTML = "";
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
      dismiss={{ enabled: false }}
      className="bg-transparent shadow-none"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto p-2 w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography className="mb-3" variant="h4" color="blue-gray">
              Request a grade review
            </Typography>
            <div className="flex flex-col gap-6">
              <Input
                value={composition?.name}
                className="mb-4"
                variant="standard"
                label="Grade composition"
                readOnly={true}
              ></Input>
              <div className="grid grid-cols-2 gap-6">
                <Input
                  value={composition?.value}
                  className="mb-4"
                  variant="standard"
                  label="Current grade"
                  readOnly={true}
                ></Input>
                <div>
                  <Input
                    {...register("expectation_grade", {
                      required: {
                        value: true,
                        message: "Expectation grade is required",
                      },
                      valueAsNumber: true,
                      validate: (value) => {
                        if (isNaN(value)) {
                          return "Not a number";
                        }
                      },
                    })}
                    defaultValue={composition?.value}
                    className="mb-4"
                    variant="standard"
                    label="Expectation grade"
                  ></Input>
                  <ErrorMessage
                    errors={errors}
                    name="expectation_grade"
                    render={({ message }) => (
                      <small className="text-red-600 italic mb-5">
                        {message}
                      </small>
                    )}
                  />
                </div>
              </div>
              <div>
                <InputFormat
                  height="h-24"
                  label="Explanation"
                  inputRef={explanationRef}
                ></InputFormat>
                {error && (
                  <small className="text-red-600 italic my-5">{error}</small>
                )}
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
                <span>{processing ? "Sending..." : "Send"}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default ClassGrade;
