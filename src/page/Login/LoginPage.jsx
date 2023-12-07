import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import MoreInfoForm from "./MoreInfoForm";
import { LoginSocialFacebook } from "reactjs-social-login";
import { LoginSocialGoogle } from "reactjs-social-login";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { LoginButton } from "./LoginButton";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LOGIN_METHOD_URL = {
  facebook: "/users/facebook-oauth",
  google: "/users/google-oauth",
  basic: "/users/login",
};

const token_url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";

function LoginPage() {
  const [registerNeeded, setRegisterNeeded] = useState();
  const { setUser } = useContext(AuthContext);
  const [loadedUser, setLoadeUser] = useState();
  const [forgotPw, setForgotPw] = useState(false);
  const [error, setError] = useState();
  const { login: loginToContext } = useContext(AuthContext);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  function login(method, data, errorHandler) {
    const url = LOGIN_METHOD_URL[method];
    setSending(true);
    axios
      .post(url, data)
      .then((res) => {
        loginToContext(res.data.data);
        navigate("/");
      })
      .catch((error) => {
        if (!errorHandler) return;
        errorHandler(error);
      })
      .finally(() => {
        setSending(false);
      });
  }

  function onSubmit(data) {
    login("basic", data, (error) => {
      setError(error.response.data.message);
    });
  }

  function handleFacebookLogin(response) {
    if (response?.id) {
      const {
        id: fb_id,
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
    }
  }

  async function handleGoogleLogin(response) {
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const clientId =
      "808993990616-cp2jebgeusd5vdcq1nikroc95etecuim.apps.googleusercontent.com";
    const clientSecret = "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";
    const redirectUri = "https://clazzroom.vercel.app";

    const requestBody = {
      code: response.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(token_url + data.access_token)
          .then((response) => response.json())
          .then((data) => {
            const { id: gg_id, name: full_name, email, picture: image } = data;
            login("google", { gg_id }, (error) => {
              if (error?.response?.status === 401) {
                const user = { gg_id, full_name, email, image };

                // setUser(user);
                // setRegisterNeeded(true);

                axios.post("/users/register", user).then((res) => {
                  login("google", user, (e) => {
                    setError(e.response.data.message);
                  });
                });
              }
            });
          })
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => console.error("Error:", error));
  }

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
          {!registerNeeded && !forgotPw && (
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
                <LoginSocialGoogle
                  client_id="808993990616-cp2jebgeusd5vdcq1nikroc95etecuim.apps.googleusercontent.com"
                  discoveryDocs="claims_supported"
                  access_type="offline"
                  onResolve={({ provider, data }) => {
                    handleGoogleLogin(data);
                  }}
                  onReject={(error) => { }}
                >
                  <button className="flex justify-center items-center gap-2 w-full p-[0.6rem] fill-white text-white rounded-md bg-red-700 hover:bg-red-800">
                    <FaGoogle size="1.2rem" className="fill-inherit" />
                    <span>Google</span>
                  </button>
                </LoginSocialGoogle>
                <FacebookLogin
                  appId="2580168245493289"
                  onSuccess={(response) => { }}
                  onFail={(error) => {
                    console.log("Login Failed!", error);
                  }}
                  onProfileSuccess={(response) => {
                    handleFacebookLogin(response);
                  }}

                // )}
                >
                  <button className="flex justify-center items-center gap-2 w-full p-[0.6rem] fill-white text-white rounded-md bg-blue-800 hover:bg-blue-900">
                    <FaFacebook size="1.2rem" className="fill-inherit" />
                    <span>Facebook</span>
                  </button>
                </FacebookLogin>
                <LoginButton />
                {/* <LoginSocialFacebook
                  appId="2580168245493289"
                  fields="name,email,picture"
                  onResolve={(response) => {
                    handleFacebookLogin(response.data);
                  }}
                  onReject={(error) => {
                  }}
                >
                  <button className="flex justify-center items-center gap-2 w-full p-[0.6rem] fill-white text-white rounded-md bg-blue-800 hover:bg-blue-900">
                    <FaFacebook size="1.2rem" className="fill-inherit" />
                    <span>Facebook</span>
                  </button>
                </LoginSocialFacebook> */}
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
              login={login}
              handleCancel={handleCancelRegistor}
              user={loadedUser}
            />
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
    </>
  );
}

export default LoginPage;
