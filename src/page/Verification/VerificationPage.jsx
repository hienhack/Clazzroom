import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MdEmail, MdMarkEmailRead } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button, Spinner } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerificationPage() {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token_id");
  const { user, setUser, token: session_token } = useContext(AuthContext);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Waiting for user to be loaded
    if (session_token != null && user == null) {
      return;
    } else if (session_token == null && token == null) {
      navigate("/sign-in");
      return;
    }

    // User not logged in or logged in and not verified
    if (user == null && token == null) {
      navigate("/sign-in");
      return;
    } else if (user == null && token != null) {
      setIsVerified(false); // default
    } else if (user != null && token == null) {
      setIsProcessing(false);
      setIsVerified(user.is_verified);
      return;
    } else if (user != null && token != null) {
      setIsVerified(false); // default
    }

    //  Token exists
    axios
      .post("/users/verify", {
        token: token,
      })
      .then((res) => {
        user.is_verified = true;
        setUser(user);
        setIsVerified(true);
      })
      .catch((error) => {
        setError("This link is expired or invalid");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [user, session_token]);

  function onfocus() {
    if (session_token) {
      axios
        .get("/users/profile", {})
        .then((res) => {
          setUser(res.data.data);
        })
        .catch(() => {});
    }
  }

  // Handling when user click back to this tab
  useEffect(() => {
    window.addEventListener("focus", onfocus);
    return () => window.removeEventListener("focus", onfocus);
  });

  function handleResendBtnClick() {
    setSending(true);
    axios
      .post("/users/resend-verification", {})
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {})
      .finally(() => {
        setSending(false);
      });
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

      {isVerified && (
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

      {!isVerified && !isProcessing && !error && (
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
