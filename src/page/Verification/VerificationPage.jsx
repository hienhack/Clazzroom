import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MdEmail, MdOutlineClose, MdMarkEmailRead } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button, Spinner } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function VerificationPage() {
  const { setUser } = useContext(AuthContext);
  // const { user } = useContext(AuthContext);

  // test user
  const user = {
    is_verified: false,
    image: "",
    full_name: "Hien Thai",
    email: "hienthai@gmail.com",
  };

  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token_id");
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user.is_verified) {
      setIsProcessing(false);
      // setIsVerified(true);
      return;
    } else if (token == null) {
      return;
    }

    axios
      .post("/users/verify", {
        token: token,
      })
      .then((res) => {
        setUser({
          ...user,
          is_verified: true,
        });
        setSuccess(true);
      })
      .catch((error) => {
        setError("This link is expired or invalid");
        setSuccess(true);
      });
  }, []);

  function handleResendBtnClick() {
    setSending(true);
    axios
      .post("/users/resend-verification", {})
      .then(() => {
        setSending(false);
      })
      .catch((error) => {});
  }

  return (
    <div className="bg-indigo-50 flex flex-col items-center pt-20 min-h-screen w-full">
      {isProcessing && (
        <div className="flex items-center gap-3 opacity-80">
          <Spinner className="h-6 text-blue-gray-700" />
          <h1 className="text-blue-gray-700 text-xl">Processing...</h1>
        </div>
      )}

      {error && (
        <>
          <div className="-mt-4 p-4 rounded-full bg-red-200 w-fit">
            <IoClose size="3rem" className="fill-red-600" />
          </div>
          <h1 className="font-bold text-3xl my-3">{error}</h1>
        </>
      )}

      {((!token && user?.is_verified) || success) && (
        <>
          <div className="-mt-6 p-6 rounded-full bg-green-200 w-fit">
            <MdMarkEmailRead size="2rem" className="fill-green-600" />
          </div>
          <h1 className="font-bold text-3xl my-3">
            Your email has been verified
          </h1>
          <h6 className="mt-2 my-1">You can close this page now!</h6>
        </>
      )}

      {!token && !user?.is_verified && (
        <>
          <div className="-mt-6 p-6 rounded-full bg-green-200 w-fit">
            <MdEmail size="2rem" className="fill-green-600" />
          </div>
          <h1 className="font-bold text-3xl my-3">Verify your email address</h1>

          <h6 className="mt-2 text-sm my-1">
            We have sent a verification link to <b>{user?.email}</b>
          </h6>
          <h6 className="text-sm my-1">
            Click on the link to complete the verification process
          </h6>
          <h6 className="text-sm my-1">
            You may need to check your spam folder
          </h6>
          <h6 className="text-sm my-1">
            <b>Resend</b> if you couldn't see the mail or it is expired
          </h6>
          {sending ? (
            <Button className="bg-green-600 mt-8 normal-case" disabled>
              Sending...
            </Button>
          ) : (
            <Button
              className="bg-green-600 mt-8 normal-case"
              onClick={handleResendBtnClick}
            >
              Resend
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default VerificationPage;
