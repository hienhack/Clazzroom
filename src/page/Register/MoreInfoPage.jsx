import { ErrorMessage } from "@hookform/error-message";
import { Button, Input, Radio } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdKeyboardBackspace } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MoreInfoPage() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [error, setError] = useState();
  const [emailNeeded, setEmailNeeded] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) return;
    if (user.role != "not_set") {
      navigate("/");
    }

    if (!user.is_verified) {
      setEmailNeeded(true);
    }
  }, [user]);

  function handleSubmit() {
    trigger();
    let data = null;
    if (emailNeeded) {
      if (isValid) data = getValues();
    } else if (getValues("role") != null) {
      data = { email: user.email, role: getValues("role") };
    }

    if (data != null) {
      axios
        .patch("/users/profile", {
          ...user,
          email: data.email,
          role: data.role,
        })
        .then((res) => {
          setUser(res.data.data);
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  }

  function goToSignIn() {
    logout();
    navigate("/sign-in");
  }

  const {
    register,
    trigger,
    getValues,
    getFieldState,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: user?.email,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return (
    <div className="min-h-screen bg-indigo-50 pt-20">
      <div className="w-4/12 bg-white shadow-sm rounded-xl p-12 mx-auto">
        <h1 className=" text-blue-gray-900 font-extrabold text-3xl mt-5 mb-14">
          Register needed
        </h1>
        <h6 className="text-sm text-blue-gray-700 text-justify mb-5">
          We need a few more information to finish registering your account!
        </h6>
        {error && <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>}
        <div className="flex flex-col gap-8">
          <div className={`${!emailNeeded && "hidden"}`}>
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
                labelProps={{ className: "text-sm" }}
                value={"student"}
                color="blue"
                label="Student"
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
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text text-blue-gray-700 fill-blue-gray-700 flex items-center gap-1 hover:text-blue-gray-900 hover:fill-blue-gray-900"
              onClick={goToSignIn}
              disabled={sending}
            >
              <MdKeyboardBackspace size="1.1rem" className="fill-inherit" />
              <span className="text-sm font-medium">Go to Sign in</span>
            </button>
            <Button
              size="sm"
              className="bg-blue-400 rounded-md normal-case text-sm"
              type="button"
              onClick={handleSubmit}
            >
              {sending ? "Processing" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoreInfoPage;
