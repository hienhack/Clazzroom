import { ErrorMessage } from "@hookform/error-message";
import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdKeyboardBackspace } from "react-icons/md";

function MoreInfoForm({ user, login, handleCancel }) {
  const [error, setError] = useState();

  function onSubmit(data) {
    const newUser = { ...user, email: data.email };
    axios
      .post("/users/register", newUser)
      .then((res) => {
        login("facebook", { fb_id: user.fb_id }, null);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.message);
        }
      });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user.email,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return (
    <>
      <h1 className=" text-blue-gray-900 font-extrabold text-3xl mt-5 mb-14">
        {user.email ? "Email confirmation" : "Email needed"}
      </h1>
      <h6 className="text-sm text-blue-gray-700 text-justify mb-5">
        {user.email
          ? "Please, have a look at your email and make sure you have access to it or enter a new one to continue."
          : "Please add your email so that we can register your new account"}
      </h6>
      {error && <h6 className="text-red-600 text-sm italic mb-5">{error}</h6>}
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text text-blue-gray-700 fill-blue-gray-700 flex items-center gap-1"
              onClick={handleCancel}
            >
              <MdKeyboardBackspace size="1.1rem" className="fill-inherit" />
              <span className="text-sm">Back</span>
            </button>
            <Button
              className="text-center p-3 bg-blue-400 text-sm rounded-md font-semibold normal-case"
              type="submit"
            >
              Continue
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default MoreInfoForm;
