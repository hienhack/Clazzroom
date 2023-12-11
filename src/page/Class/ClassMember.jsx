import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Tooltip,
} from "@material-tailwind/react";
import { useCallback, useEffect, useState, useContext } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  MdOutlineGroupAdd,
  MdOutlineGroupRemove,
  MdClose,
} from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import InvitationDialog from "./InvitationDialog";
import { ClassContext } from "../../context/ClassContext";

function ControlButtons({
  enableRemove,
  cancelRemove,
  handleRemove,
  handleInvite,
}) {
  const [removing, setRemoving] = useState(false);

  function onRemoveClick() {
    setRemoving(true);
    enableRemove();
  }

  function onCancelRemoveClick() {
    setRemoving(false);
    cancelRemove();
  }

  function onConfirmRemoveClick() {
    handleRemove();
  }

  return (
    <div className="flex items-center gap-3 flex-row-reverse">
      <Tooltip
        className="bg-gray-700 text-xs py-1"
        placement="bottom"
        content="Add teacher/student"
      >
        <button
          className="fill-blue-gray-300 hover:fill-blue-gray-600"
          onClick={handleInvite}
        >
          <MdOutlineGroupAdd size="1.4rem" className="fill-inherit" />
        </button>
      </Tooltip>
      {!removing && (
        <Tooltip
          className="bg-gray-700 text-xs py-1"
          placement="bottom"
          content="Remove teacher/student"
        >
          <button
            className="fill-blue-gray-300 hover:fill-blue-gray-600"
            onClick={onRemoveClick}
          >
            <MdOutlineGroupRemove size="1.4rem" className="fill-inherit" />
          </button>
        </Tooltip>
      )}
      {removing && (
        <>
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Remove"
          >
            <button
              className="fill-red-700 hover:fill-red-900"
              onClick={onConfirmRemoveClick}
            >
              <FaRegTrashCan size="1.1rem" className="fill-inherit" />
            </button>
          </Tooltip>
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Cancel removing"
          >
            <button
              className="fill-blue-gray-300 hover:fill-blue-gray-600"
              onClick={onCancelRemoveClick}
            >
              <MdClose size="1.3rem" className="fill-inherit -m-1" />
            </button>
          </Tooltip>
        </>
      )}
    </div>
  );
}

function ClassMember() {
  const setController = useOutletContext();
  const [removeList, setRemoveList] = useState([]);
  const [removing, setRemoving] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const [processing, setProcessing] = useState(false);

  function enableRemove() {
    setRemoving(true);
  }

  const handleRemove = useCallback(() => {
    if (removeList.length == 0) {
      return;
    }
    setShowRemoveDialog(true);
  }, [removeList]);

  function cancelRemove() {
    setRemoveList([]);
    setRemoving(false);
  }

  function handleRemoveCheckbox(userId) {
    if (removeList.includes(userId)) {
      setRemoveList(removeList.filter((id) => userId != id));
    } else {
      setRemoveList([userId, ...removeList]);
    }
  }

  function handleRemoveDialog() {
    setShowRemoveDialog(!showRemoveDialog);
  }

  useEffect(() => {
    setController(
      <ControlButtons
        enableRemove={enableRemove}
        cancelRemove={cancelRemove}
        handleRemove={handleRemove}
        handleInvite={() => setShowInviteDialog(true)}
      />
    );
  }, [handleRemove]);

  return (
    <>
      <div className="p-6 h-full overflow-y-auto">
        <div className="w-[720px] bg-white mx-auto drop-shadow-md min-h-full rounded-xl p-8">
          <div>
            <h1 className="text-xl">Teacher</h1>
            <hr className="border-gray-300 my-5"></hr>
            <div className="flex flex-col gap-3">
              {currentClass?.teachers?.map((teacher) => (
                <div
                  className="flex justify-between items-center"
                  key={teacher._id}
                >
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" src="/default-user-image.png" />
                    <div className="flex flex-col">
                      <h6 className="text-sm">{teacher.full_name}</h6>
                      <small className="text-xs text-gray-600">
                        {teacher.email}
                      </small>
                    </div>
                  </div>
                  {removing && (
                    <Checkbox
                      className="p-1 -m-1"
                      color="indigo"
                      onClick={() => handleRemoveCheckbox(teacher._id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12">
            <h1 className="text-xl">Student</h1>
            <hr className="border-gray-300 my-5"></hr>
            <div className="flex flex-col gap-3">
              {currentClass?.students?.map((student) => (
                <div
                  className="flex justify-between items-center"
                  key={student._id}
                >
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" src="/default-user-image.png" />
                    <div className="flex flex-col">
                      <h6 className="text-sm">{student.full_name}</h6>
                      <small className="text-xs text-gray-600">
                        {student.email}
                      </small>
                    </div>
                  </div>
                  {removing && (
                    <Checkbox
                      className="p-1 -m-1"
                      color="indigo"
                      onClick={() => handleRemoveCheckbox(student._id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={showRemoveDialog}
        size="xs"
        handler={handleRemoveDialog}
        dismiss={{ enabled: !processing }}
        className="p-3"
      >
        <DialogHeader>Confirm removing</DialogHeader>
        <DialogBody>
          Do you really want to remove{" "}
          {removeList.length > 1 ? "these users" : "this user"} from the class?
        </DialogBody>
        <DialogFooter>
          <Button
            size="sm"
            variant="text"
            color="red"
            onClick={handleRemoveDialog}
            className="mr-2 normal-case"
            disabled={processing}
          >
            <span>Cancel</span>
          </Button>
          <Button
            className="normal-case"
            size="sm"
            variant="gradient"
            color="blue"
            onClick={handleRemoveDialog}
            disabled={processing}
          >
            <span>Remove</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <InvitationDialog
        open={showInviteDialog}
        handleOpen={() => setShowInviteDialog(false)}
      ></InvitationDialog>
    </>
  );
}

export default ClassMember;
