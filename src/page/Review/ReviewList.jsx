import { Button, Option, Select } from "@material-tailwind/react";
import { useContext } from "react";
import { ClassContext } from "../../context/ClassContext";
import { Link } from "react-router-dom";

function ReviewList() {
  const { classList } = useContext(ClassContext);
  return (
    <div className="h-full p-6 overflow-y-scroll">
      <div className="min-h-full w-full flex justify-center space-x-6">
        <div className="w-64 h-fit max-h-full bg-white drop-shadow-md rounded-md p-6">
          <h6 className="font-semibold text-sm mb-4">Reviews' state</h6>
          <div className="grid grid-cols-2 gap-3">
            <Button size="sm" color="indigo" className="w-full normal-case">
              Pending
            </Button>
            <Button
              size="sm"
              color="indigo"
              variant="text"
              className="w-full normal-case"
            >
              Closed
            </Button>
          </div>
          <hr className="border-gray-300 mt-5 mb-6"></hr>
          <h6 className="font-semibold text-sm mb-4">Sort by</h6>
          <Select labelProps={{ className: "after:ml-0 before:mr-0" }}>
            <Option>Ascending updated date</Option>
            <Option>Descending updated date</Option>
          </Select>
          <hr className="border-gray-300 mt-5 mb-6"></hr>
          <h6 className="font-semibold text-sm mb-4">Classes</h6>
          <div className="flex flex-col gap-4 mb-4 max-h-full overflow-y-auto">
            {classList &&
              classList.map((c) => (
                <label
                  key={c._id}
                  className="inline-flex items-center gap-3 p-1"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm font-light truncate">
                    {c.class_name}
                  </span>
                </label>
              ))}
          </div>
        </div>
        <div className="w-[600px] flex flex-col gap-6">
          <Link to="/review/dsf">
            <div className="rouned-md drop-shadow-md bg-white rounded-md">
              <div className="px-6 py-3">
                <h1 className="font-semibold mb-1 text-blue-gray-900">
                  Phát triển ứng dụng web
                </h1>
                <h1 className="text-xs">Assignment 1</h1>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="grid grid-cols-7 gap-3">
                  <div className="col-span-3 flex gap-2 items-center">
                    <img
                      src="/default-user-image.png"
                      className="w-7 h-7 rouned-full"
                    ></img>
                    <div className="flex flex-col">
                      <h6 className="text-xs truncate">Thai Ngoc Vinh Hien</h6>
                      <h6 className="text-[10px]">20120472</h6>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Current grade:</small>
                    <small className="font-medium">8</small>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Expected grade:</small>
                    <small className="font-medium">10</small>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="flex flex-row-reverse gap-5">
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Last updated:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      9:30 THU 20-12-2023
                    </small>
                  </div>
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Comments:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      0
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/review/dsf">
            <div className="rouned-md drop-shadow-md bg-white rounded-md">
              <div className="px-6 py-3">
                <h1 className="font-semibold mb-1 text-blue-gray-900">
                  Phát triển ứng dụng web
                </h1>
                <h1 className="text-xs">Assignment 1</h1>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="grid grid-cols-7 gap-3">
                  <div className="col-span-3 flex gap-2 items-center">
                    <img
                      src="/default-user-image.png"
                      className="w-7 h-7 rouned-full"
                    ></img>
                    <div className="flex flex-col">
                      <h6 className="text-xs truncate">Thai Ngoc Vinh Hien</h6>
                      <h6 className="text-[10px]">20120472</h6>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Current grade:</small>
                    <small className="font-medium">8</small>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Expected grade:</small>
                    <small className="font-medium">10</small>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="flex flex-row-reverse gap-5">
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Last updated:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      9:30 THU 20-12-2023
                    </small>
                  </div>
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Comments:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      0
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/review/dsf">
            <div className="rouned-md drop-shadow-md bg-white rounded-md">
              <div className="px-6 py-3">
                <h1 className="font-semibold mb-1 text-blue-gray-900">
                  Phát triển ứng dụng web
                </h1>
                <h1 className="text-xs">Assignment 1</h1>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="grid grid-cols-7 gap-3">
                  <div className="col-span-3 flex gap-2 items-center">
                    <img
                      src="/default-user-image.png"
                      className="w-7 h-7 rouned-full"
                    ></img>
                    <div className="flex flex-col">
                      <h6 className="text-xs truncate">Thai Ngoc Vinh Hien</h6>
                      <h6 className="text-[10px]">20120472</h6>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Current grade:</small>
                    <small className="font-medium">8</small>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Expected grade:</small>
                    <small className="font-medium">10</small>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="flex flex-row-reverse gap-5">
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Last updated:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      9:30 THU 20-12-2023
                    </small>
                  </div>
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Comments:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      0
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/review/dsf">
            <div className="rouned-md drop-shadow-md bg-white rounded-md">
              <div className="px-6 py-3">
                <h1 className="font-semibold mb-1 text-blue-gray-900">
                  Phát triển ứng dụng web
                </h1>
                <h1 className="text-xs">Assignment 1</h1>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="grid grid-cols-7 gap-3">
                  <div className="col-span-3 flex gap-2 items-center">
                    <img
                      src="/default-user-image.png"
                      className="w-7 h-7 rouned-full"
                    ></img>
                    <div className="flex flex-col">
                      <h6 className="text-xs truncate">Thai Ngoc Vinh Hien</h6>
                      <h6 className="text-[10px]">20120472</h6>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Current grade:</small>
                    <small className="font-medium">8</small>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Expected grade:</small>
                    <small className="font-medium">10</small>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="flex flex-row-reverse gap-5">
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Last updated:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      9:30 THU 20-12-2023
                    </small>
                  </div>
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Comments:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      0
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/review/dsf">
            <div className="rouned-md drop-shadow-md bg-white rounded-md">
              <div className="px-6 py-3">
                <h1 className="font-semibold mb-1 text-blue-gray-900">
                  Phát triển ứng dụng web
                </h1>
                <h1 className="text-xs">Assignment 1</h1>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="grid grid-cols-7 gap-3">
                  <div className="col-span-3 flex gap-2 items-center">
                    <img
                      src="/default-user-image.png"
                      className="w-7 h-7 rouned-full"
                    ></img>
                    <div className="flex flex-col">
                      <h6 className="text-xs truncate">Thai Ngoc Vinh Hien</h6>
                      <h6 className="text-[10px]">20120472</h6>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Current grade:</small>
                    <small className="font-medium">8</small>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 justify-end">
                    <small className="text-gray-800">Expected grade:</small>
                    <small className="font-medium">10</small>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300"></hr>
              <div className="px-6 py-3">
                <div className="flex flex-row-reverse gap-5">
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Last updated:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      9:30 THU 20-12-2023
                    </small>
                  </div>
                  <div className="flex gap-2 items-center">
                    <small className="text-gray-700">Comments:</small>
                    <small className="font-semibold text-green-600 text-xs leading-3">
                      0
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
