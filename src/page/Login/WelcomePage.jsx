import { Avatar } from "@material-tailwind/react";

function WelcomePage() {
  return (
    <div className="min-h-screen bg-white p-20">
      <div className="flex flex-col items-center justify-center gap-20">
        <div className="flex gap-2 items-center">
          <img className="h-[30px] m-1" src="/logo.png"></img>
          <h1 className="text-xl font-semibold text-gray-500">Clazzroom</h1>
        </div>
        <div>
          <h1 className="text-2xl font-medium text-blue-gray-900">
            Welcome to the app!
          </h1>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
