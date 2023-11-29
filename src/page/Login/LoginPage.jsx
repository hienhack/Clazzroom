import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaGooglePlusSquare, FaFacebookSquare } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
  const [error, setError] = useState();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function onSubmit(data) {
    // axios
    //   .post("/user/login", {
    //     username: data.email,
    //     password: data.password,
    //   })
    //   .then((res) => {
    //     login(res.data.data);
    //   })
    //   .catch((error) => {
    //     setError(error.response.message);
    //   });

    const testUser = {
      is_verified: false,
      image:
        "https://afamilycdn.com/150157425591193600/2023/7/10/3581026861353491429191131976811112986346003n-168896101713887268472.jpg",
      full_name: "Hien Thai",
      email: "hienthai@gmail.com",
      is_verified: false,
    };

    login({
      token: "asdfasdfasdfsf",
      user: testUser,
    });

    navigate("/");
  }

  function oauthLogin(method, id) {}

  function handleFacebookLogin() {}

  function handleGoolgeLogin() {}

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
    <div className="min-h-screen bg-indigo-50 py-20">
      <div className="w-4/12 bg-white shadow-sm rounded-xl p-12 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-center font-extrabold text-3xl mt-5 mb-9 text-blue-gray-800">
            Sign in
          </h1>
          {error && (
            <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>
          )}
          <div className="flex flex-col gap-8">
            <div>
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
                  <small className="text-red-600 italic mb-5">{message}</small>
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
              className="w-full text-center p-3 bg-blue-400 text-sm rounded-md font-semibold"
              type="submit"
            >
              Continue
            </Button>
          </div>
        </form>
        <div className="my-5 flex items-center gap-2">
          <hr className="grow" />
          <h6 className="text-gray-700 text-sm">Or Sign in with</h6>
          <hr className="grow" />
        </div>
        <div className="grid grid-cols-2  gap-3">
          <button className="flex items-center justify-center gap-2 p-2 border border-red-800 text-red-800 rounded-lg">
            <FaGooglePlusSquare size="1.5rem" />
            <span className="text-base font-bold">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-2 border border-blue-800 text-blue-800 rounded-lg">
            <FaFacebookSquare size="1.5rem" />
            <span className="text-base font-bold">Facebook</span>
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
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
