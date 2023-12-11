import { Tooltip } from "@material-tailwind/react";
import { useCallback, useEffect, useState, useContext } from "react";
import { IoCopySharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import EditClassDialog from "./EditClassDialog";
import { ClassContext } from "../../context/ClassContext";
import { AuthContext } from "../../context/AuthContext";

function ControlButton({ handleEditClass }) {
  return (
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
  );
}

function ClassDetail() {
  const setController = useOutletContext();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { currentClass } = useContext(ClassContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (currentClass == null) {
      setController(null);
      return;
    }
    if (user._id != currentClass.owner._id) return;
    setController(
      <ControlButton handleEditClass={() => setShowEditDialog(true)} />
    );
  }, [currentClass]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentClass.class_code);
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="mx-auto w-[900px] rounded-xl drop-shadow-md">
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
                  <Tooltip
                    className="bg-gray-700 text-xs py-1"
                    placement="bottom"
                    content="Copy"
                  >
                    <button
                      className="fill-blue-800 hover:fill-blue-600"
                      onClick={handleCopy}
                    >
                      <IoCopySharp size="1.25rem" className="fill-inherit" />
                    </button>
                  </Tooltip>
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
              <p className="text-blue-gray-900 col-span-4">
                {currentClass?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      {showEditDialog && (
        <EditClassDialog
          open={showEditDialog}
          handleOpen={() => setShowEditDialog(false)}
        ></EditClassDialog>
      )}
    </>
  );
}

export default ClassDetail;
