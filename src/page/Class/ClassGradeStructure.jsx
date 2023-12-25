import { Button, Tooltip } from "@material-tailwind/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { RiDraggable } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const testList = [
  { name: "Assignments", scale: 10 },
  { name: "Midtern", scale: 20 },
  { name: "Project", scale: 30 },
];

function getMessage(messageObj) {
  let result = "";
  for (let field in messageObj) {
    result = result + messageObj[field].message + "! ";
  }
  return result;
}

function ClassGradeStructure() {
  const { setController } = useOutletContext();
  const [editing, setEditing] = useState(false);
  const draggedItem = useRef();
  const {
    register,
    control,
    getValues,
    trigger,
    reset,
    formState: { errors, isValid, isValidating },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      composition: testList.slice(),
    },
  });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "composition",
  });

  function onDragStart(event, index) {
    draggedItem.current = index;
    event.dataTransfer.setDragImage(
      event.target.parentNode.parentNode.parentNode,
      20,
      20
    );
  }

  function onDragOver(event, index) {
    event.preventDefault();
    if (draggedItem.current == index) return;

    move(draggedItem.current, index);
    draggedItem.current = index;
  }

  function handleAdd() {
    append({ name: "", scale: 0 });
  }

  const handleSave = useCallback(
    (onSuccess, onFailed) => {
      trigger(null, { shouldFocus: true });
      if (isValid) {
        setEditing(false);
        setTimeout(() => {
          onSuccess();
          toast.success("Saved");
        }, 3000);
      } else {
        onFailed();
      }
    },
    [isValid, getValues]
  );

  const handleCancel = useCallback(() => {
    setEditing(false);
    reset({ composition: testList.slice() });
  }, []);

  useEffect(() => {
    setController(
      <ControlButton
        handleSave={handleSave}
        handleCancel={handleCancel}
        enableEditing={() => setEditing(true)}
      />
    );
    return () => setController(null);
  }, [handleSave]);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="w-[600px] min-h-full bg-white mx-auto drop-shadow-md rounded-lg">
        <div className="grid grid-cols-10 bg-indigo-800 text-white rounded-t-lg font-medium">
          <div className="py-4">
            <h6 className="text-sm text-center leading-6">#</h6>
          </div>
          <div className="col-span-6 py-4">
            <span className="text-sm">Composition name</span>
          </div>
          <div className="col-span-2 py-4">
            <span className="text-sm">Scale</span>
          </div>
        </div>
        <hr className="border-gray-300" />
        <form>
          <div className="flex flex-col">
            {fields.map((c, index) => (
              <div key={index} onDragOver={(e) => onDragOver(e, index)}>
                <div className="grid grid-cols-10">
                  <div className="flex items-center h-16">
                    {editing && (
                      <div
                        className="w-7 h-full -mr-7 z-10 flex items-center justify-center hover:cursor-move"
                        onDragStart={(e) => onDragStart(e, index)}
                        draggable
                      >
                        <RiDraggable
                          size="1.2rem"
                          className="fill-blue-gray-600"
                        />
                      </div>
                    )}
                    <h6 className="text-center w-full text-sm font-medium">
                      {index + 1}
                    </h6>
                  </div>
                  <div className="col-span-6">
                    <input
                      {...register(`composition.${index}.name`, {
                        required: {
                          value: true,
                          message: "Name is required",
                        },
                      })}
                      className="w-full h-full outline-none text-sm font-medium"
                      placeholder="Name"
                      readOnly={!editing}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      {...register(`composition.${index}.scale`, {
                        valueAsNumber: true,
                        validate: (value) => {
                          if (isNaN(value)) return "Scale must be a number";
                          else if (value <= 0)
                            return "Scale must be greater than 0";
                        },
                      })}
                      type="number"
                      className="h-full w-10/12 outline-none text-sm font-medium"
                      placeholder="Scale"
                      readOnly={!editing}
                    />
                  </div>
                  <div className="flex items-center">
                    {editing && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="block p-3 -ml-1 rounded-full hover:bg-gray-200 fill-red-300 hover:fill-red-600"
                      >
                        <FaRegTrashCan size="1.1rem" className="fill-inherit" />
                      </button>
                    )}
                  </div>
                  {errors?.composition != null && errors.composition[index] && (
                    <small className="text-red-600 italic mb-3 col-start-2 col-span-11">
                      {getMessage(errors.composition[index])}
                    </small>
                  )}
                </div>
                <hr className="border-gray-300" />
              </div>
            ))}
          </div>
        </form>
        <div className="p-1 flex justify-center">
          {editing && (
            <button
              className="p-3 rounded-full hover:bg-blue-gray-50 fill-blue-gray-600 hover:fill-blue-gray-900"
              onClick={handleAdd}
            >
              <AiOutlinePlus size="1.3rem" className="w-5 h-5 fill-inherit" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ControlButton({ enableEditing, handleSave, handleCancel }) {
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  function onSave() {
    setSaving(true);
    handleSave(
      () => {
        setSaving(false);
        setEditing(false);
      },
      () => {
        setSaving(false);
      }
    );
  }

  return (
    <div className="flex items-center flex-row-reverse gap-3">
      {!editing && (
        <Tooltip
          className="bg-gray-700 text-xs py-1"
          placement="bottom"
          content="Edit class information"
        >
          <button
            className="fill-blue-gray-300 hover:fill-blue-gray-600"
            onClick={() => {
              setEditing(true);
              enableEditing();
            }}
          >
            <FaRegEdit size="1.3rem" className="fill-inherit" />
          </button>
        </Tooltip>
      )}
      {editing && (
        <>
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Save"
          >
            <Button
              onClick={onSave}
              disabled={saving}
              className="p-0 hover:bg-transparent hover:text-blue-gray-700 text-blue-gray-400"
              variant="text"
            >
              <IoCheckmarkSharp size="1.4rem" className="text-inherit" />
            </Button>
          </Tooltip>
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Cancel"
          >
            <Button
              onClick={() => {
                handleCancel();
                setEditing(false);
              }}
              disabled={saving}
              className="p-0 hover:bg-transparent hover:fill-blue-gray-700 fill-blue-gray-400"
              variant="text"
            >
              <MdClose size="1.3rem" className="fill-inherit" />
            </Button>
          </Tooltip>
        </>
      )}
    </div>
  );
}

export default ClassGradeStructure;
