import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState, useContext, useRef } from "react";
import { IoCopySharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import EditClassDialog from "./EditClassDialog";
import { ClassContext } from "../../context/ClassContext";
import { toast } from "react-toastify";

function ControlButton({ handleEditClass }) {
  return (
    <div className="flex items-center">
      <Tooltip
        className="bg-gray-700 text-xs py-1"
        placement="bottom"
        content="Edit class information"
      >
        <button
          className="fill-blue-gray-300 hover:fill-blue-gray-600"
          onClick={handleEditClass}
        >
          <FaRegEdit size="1.3rem" className="fill-inherit" />
        </button>
      </Tooltip>
    </div>
  );
}

function ClassDetail() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { loading, setController } = useOutletContext();
  const { currentClass } = useContext(ClassContext);

  useEffect(() => {
    if (currentClass == null) {
      setController(null);
      return;
    }
    setController(
      <ControlButton handleEditClass={() => setShowEditDialog(true)} />
    );

    return () => setController(null);
  }, [currentClass]);

  function handleCopy(field) {
    const link =
      window.location.origin +
      "/join/" +
      currentClass._id +
      "?join_code=" +
      currentClass.class_code;
    const content = field == "class_code" ? currentClass.class_code : link;
    navigator.clipboard.writeText(content);

    toast.success("Copied to clipboard");
  }

  return (
    <>
      <div className="p-6">
        {loading && (
          <div className="animate-pulse mx-auto w-full h-full lg:w-[900px] rounded-xl drop-shadow-md">
            <div className="py-6 px-8 h-[190px] rounded-t-xl bg-[url('/account-page-cover-image.png')] bg-center bg-cover">
              <div className="flex items-end h-full">
                <div className="w-6/12 h-4 bg-gray-300 rounded opacity-20"></div>
              </div>
            </div>
            <div className="bg-white rounded-b-xl p-8 pb-12">
              <div className="grid grid-cols-5 gap-x-4 gap-y-6 text-sm">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="col-span-4">
                  <div className="w-8/12 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="col-span-4">
                  <div className="w-4/12 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="col-span-4">
                  <div className="w-5/12 h-3 bg-gray-200 rounded"></div>
                </div>

                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="col-span-4 flex flex-col gap-2">
                  <div className="w-8/12 h-3 bg-gray-200 rounded"></div>
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-5/12 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && (
          <div className="mx-auto w-full h-full lg:w-[900px] rounded-xl drop-shadow-md">
            <div className="py-6 px-8 h-[190px] rounded-t-xl bg-[url('/account-page-cover-image.png')] bg-center bg-cover">
              <div className="flex items-end h-full">
                <h1 className="text-white text-3xl font-semibold">
                  {currentClass?.class_name}
                </h1>
              </div>
            </div>
            <div className="bg-white rounded-b-xl p-8 pb-12">
              <div className="grid grid-cols-5 gap-x-4 gap-y-4 text-sm">
                <div className="h-full flex items-end">
                  <h6 className="font-medium">Class code</h6>
                </div>
                {currentClass?.class_code != "" ? (
                  <div className="col-span-4 flex gap-4 items-center">
                    <h1 className="text-blue-800 text-2xl font-semibold align-top">
                      {currentClass?.class_code}
                    </h1>

                    <Popover placement="bottom">
                      <PopoverHandler>
                        <button className="fill-blue-800 hover:fill-blue-600">
                          <IoCopySharp
                            size="1.25rem"
                            className="fill-inherit"
                          />
                        </button>
                      </PopoverHandler>
                      <PopoverContent className="w-fit p-0">
                        <div className="flex flex-col items-center justify-center"></div>
                        <button
                          onClick={() => handleCopy("link")}
                          className="px-5 w-full py-2 text-center text-sm block hover:bg-gray-200 rounded-t-sm"
                        >
                          Copy invite link
                        </button>
                        <button
                          onClick={() => handleCopy("class_code")}
                          className="px-5 py-2 text-center text-sm block hover:bg-gray-200 rounded-b-sm"
                        >
                          Copy class code
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <h1 className="text-blue-gray-400 col-span-4 text-lg font-semibold align-top">
                    Removed
                  </h1>
                )}
                <h6 className="font-medium">Topic</h6>
                <h6 className="text-blue-gray-800 col-span-4">
                  {currentClass?.topic}
                </h6>
                <h6 className="font-medium">Room</h6>
                <h6 className="text-blue-gray-800 col-span-4">
                  {currentClass?.room}
                </h6>
                <h6 className="font-medium">Description</h6>
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentClass?.description,
                  }}
                  className="text-blue-gray-900 col-span-4"
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <EditClassDialog
        open={showEditDialog}
        handleOpen={() => setShowEditDialog(false)}
      ></EditClassDialog>
    </>
  );
}

export default ClassDetail;
