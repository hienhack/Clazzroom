import { Input, Tooltip } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import "./Style.css";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "react-toastify";
import MapStudentIdDialog from "./MapStudentIdDialog";
import axios from "axios";

function AccountPage() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [mappingID, setMappingID] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  function handleEdit() {
    setEditing(true);
    reset({ phone_number: user.phone_number || "" });
  }

  function handleCancelEditProfile() {
    setEditing(false);
    reset({
      full_name: user.full_name,
      phone_number: user.phone_number || " ",
    });
  }

  function handleSaveProfile(data) {
    setSavingProfile(true);
    axios
      .patch("/users/profile", {
        ...user,
        full_name: data.full_name,
        phone_number: data.phone_number == " " ? null : data.phone_number,
      })
      .then((res) => {
        setUser(res.data.data);
        setEditing(false);
        toast.success("Updated profile");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong, please try again!");
      })
      .finally(() => {
        setSavingProfile(false);
      });
  }

  function handleChangeImage(event) {
    if (event.target.files.length <= 0) return;
    const image = event.target.files[0];
    const data = new FormData();
    data.append("file", image, image.name);
    const message = toast.loading("Uploading");
    setSavingImage(true);
    axios
      .patch("/users/avatar", data, {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((res) => {
        toast.update(message, {
          render: "Updated avatar",
          isLoading: false,
          type: "success",
          autoClose: true,
        });
        setUser(res.data.data);
      })
      .catch((error) => {
        toast.update(message, {
          render: "Error happened when uploading new avatar, please try again!",
          isLoading: false,
          type: "error",
          autoClose: true,
        });
      })
      .finally(() => {
        setSavingImage(false);
      });
  }

  function handleChangePassword() {
    setChangingPassword(!changingPassword);
  }

  useEffect(() => {
    if (user == null) return;
    reset({
      full_name: user.full_name,
      phone_number: user.phone_number || " ",
    });
  }, [user]);

  return (
    <>
      <div className="bg-indigo-50 pb-8 min-h-full">
        <div className="h-[300px] w-full cover-image px-6 flex justify-center">
          <div className="h-full w-full xl:w-[900px]">
            <h1 className="text-3xl text-gray-50 font-semibold pt-20">
              Hello {user?.full_name}
            </h1>
          </div>
        </div>
        <div className="-mt-[160px] flex justify-end w-full xl:w-[900px] mx-auto z-10">
          <div className="w-4/12 flex justify-center">
            <div className="w-40 h-40 relative group">
              <img
                className="w-full aspect-square rounded-full object-cover bg-indigo-500"
                src={user?.image || "/default-user-image.png"}
              ></img>
              <div className="absolute top-0 left-0 w-40 h-40 flex items-center justify-center">
                <label className="opacity-20 group-hover:opacity-50 bg-gray-300 hover:bg-gray-200 py-1 px-2 rounded-md">
                  <small className="text-blue-gray-600 font-semibold text-xs">
                    Change
                  </small>
                  <input
                    type="file"
                    onChange={handleChangeImage}
                    className="hidden"
                    disabled={savingImage || savingProfile}
                  ></input>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-28 px-8">
          <div className="mx-auto bg-white rounded-xl p-10 xl:w-[900px]">
            <div className="w-8/12 flex flex-col gap-8 mb-3">
              <form onSubmit={handleSubmit(handleSaveProfile)}>
                <div>
                  <div className="flex justify-between items-center">
                    <h1 className="text-blue-gray-800 text-lg font-bold">
                      User information
                    </h1>

                    {!editing && (
                      <button
                        className="flex items-center gap-1 text-blue-gray-300 hover:text-blue-gray-500 fill-blue-gray-300 font-semibold hover:fill-blue-gray-500"
                        onClick={handleEdit}
                        type="button"
                      >
                        <FaEdit className="fill-inherit" />
                      </button>
                    )}
                    {editing && (
                      <div className="flex gap-3 flex-row-reverse">
                        <Tooltip
                          className="bg-gray-700 text-xs py-1"
                          placement="bottom"
                          content="Save"
                        >
                          <button
                            className="flex items-center gap-1 fill-green-200 hover:fill-green-500"
                            type="submit"
                            disabled={savingProfile || savingImage}
                          >
                            <FaCheck size="0.9rem" fill="inherit" />
                          </button>
                        </Tooltip>
                        <Tooltip
                          className="bg-gray-700 text-xs py-1"
                          placement="bottom"
                          content="Cancel"
                        >
                          <button
                            type="button"
                            onClick={handleCancelEditProfile}
                            className="flex items-center gap-1 fill-red-200 hover:fill-red-500"
                            disabled={savingProfile || savingImage}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 384 512"
                            >
                              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <Input
                        {...register("full_name", {
                          required: {
                            value: true,
                            message: "Full name is required",
                          },
                        })}
                        className="mb-4"
                        variant="standard"
                        label="Full name"
                        readOnly={!editing}
                      ></Input>
                      <ErrorMessage
                        errors={errors}
                        name="full_name"
                        render={({ message }) => (
                          <small className="text-red-600 italic mb-5">
                            {message}
                          </small>
                        )}
                      />
                    </div>
                    <div>
                      <Input
                        {...register("phone_number", {
                          pattern: {
                            value: /^[0-9]{9}/,
                            message: "Invalid phone number",
                          },
                        })}
                        label="Phone number"
                        className="mb-4"
                        variant="standard"
                        readOnly={!editing}
                      ></Input>
                      <ErrorMessage
                        errors={errors}
                        name="phone_number"
                        render={({ message }) => (
                          <small className="text-red-600 italic mb-5">
                            {message}
                          </small>
                        )}
                      />
                    </div>
                    {user?.role == "student" &&
                      (user.student_id ? (
                        <Input
                          label="Student ID"
                          variant="standard"
                          value={user.student_id}
                          readOnly={true}
                        ></Input>
                      ) : (
                        <div className="relative w-full flex">
                          <Input
                            label="Student ID"
                            variant="standard"
                            className="pr-20"
                            value={" "}
                            readOnly={true}
                            containerProps={{
                              className: "min-w-0",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setMappingID(true)}
                            className="!absolute right-1 top-5 flex items-center gap-1 text-blue-gray-300 hover:text-blue-gray-500 fill-blue-gray-300 font-semibold hover:fill-blue-gray-500"
                          >
                            <small className="text-xs">Map</small>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </form>

              <div>
                <h1 className="text-blue-gray-800 text-lg font-bold">
                  Account
                </h1>
                <div className="w-full grid grid-cols-2 gap-6 mt-6">
                  <Input
                    label="Email"
                    variant="standard"
                    value={user?.email || " "}
                    readOnly={true}
                  ></Input>
                  <div className="relative w-full flex">
                    <Input
                      label="Password"
                      type="password"
                      variant="standard"
                      className="pr-20"
                      readOnly={true}
                      value={"***************"}
                      containerProps={{
                        className: "min-w-0",
                      }}
                    />
                    <button
                      onClick={handleChangePassword}
                      className="!absolute right-1 top-5 flex items-center gap-1 text-blue-gray-300 hover:text-blue-gray-500 fill-blue-gray-300 font-semibold hover:fill-blue-gray-500"
                    >
                      <small className="text-xs">Change</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordDialog
        open={changingPassword}
        handleOpen={handleChangePassword}
        email={user?.email}
      ></ChangePasswordDialog>
      <MapStudentIdDialog
        open={mappingID}
        handleOpen={() => setMappingID(false)}
      ></MapStudentIdDialog>
    </>
  );
}

export default AccountPage;
