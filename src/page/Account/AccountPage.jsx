import { Button, Input } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import "./Style.css";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useState } from "react";

function AccountPage() {
  const [changingPassword, setChangingPassword] = useState(false);

  const user = {
    full_name: "Hien Thai",
    studen_id: "",
    phone_number: "",
    email: "hienthai@gmail.com",
  };

  function handleChangePassword() {
    setChangingPassword(!changingPassword);
  }

  return (
    <div className="h-full w-full bg-indigo-50">
      <div className="h-[300px] w-full cover-image px-6 flex justify-center">
        <div className="h-full w-full xl:w-[900px]">
          <h1 className="text-3xl text-gray-50 font-semibold pt-20">
            Hello Hien Thai
          </h1>
        </div>
      </div>
      <div className="-mt-[160px] flex justify-end w-full xl:w-[900px] mx-auto z-10">
        <div className="w-4/12 flex justify-center">
          <img
            className="w-40 h-40 h- rounded-full object-center object-cover"
            src="https://afamilycdn.com/150157425591193600/2023/7/10/3581026861353491429191131976811112986346003n-168896101713887268472.jpg"
          ></img>
        </div>
      </div>
      <div className="-mt-28 px-8">
        <div className="mx-auto bg-white rounded-xl p-10 xl:w-[900px]">
          <div className="w-8/12 flex flex-col gap-8 mb-3">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-blue-gray-800 text-lg font-bold">
                  User information
                </h1>
                <button className="flex items-center gap-1 text-blue-gray-300 hover:text-blue-gray-500 fill-blue-gray-300 font-semibold hover:fill-blue-gray-500">
                  <FaEdit className="fill-inherit" />
                  <small>Edit</small>
                </button>
              </div>
              <div className="w-full grid grid-cols-2 gap-6 mt-6">
                <Input
                  label="Full name"
                  variant="standard"
                  value={"Hien Thai"}
                  readOnly={true}
                ></Input>
                <Input
                  label="Phone number"
                  variant="standard"
                  value={" "}
                  readOnly={true}
                ></Input>
                <Input
                  label="Student ID"
                  variant="standard"
                  value={"20120472"}
                  readOnly={true}
                ></Input>
              </div>
            </div>
            <div>
              <h1 className="text-blue-gray-800 text-lg font-bold">Account</h1>
              <div className="w-full grid grid-cols-2 gap-6 mt-6">
                <Input
                  label="Email"
                  variant="standard"
                  value={"hienthai@gmail.com"}
                  readOnly={true}
                ></Input>
                <div className="relative w-full flex">
                  <Input
                    label="Password"
                    type="password"
                    variant="standard"
                    value={"12323432423"}
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                  />
                  <button
                    onClick={handleChangePassword}
                    className="!absolute right-1 top-4 flex items-center gap-1 text-blue-gray-300 hover:text-blue-gray-500 fill-blue-gray-300 font-semibold hover:fill-blue-gray-500"
                  >
                    <small>Change</small>
                  </button>
                  <ChangePasswordDialog
                    open={changingPassword}
                    handleOpen={handleChangePassword}
                    email={user.email}
                  ></ChangePasswordDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
