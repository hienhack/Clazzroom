import { ErrorMessage } from "@hookform/error-message";
import { Button, Input } from "@material-tailwind/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import axios from "axios";

function ResetPasswordPage({ title }) {
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(search).get("token_id") || "";

  useEffect(() => {
    if (token == "") {
      navigate("/");
    }
  }, []);

  function onSubmit(data) {
    const reqData = {
      token: token,
      newPassword: data.password,
    };

    setSending(true);

    axios
      .patch("/users/resetPw", reqData)
      .then((res) => {
        setSuccess(true);
      })
      .catch((error) => {
        if (error.response.status == 403 || error.response.status == 401) {
          setError("This link is expired or does not exist");
        } else {
          setError("Something went wrong, please try again!");
        }
      })
      .finally(() => {
        setSending(false);
      });
  }

  function handleCountComplete() {
    navigate("/sign-in");
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirm: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  return (
    <>
      {!success && (
        <div className="min-h-screen bg-indigo-50 py-20">
          <div className="w-4/12 bg-white shadow-sm rounded-xl p-12 mx-auto">
            <h1 className=" text-blue-gray-900 font-extrabold text-3xl mt-5 mb-9">
              {title || "Reset password"}
            </h1>
            {error && (
              <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-8">
                <div>
                  <Input
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required!",
                      },
                      minLength: {
                        value: 8,
                        message: "Password must have at least 8 characters!",
                      },
                    })}
                    variant="standard"
                    label="Password"
                    type="password"
                  ></Input>
                  <ErrorMessage
                    errors={errors}
                    name="password"
                    render={({ message }) => (
                      <small className="text-red-600 italic mb-5">
                        {message}
                      </small>
                    )}
                  />
                </div>
                <div>
                  <Input
                    {...register("confirm", {
                      required: {
                        value: true,
                        message: "Password confirmation is required",
                      },
                      validate: (value) => {
                        if (watch("password") != value)
                          return "Your password do not match";
                      },
                    })}
                    variant="standard"
                    label="Confirm password"
                    type="password"
                  ></Input>
                  <ErrorMessage
                    errors={errors}
                    name="confirm"
                    render={({ message }) => (
                      <small className="text-red-600 italic mb-5">
                        {message}
                      </small>
                    )}
                  />
                </div>
                <Button
                  className="mt-5 w-full text-center p-3 bg-blue-400 text-sm rounded-md font-semibold normal-case"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? "Processing..." : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-indigo-50 flex flex-col items-center pt-20 min-h-screen w-full">
          <div className="-mt-6 p-6 rounded-full bg-green-200 w-fit">
            <FaCheck size="2.5rem" className="fill-green-600" />
          </div>
          <h1 className="font-bold text-3xl my-3">
            Password changed successfully
          </h1>
          <h6 className="mt-2 text-sm my-1">
            You will be redirect to&nbsp;
            <Link to="/sign-in">
              <span className="text-sm font-semibold text-deep-purple-900 hover:text-deep-purple-400">
                Sign in
              </span>
            </Link>
            &nbsp;after&nbsp;
            <Countdown
              date={Date.now() + 5000}
              renderer={(props) => (
                <span className="font-bold">{props.seconds}</span>
              )}
              onComplete={handleCountComplete}
            // autoStart={false}
            ></Countdown>
            s
          </h6>
        </div>
      )}
    </>
  );
}

export default ResetPasswordPage;
