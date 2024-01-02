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
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import InputFormat from "../../component/common/InputFormat";
import { getStandardText } from "../../utils/InputFormatHelper";

function ClassGrade() {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(0);
  const [composition, setComposition] = useState(" ");

  function handleReviewClick(name, currentGrade) {
    setComposition(name);
    setCurrentGrade(currentGrade);
    setShowReviewDialog(true);
  }

  return (
    <>
      <div className="p-6 h-full overflow-y-auto">
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
            {/*  */}
            <hr className="border-gray-300 col-span-10" />
            <div className="py-4 text-center">
              <span className="text-sm">1</span>
            </div>
            <div className="col-span-4 py-4">
              <span className="text-sm">Assignments</span>
            </div>
            <div className="col-span-2 py-4 text-center">
              <span className="text-sm">20</span>
            </div>
            <div className="col-span-2 py-4 text-center">
              <span className="text-sm">10</span>
            </div>
            <div className="py-4">
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
                      onClick={() => handleReviewClick("Assignments", 1)}
                    />
                  </button>
                </Tooltip>
              </div>
            </div>
            {/*  */}
            <hr className="border-gray-300 col-span-10" />
            <div className="col-span-7 text-center py-4">
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="col-span-2 text-center py-4">
              <span className="text-sm font-medium">0</span>
            </div>
          </div>
        </div>
      </div>
      <CreateReviewDialog
        currentGrade={currentGrade}
        composition={composition}
        open={showReviewDialog}
        handleOpen={() => setShowReviewDialog(false)}
      />
    </>
  );
}

function CreateReviewDialog({ composition, currentGrade, open, handleOpen }) {
  const [processing, setProcessing] = useState(false);
  const explanationRef = useRef(null);
  const [error, setError] = useState(null);

  function onSubmit(data) {
    // setProcessing(true);
    const explanation = getStandardText(explanationRef.current.innerHTML);
    console.log(explanation);
    if (explanation == "") {
      setError("Explanation is required");
      return;
    }

    data.explanation = explanation;
    console.log(data);
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
    formState: { submitCount, errors },
  } = useForm({
    defaultValues: {
      composition: composition,
      expectation_grade: currentGrade,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      dismiss={{ enabled: !processing }}
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
                value={composition}
                className="mb-4"
                variant="standard"
                label="Grade composition"
                readOnly={true}
              ></Input>
              <div className="grid grid-cols-2 gap-6">
                <Input
                  value={currentGrade}
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
                <span>Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

export default ClassGrade;
