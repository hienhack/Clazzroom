import { ErrorMessage } from "@hookform/error-message";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdKeyboardBackspace } from "react-icons/md";

function ForgotPasswordForm({ onBack }) {
  const [success, setSucess] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailInputed, setEmailInputed] = useState();

  //set setSending to false after receiving a response

  function onSubmit(data) {
    setEmailInputed(data.email);
    setSending(true);
    // Send request containing email to api resetPw
    // If error 500 happens, alert, otherwise just ignore it
    // If success, setSucess(true)
    // set

    setTimeout(() => {
      setSent(true);
      setSending(false);
    }, 3000);
  }

  function handleResend() {
    setSending(true);
    // send request containing emailInputed to pai resetPw again
    // If error 500 happens, alert, otherwise just ignore it
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  return (
    <>
      <h1 className=" text-blue-gray-900 font-extrabold text-3xl mt-5 mb-14">
        Forgot password
      </h1>
      <h6 className="text-sm text-blue-gray-700 text-justify mb-5">
        {!sent ? (
          "Enter your email address below and we'll send you a link to reset your password"
        ) : (
          <>
            We have sent an email to <u>{emailInputed}</u>, you may need to
            check your spam folder to see it. Click <b>Resend</b> to get a new
            mail if you can not find it out
          </>
        )}
      </h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8">
          <div className={sent && "hidden"}>
            <Input
              {...register("email", {
                required: { value: true, message: "Email is required!" },
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email",
                },
              })}
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
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text text-blue-gray-700 fill-blue-gray-700 flex items-center gap-1"
              onClick={onBack}
              disabled={sending}
            >
              <MdKeyboardBackspace size="1.1rem" className="fill-inherit" />
              <span className="text-sm">Back</span>
            </button>
            <Button
              className="text-center p-3 bg-blue-400 text-sm rounded-md font-semibold normal-case"
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending..." : sent ? "Resend" : "Send"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default ForgotPasswordForm;
