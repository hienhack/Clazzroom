import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function AccountBanned() {
  const { user, setUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (!user) return;
  //     if (user.status) navigate("/");
  //   }, [user]);

  return (
    <div className="bg-indigo-50 flex flex-col items-center pt-20 min-h-screen w-full">
      <div className="-mt-4 p-4 rounded-full bg-red-200 w-fit">
        <IoClose size="3rem" className="fill-red-600" />
      </div>
      <h1 className="font-bold text-3xl my-3">Your account has been banned!</h1>
    </div>
  );
}

export default AccountBanned;
