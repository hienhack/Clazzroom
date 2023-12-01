import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MdEmail } from "react-icons/md";
import { Button } from "@material-tailwind/react";

function VerificationPage() {
  const { user, setUser } = useContext(AuthContext);
  const { isVerifying, setIsVerifying } = useState(false);

  function handleVerfify() {
    setIsVerifying(true);
  }

  return (
    <div className="bg-indigo-50 flex flex-col items-center pt-20 min-h-screen w-full">
      <div className="-mt-6 p-6 rounded-full bg-green-200 w-fit">
        <MdEmail size="2rem" className="fill-green-600" />
      </div>
      <h1 className="font-bold text-3xl my-3">
        {user.is_verified
          ? "Your email has been verified"
          : "Verify your email address"}
      </h1>
      {/* <>
          <h6 className="text-sm my-1">
            You have to verify your email to continue using this application
          </h6>
          <h6 className="text-sm my-1">
            Click the VERIFY button below to get the verification mail sent to
            your email
          </h6>
          <Button className="bg-green-600 mt-8" onClick={handleVerfify}>
            verify
          </Button>
        </> */}
      {!user.is_verified && (
        <>
          <h6 className="mt-2 text-sm my-1">
            We have sent a verification link to <b>{user?.email}</b>
          </h6>
          <h6 className="text-sm my-1">
            Click on the link to complete the verification process
          </h6>
          <h6 className="text-sm my-1">
            You may need to check your spam folder
          </h6>
          <Button className="bg-green-600 mt-8">Resend email</Button>
        </>
      )}
    </div>
  );
}

export default VerificationPage;
