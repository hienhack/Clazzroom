import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

function LoginFailed() {
  useEffect(() => {
    setTimeout(() => window.close(), 3000);
  }, []);

  return (
    <div className="h-screen">
      <div className="mt-10">
        <Link to="/">
          <div className="flex gap-2 items-center justify-center">
            <img className="h-[30px] m-1" src="/logo.png"></img>
            <h1 className="text-xl font-semibold text-gray-500">Clazzroom</h1>
          </div>
        </Link>
      </div>
      <div className="mt-40">
        <h1 className="font-bold text-xl text-center">Sign-in failed</h1>
        <h6 className="font-medium text-center mt-5">
          Your account has been regsitered!
        </h6>
      </div>
    </div>
  );
}

export default LoginFailed;
