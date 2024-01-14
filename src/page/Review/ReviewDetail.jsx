import { Link, useNavigate, useParams, useRouteError } from "react-router-dom";
import InputFormat from "../../component/common/InputFormat";
import Loading from "../../component/common/Loading";
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
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { getDateFormated } from "../../utils/DateHelper";
import { getStandardText } from "../../utils/InputFormatHelper";
import { AuthContext } from "../../context/AuthContext";

function CloseReviewDialog({ review, open, handleOpen, handleSuccess }) {
  const [keep, setKeep] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { reviewId } = useParams();
  const {
    register,
    reset,
    trigger,
    getValues,
    formState: { isValid, errors },
  } = useForm({ defaultValues: {}, mode: "onBlur", reValidateMode: "onBlur" });

  function handleSubmit() {
    let new_grade = 0;
    if (keep) {
      new_grade = review.current_grade;
    } else {
      trigger();
      if (isValid) {
        new_grade = getValues("new_grade");
      }
    }

    axios
      .post(`/reviews/${reviewId}/final-decision`, {
        new_grade: new_grade,
      })
      .then((res) => {
        toast.success("Review closed!");
        handleSuccess();
        handleCancel();
      })
      .error((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setProcessing(false);
      });
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
                  <small className="mr-2 inline-block font-medium">
                    {review?.current_grade}
                  </small>
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
  const { user } = useContext(AuthContext);
  const [showDialog, setShowDialog] = useState(false);
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const explanationRef = useRef(null);
  const commentRef = useRef(null);
  const { reviewId } = useParams();
  const navigate = useNavigate();

  function handleCloseSuccess() {
    setReview({ ...review, state: "Closed" });
    location.reload();
  }

  function postComment() {
    const comment = getStandardText(commentRef.current.innerHTML);
    if (comment == "") return;

    setPosting(true);
    axios
      .post(`/reviews/${reviewId}/comments`, {
        type: "comment",
        content: comment,
      })
      .then((res) => {
        toast.success("Comment posted");
        commentRef.current.innerHTML = "";
        setComments([...comments, { type: "comment", content: comment }]);
      })
      .catch((error) => {
        toast.error("Cannot post the comment!");
      })
      .finally(() => setPosting(false));
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/reviews/${reviewId}`)
      .then((res) => {
        setReview(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.statusCode == 500) {
          alert("Something went wrong, please reload the page!");
        } else {
          navigate("/errors/not-found", { replace: true });
        }
      });

    axios
      .get(`/reviews/${reviewId}/comments`)
      .then((res) => {
        setComments(res.data.data);
      })
      .catch((error) => {
        if (error.response.data.statusCode == 500) {
          alert("Something went wrong, please reload the page!");
        } else {
          navigate("/errors/not-found", { replace: true });
        }
      });
  }, []);

  useEffect(() => {
    if (review == null || explanationRef.current == null) return;
    explanationRef.current.innerHTML = review.explanation;
  }, [review]);

  return (
    <>
      {loading && <Loading></Loading>}
      {!loading && (
        <div className="h-full p-6 overflow-y-auto">
          <div className="mx-auto w-[700px] rouned-md drop-shadow-md bg-white rounded-md">
            <div className="px-6 pb-3 pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-semibold text-blue-gray-900">
                    {review?.class.class}
                  </h1>
                  <h1 className="text-xs">{review?.grade_composition.name}</h1>
                </div>
                <div>
                  {review?.state == "Closed" ? (
                    <h1 className="text-green-700 font-bold text-sm">Closed</h1>
                  ) : (
                    <>
                      {user?.role == "teacher" && (
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
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-gray-300"></hr>
            <div className="px-6 py-3">
              <div className="grid grid-cols-7 gap-3">
                <div className="col-span-3 flex gap-2 items-center">
                  <img
                    src={review?.student.image || "/default-user-image.png"}
                    className="w-7 h-7 rouned-full"
                  ></img>
                  <div className="flex flex-col">
                    <h6 className="text-xs truncate">
                      {review?.student.full_name}
                    </h6>
                    <h6 className="text-[10px]">
                      {review?.student.student_id}
                    </h6>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 justify-end">
                  <small className="text-gray-800">Current grade:</small>
                  <small className="font-medium">{review?.current_grade}</small>
                </div>
                <div className="col-span-2 flex items-center gap-2 justify-end">
                  <small className="text-gray-800">Expectation grade:</small>
                  <small className="font-medium">
                    {review?.expectation_grade}
                  </small>
                </div>
              </div>
              <div>
                <h6 className="text-sm font-medium mt-3 mb-2">Explanation</h6>
                <div
                  className="text-sm text-blue-gray-800 font-light"
                  ref={explanationRef}
                ></div>
              </div>
            </div>
            <hr className="border-gray-300"></hr>
            <div className="px-6 py-3">
              <div className="flex flex-col gap-3">
                <h6 className="text-sm font-medium my-2">Comments</h6>
                {comments?.map((c, index) => (
                  <Commnent key={index} value={c}></Commnent>
                ))}
              </div>
            </div>
            {review?.state == "Pending" && (
              <div className="px-6 pt-2">
                <div className="flex items-end gap-3">
                  <InputFormat
                    inputRef={commentRef}
                    label="Add a comment"
                    height="h-16"
                  ></InputFormat>
                  <Tooltip
                    content="Post"
                    className="bg-gray-700 text-xs py-1"
                    placement="bottom"
                  >
                    <button
                      onClick={postComment}
                      disabled={posting}
                      className="bg-gray-200 w-10 h-10 text-blue-gray-600 hover:text-blue-gray-900 hover:bg-gray-300 flex items-center justify-center rounded-md"
                    >
                      <TbSend size="1.4rem"></TbSend>
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
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
      )}
      <CloseReviewDialog
        review={review}
        open={showDialog}
        handleOpen={() => setShowDialog(false)}
        handleSuccess={handleCloseSuccess}
      ></CloseReviewDialog>
    </>
  );
}

function Commnent({ value: comment }) {
  const commentRef = useRef(null);
  useEffect(() => {
    if (comment.type != "comment" || commentRef.current == null) return;
    commentRef.current.innerHTML = comment.content;
  }, []);

  return (
    <>
      {comment.type == "comment" && (
        <div className="rounded-md bg-light-blue-50 p-3">
          <div className="flex gap-3">
            <img
              className="w-8 h-8 rounded-full"
              src={comment.user?.image || "/default-user-image.png"}
            ></img>
            <div>
              <div className="flex items-center justify-between">
                <h6 className="text-xs">{comment.user?.full_name}</h6>
              </div>
              <div ref={commentRef} className="text-xs font-light"></div>
            </div>
          </div>
          <h6 className="text-xs float-right">
            {getDateFormated(comment.createdAt)}
          </h6>
        </div>
      )}
      {comment.type == "updating" && (
        <div className="bg-green-50 p-3 rounded-md">
          <div>
            <p className="text-green-900 font-medium text-sm inline-block mr-2">
              Grade updated:
            </p>
            <span className="text-sm text-green-700 font-bold">
              {comment.new_grade}
            </span>
          </div>
          <h6 className="text-xs float-right">
            {getDateFormated(comment.createdAt)}
          </h6>
        </div>
      )}
      {comment.type == "closing" && (
        <div className="bg-red-50 p-3 rounded-md">
          <div>
            <h6 className="text-red-900 text-center font-medium text-sm mr-2">
              Review closed
            </h6>
            <h6 className="text-center mt-2 text-xs text-blue-gray-700">
              Final grade: {comment.final_grade}
            </h6>
          </div>
          <h6 className="text-xs float-right">
            {getDateFormated(comment.createdAt)}
          </h6>
        </div>
      )}
    </>
  );
}

export default ReviewDetail;
