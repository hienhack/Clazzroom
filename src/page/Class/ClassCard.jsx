import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function ClassCard({ clazz }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white rounded-md border border-gray-300 w-[300px]">
      <Link to={"/class/" + clazz._id}>
        <div className="text-white rounded-t-md p-4 hover:underline bg-light-blue-900">
          <h1 className="w-full truncate text-lg font-medium">
            {clazz.class_name}
          </h1>
          <h6 className="w-full truncate text-xs mt-3">{clazz.topic}</h6>
        </div>
      </Link>

      <div className="p-4">
        {user._id == clazz.owner._id ? (
          <div className="flex h-9 items-center">
            <h1 className="font-semibold text-light-green-600 text-lg">
              Owner
            </h1>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Avatar
              size="sm"
              src={clazz.owner.image || "/default-user-image.png"}
            />
            <div className="flex flex-col justify-center">
              <h6 className="text-blue-gray-700 text-sm">
                {clazz.owner.full_name}
              </h6>
              <small className="text-gray-600 text-xs">
                {clazz.owner.email}
              </small>
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 mt-3 text-blue-gray-700">
          <h6 className="text-xs">
            Teachers: <b>{clazz.teacher_count}</b>
          </h6>
          <h6 className="text-xs">
            Students: <b>{clazz.student_count}</b>
          </h6>
        </div>
      </div>
      <hr className="bg-gray-300"></hr>
      <div className="p-4 flex justify-end items-center gap-2">
        <h6 className="text-blue-gray-600 text-xs">Class status:</h6>
        <span className="font-medium text-xs text-light-green-600">
          {clazz.status == "active" ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

export default ClassCard;
