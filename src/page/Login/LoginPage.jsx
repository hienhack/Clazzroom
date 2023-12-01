import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaGooglePlusSquare, FaFacebookSquare } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import MoreInfoForm from "./MoreInfoForm";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const LOGIN_METHOD_URL = {
  facebook: "/users/facebook-oauth",
  google: "/users/google-oauth",
  basic: "/users/login",
};

function LoginPage() {
  const [registerNeeded, setRegisterNeeded] = useState();
  const [loadedUser, setLoadeUser] = useState();
  const [error, setError] = useState();
  const { login: loginToContext } = useContext(AuthContext);
  const navigate = useNavigate();

  function login(method, data, errorHandler) {
    const url = LOGIN_METHOD_URL[method];
    axios
      .post(url, data)
      .then((res) => {
        console.log(res);
        loginToContext(res.data.data);
        navigate("/");
      })
      .catch((error) => {
        if (!errorHandler) return;
        errorHandler(error);
      });
  }

  function onSubmit(data) {
    login(data, (error) => {
      setError(error.response.data.message);
    });
  }

  function handleFacebookLogin(response) {
    if (response?.accessToken) {
      const {
        userID: fb_id,
        name: full_name,
        email,
        picture: {
          data: { url: image },
        },
      } = response;
      login("facebook", { fb_id }, (error) => {
        if (error?.response?.status === 401) {
          const user = { fb_id, full_name, email, image };
          setLoadeUser(user);
          setRegisterNeeded(true);
        }
      });
    } else {
      console.log("Facebook login failed");
    }
  }

  function handleGoogleLogin() { }

  function handleCancelRegistor() {
    setRegisterNeeded(false);
    setLoadeUser({});
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
    <>
      <div className="min-h-screen bg-indigo-50 py-20">
        <div className="w-4/12 bg-white shadow-sm rounded-xl p-12 mx-auto">
          {!registerNeeded && (
            <>
              <h1 className="text-center text-blue-gray-900 font-extrabold text-3xl mt-5 mb-9">
                Sign in
              </h1>
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
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>
                  <Button
                    className="w-full text-center p-3 bg-blue-400 text-sm rounded-md font-semibold normal-case"
                    type="submit"
                  >
                    Continue
                  </Button>
                </div>
              </form>
              <div className="my-5 flex items-center gap-2">
                <hr className="grow border-blue-gray-200" />
                <h6 className="text-gray-700 text-sm">Or continue with</h6>
                <hr className="grow border-blue-gray-200" />
              </div>
              <div className="grid grid-cols-2  gap-3">
                <button className="flex items-center justify-center gap-2 p-2 border border-red-800 text-red-800 rounded-lg">
                  <FaGooglePlusSquare size="1.5rem" />
                  <span className="text-base font-bold">Google</span>
                </button>
                <FacebookLogin
                  appId="2580168245493289"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookLogin}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className="flex items-center justify-center gap-2 p-2 border border-blue-800 text-blue-800 rounded-lg"
                    >
                      <FaFacebookSquare size="1.5rem" />
                      <span className="text-base font-bold">Facebook</span>
                    </button>
                  )}
                />
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
          {registerNeeded && (
            <MoreInfoForm
              user={loadedUser}
              login={login}
              handleCancel={handleCancelRegistor}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default LoginPage;
