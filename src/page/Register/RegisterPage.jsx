import { ErrorMessage } from "@hookform/error-message";
import { Button, Input, Radio } from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  function onSubmit(data) {
    setProcessing(true);
    const { confirm, ...newUser } = data;

    axios
      .post("users/register", newUser)
      .then((res) => {
        navigate("/sign-in");
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm: "",
      role: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center items-center">
      <div className="w-4/12 bg-white rounded-xl p-12 my-20">
        <h1 className="text-center text-blue-gray-900 font-extrabold text-3xl mt-5 mb-9">
          Sign up
        </h1>
        {error && <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <div>
              <Input
                {...register("full_name", {
                  required: {
                    value: true,
                    message: "Full name is required!",
                  },
                })}
                variant="standard"
                label="Full name"
              ></Input>
              <ErrorMessage
                errors={errors}
                name="full_name"
                render={({ message }) => (
                  <small className="text-red-600 italic mb-5">{message}</small>
                )}
              />
            </div>
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
                      return "Your passwords do not match";
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
                  <small className="text-red-600 italic mb-5">{message}</small>
                )}
              />
            </div>
            <div>
              <div className="flex gap-3 items-center">
                <h6 className="text-blue-gray-600 text-sm">You are a: </h6>
                <Radio
                  {...register("role", {
                    required: {
                      value: true,
                      message:
                        "You must choose your role as a student or a teacher",
                    },
                  })}
                  value={"student"}
                  color="blue"
                  label="Student"
                  labelProps={{ className: "text-sm" }}
                />
                <Radio
                  {...register("role")}
                  value={"teacher"}
                  color="blue"
                  label="Teacher"
                  labelProps={{ className: "text-sm" }}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="role"
                render={({ message }) => (
                  <small className="text-red-600 italic mb-5">{message}</small>
                )}
              />
            </div>
            <Button
              className="w-full text-center p-3 bg-blue-400 text-sm rounded-md font-semibold normal-case mt-3"
              type="submit"
              disabled={processing}
            >
              {processing ? "Processing..." : "Continue"}
            </Button>
          </div>
        </form>
        <div className="mt-10 flex gap-2 items-center">
          <h1 className="text-sm text-gray-700">Already have an account?</h1>
          <Link to="/sign-in">
            <h6
              className="font-semibold text-sm text-deep-purple-900 hover:text-deep-purple-400"
              href="#"
            >
              Sign in
            </h6>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
