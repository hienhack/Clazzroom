import { useEffect } from "react";
import { Link } from "react-router-dom";

function LoginSuccess() {
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
        <h1 className="font-bold text-xl text-center">Welcome to the app!</h1>
      </div>
    </div>
  );
}

export default LoginSuccess;
