import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import ForgotPasswordForm from "./ForgotPasswordForm";

function createWindow(api) {
  const width = 500;
  const height = 600;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  let url = import.meta.env.VITE_API + api;
  url = url.replace("/api", "");
  const windowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;
  const windowName = "Google Login";
  console.log("ha ha ha");
  return window.open(url, windowName, windowFeatures);
}

function LoginPage() {
  const [forgotPw, setForgotPw] = useState(false);
  const [error, setError] = useState();
  const { login: loginToContext, redirect, logout } = useContext(AuthContext);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  function onSubmit(data) {
    setSending(true);
    axios
      .post("/users/login", data)
      .then((res) => {
        loginToContext(res.data.data);
        if (redirect != null) {
          navigate(redirect);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setSending(false);
      });
  }

  function handleSocialLogin(methodPath) {
    const windowRef = createWindow(methodPath);
    const timer = setInterval(() => {
      if (windowRef.closed) {
        setTimeout(() => {
          clearInterval(timer);
        }, 1500);
        return;
      }
      login();
    }, 1200);
  }

  function login() {
    axios
      .get("/login/check", {
        withCredentials: true,
      })
      .then((res) => {
        loginToContext(res.data.data);
        if (redirect != null) {
          navigate(redirect);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {});
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return (
    <div className="min-h-screen bg-indigo-50 pt-20">
      <div className="w-4/12 bg-white shadow-sm rounded-xl p-12 mx-auto">
        {!forgotPw && (
          <>
            <div className="flex items-center justify-center gap-3 mt-4 mb-10">
              <img className="w-9 h-9 rounded-full" src="/logo.png"></img>
              <h1 className="text-center text-blue-gray-900 font-extrabold text-3xl ">
                Sign in
              </h1>
            </div>
            {error && (
              <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-8">
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
                    variant="standard"
                    label="Email"
                  ></Input>
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <small className="text-red-600 italic mb-5">
                        {message}
                      </small>
                    )}
                  />
                </div>
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
                  <div>
                    <button
                      type="button"
                      className="mt-2 block float-right text-xs text-blue-gray-400 hover:text-blue-gray-700"
                      onClick={() => setForgotPw(true)}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
                <Button
                  className="w-full text-center p-3 bg-blue-400 text-sm rounded-md font-semibold normal-case"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? "Processing..." : "Continue"}
                </Button>
              </div>
            </form>
            <div className="my-5 flex items-center gap-2">
              <hr className="grow border-blue-gray-200" />
              <h6 className="text-gray-700 text-sm">Or continue with</h6>
              <hr className="grow border-blue-gray-200" />
            </div>
            <div className="grid grid-cols-2  gap-3">
              <button
                className="flex justify-center items-center gap-2 w-full p-[0.6rem] fill-white text-white rounded-md bg-red-700 hover:bg-red-800"
                onClick={() => handleSocialLogin("auth/google")}
                type="button"
              >
                <FaGoogle size="1.2rem" className="fill-inherit" />
                <span>Google</span>
              </button>

              <button
                className="flex justify-center items-center gap-2 w-full p-[0.6rem] fill-white text-white rounded-md bg-blue-800 hover:bg-blue-900"
                onClick={() => handleSocialLogin("auth/facebook")}
                type="button"
              >
                <FaFacebook size="1.2rem" className="fill-inherit" />
                <span>Facebook</span>
              </button>
            </div>
            <div className="mt-10 flex gap-2 items-center">
              <h1 className="text-sm text-gray-700">
                Did not have an account yet?
              </h1>
              <Link to="/sign-up">
                <h6
                  className="font-semibold text-sm text-deep-purple-900 hover:text-deep-purple-400"
                  href="#"
                >
                  Create now
                </h6>
              </Link>
            </div>{" "}
          </>
        )}
        {forgotPw && (
          <ForgotPasswordForm
            onBack={() => {
              setForgotPw(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;
