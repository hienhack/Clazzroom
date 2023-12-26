import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineUploadFile, MdDownload, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import PopoverMenu from "../../component/common/PopoverMenu";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useOutletContext } from "react-router-dom";
import { ClassContext } from "../../context/ClassContext";
import { ErrorMessage } from "@hookform/error-message";
import InputFileButton from "../../component/common/InputFileButton";
import axios from "axios";
import { readXlsx, createXlsx } from "../../utils/XLSXHelper";
import { saveAs } from "file-saver";

const testAccount = [
  {
    _id: "1",
    full_name: "A Nguyen",
    email: "hahaha@gmail.com",
    student_id: "20120001",
    image: "",
  },
  {
    _id: "2",
    full_name: "Hien Thai",
    email: "hienthai@gmail.com",
    student_id: "20120002",
    image: "",
  },
  {
    _id: "4",
    full_name: "Khanh Le",
    email: "nguyenkhan@gmail.com",
    student_id: "20120004",
    image:
      "https://afamilycdn.com/150157425591193600/2023/7/10/3581026861353491429191131976811112986346003n-168896101713887268472.jpg",
  },
];

const testStudentList = [
  {
    _id: "1fdd",
    student_id: "20120011",
    grades: [
      { _id: 1, name: "Addtition", value: null },
      { _id: 3, name: "Assigment 2", value: 8 },
      { _id: 5, name: "Midterm", value: 7 },
      { _id: 6, name: "Final", value: 8 },
    ],
    full_name: "Nguyen Van A",
  },
  {
    _id: "2",
    student_id: "20120002",
    grades: [
      { _id: 1, name: "Addtition", value: 10 },
      { _id: 3, name: "Assigment 2", value: 10 },
      { _id: 5, name: "Midterm", value: 8.5 },
      { _id: 6, name: "Final", value: 10 },
    ],
    full_name: "Thai Ngoc Vinh Hien",
  },
  {
    _id: "3",
    student_id: "20120003",
    grades: [
      { _id: 1, name: "Addtition", value: 9 },
      { _id: 3, name: "Assigment 2", value: 9 },
      { _id: 5, name: "Midterm", value: 6.5 },
      { _id: 6, name: "Final", value: 8 },
    ],
    full_name: "Tran Van B",
  },
  {
    _id: "4",
    student_id: "20120004",
    grades: [
      { _id: 1, name: "Addtition", value: -1 },
      { _id: 3, name: "Assigment 2", value: 7 },
      { _id: 5, name: "Midterm", value: 6 },
      { _id: 6, name: "Final", value: 9.5 },
    ],
    full_name: "Le Thi Kieu Khanh",
  },
  {
    _id: "5",
    student_id: "20120005",
    grades: [
      { _id: 1, name: "Addtition", value: 5 },
      { _id: 3, name: "Assigment 2", value: 10 },
      { _id: 5, name: "Midterm", value: 6 },
      { _id: 6, name: "Final", value: 10 },
    ],
    full_name: "No Name Man",
  },
];

function getTotal(compositions, grades) {
  let result = 0;
  compositions.forEach((c, index) => {
    if (!isNaN(grades[index].value)) {
      result = result + (c.scale / 100) * grades[index].value;
    }
  });

  return result.toFixed(2);
}

function Total({ control, compositions }) {
  const grades = useWatch({ control: control, name: "grades" });
  const total = getTotal(compositions, grades);
  return <h6 className="text-center">{isNaN(total) ? "" : total}</h6>;
}

function EditStudent({
  index,
  student,
  compositions,
  handleSuccess,
  handleCancel,
}) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      student_id: student.student_id,
      full_name: student.full_name,
      grades: student.grades.map((g) => ({ value: g.value })),
    },
  });
  const { fields, remove } = useFieldArray({
    control,
    name: "grades",
  });

  function handleSave() {
    setSaving(true);
    if (isValid) {
      const data = getValues();
      student.student_id = data.student_id;
      student.full_name = data.full_name;
      student.grades.forEach((g, index) => {
        if (isNaN(data.grades[index].value)) {
          g.value = null;
        } else {
          g.value = data.grades[index].value;
        }
      });

      // Call api here
      // Error: toast.error(error.response.data.message);
      setTimeout(() => {
        setSaving(false);
        handleSuccess(index, student);
      }, 2000);
    } else {
      setSaving(false);
      for (let field in errors) {
        toast.error(errors[field].message);
      }
    }
  }

  return (
    <tr
      key={index}
      className="h-[50px] border-t border-gray-300 font-light bg-light-blue-50"
    >
      <td className="px-1 text-center">{index + 1}</td>
      <td className="px-1">
        <input
          className="outline-none h-[46px] w-[5.5rem] bg-inherit"
          {...register("student_id", {
            required: { value: true, message: "Student id is required" },
          })}
        ></input>
      </td>
      <td className="px-1">
        <input
          className="outline-none h-[46px] w-[10.5rem] bg-inherit"
          {...register("full_name", {
            required: { value: true, message: "Full name is required" },
          })}
        ></input>
      </td>
      <td className="px-1">
        {student.account && (
          <div className="flex items-center gap-2">
            <img
              src={
                student.account.image != ""
                  ? student.account.image
                  : "/default-user-image.png"
              }
              className="w-8 h-8 rounded-full object-cover object-center"
            />

            <div className="flex gap-0 flex-col">
              <small className="text-xs font-normal">
                {student.account.full_name}
              </small>
              <small className="text-[0.7rem] font-light leading-3">
                {student.account.email}
              </small>
            </div>
          </div>
        )}
      </td>
      {fields.map((f, i) => (
        <td key={i} className="px-1">
          <input
            type="number"
            {...register(`grades.${i}.value`, {
              valueAsNumber: true,
              validate: (value) => {
                if (!isNaN(value) && value < 0) {
                  return "Invalid value";
                }
              },
            })}
            className="h-[46px] w-[calc(8rem-6px)] pl-[15px] text-center bg-inherit outline-none"
          ></input>
        </td>
      ))}

      <td className="px-1">
        <Total control={control} compositions={compositions} />
      </td>
      <td className="px-1">
        <div className="flex justify-center items-center gap-1">
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Cancel"
          >
            <button
              className="hover:fill-blue-gray-900 fill-blue-gray-600"
              variant="text"
              onClick={() => handleCancel(index)}
              disabled={saving}
            >
              <MdClose size="1.25rem" className="fill-inherit" />
            </button>
          </Tooltip>
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Save"
          >
            <button
              className="hover:text-blue-gray-900 text-blue-gray-600"
              onClick={handleSave}
              disabled={saving}
            >
              <IoCheckmarkSharp size="1.3rem" className="text-inherit" />
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
}

function UploadGrades({ open, handleOpen, uploadHandler, studentList }) {
  const { currentClass } = useContext(ClassContext);
  const fileRef = useRef(null);
  const message = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  function upload(data) {
    message.current = toast.loading("Uploading");
    let grades = [];

    const resolver = (loaded) => {
      // call api here
      // Result is a new studentList => setStudentList
      console.log(loaded);
      console.log("");
      setTimeout(() => {
        toast.loading(message.current, {
          render: "Saved",
          isLoading: false,
          type: "success",
          autoClose: "true",
        });
      }, 2000);
    };
    const onFinish = (e) => {
      toast.update(message.current, { render: "Saving", isLoading: true });
    };
    const onError = (e) => {
      console.log("Go over here");
      toast.update(message.current, {
        render: e.message,
        isLoading: false,
        type: "error",
        autoClose: true,
      });
    };

    readXlsx(
      fileRef.current,
      (loaded) => {
        grades = loaded;
        console.log(grades);
      },
      onFinish,
      onError
    );
  }

  function handleCancel() {
    reset();
    handleOpen();
  }

  return (
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <form onSubmit={handleSubmit(upload)}>
        <Card className="mx-auto p-2 w-full">
          <CardBody className="flex flex-col gap-4">
            <Typography className="mb-3" variant="h4" color="blue-gray">
              Upload grades
            </Typography>
            <div className="flex flex-col gap-6">
              <div>
                <Select
                  onChange={(selected) => {
                    setValue("composition", selected, { shouldValidate: true });
                  }}
                  label="Select grade composition"
                >
                  {currentClass &&
                    currentClass.grade_compositions.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                </Select>
                <input
                  {...register("composition", {
                    required: {
                      value: true,
                      message: "No grade composition selected",
                    },
                  })}
                  className="hidden"
                ></input>
                <ErrorMessage
                  errors={errors}
                  name="composition"
                  render={({ message }) => (
                    <small className="text-red-600 italic mb-5">
                      {message}
                    </small>
                  )}
                />
              </div>
              <div>
                <div className="relative flex w-full">
                  <Input
                    {...register("file_name", {
                      required: {
                        value: true,
                        message: "File is required",
                      },
                    })}
                    label="File name"
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                    readOnly
                  />
                  <InputFileButton
                    onChange={(file) => {
                      fileRef.current = file;
                      setValue("file_name", file.name, {
                        shouldValidate: true,
                      });
                    }}
                  ></InputFileButton>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="file_name"
                  render={({ message }) => (
                    <small className="text-red-600 italic mb-5">
                      {message}
                    </small>
                  )}
                />
              </div>
              <p className="text-xs font-light">
                <b className="font-medium">Notice:</b> Previous grades will be
                lost or replaced when new grades are uploaded.
              </p>
            </div>
          </CardBody>
          <CardFooter className="pt-0 mt-2">
            <div className="flex justify-end items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="text"
                color="red"
                onClick={handleCancel}
                className="normal-case rounded-md"
              >
                <span>Cancel</span>
              </Button>
              <Button
                type="submit"
                className="normal-case rounded-md"
                size="sm"
                variant="gradient"
                color="blue"
              >
                Upload
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Dialog>
  );
}

function ClassGradeManagement() {
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const { mappedAccount, setMappedAccount, studentList, setStudentList } =
    useOutletContext();
  const [uploadGrade, setUploadgrade] = useState(false);
  const [displayComposition, setDisplayComposition] = useState(
    currentClass && Array(currentClass.grade_compositions.length).fill(true)
  );
  const [editing, setEditing] = useState(
    studentList && Array(studentList.length).fill(false)
  );

  useMemo(() => {
    if (studentList == null || mappedAccount == null) {
      return;
    }
    studentList.map((s) => {
      s.account = mappedAccount.find((a) => a.student_id == s.student_id);
      return s;
    });
  }, [studentList]);

  function onEditBtnClick(index) {
    const newEditing = editing.slice();
    newEditing[index] = true;
    setEditing(newEditing);
  }

  function handleSuccess(index, updated) {
    toast.success(`Student #${index + 1} saved successfully`);

    const newEditing = editing.slice();
    newEditing[index] = false;
    setEditing(newEditing);

    const newStudentList = studentList.slice();
    newStudentList[index] = updated;
    setStudentList(newStudentList);
  }

  function handleCancel(index) {
    const newEditing = editing.slice();
    newEditing[index] = false;
    setEditing(newEditing);
  }

  function setCompositionState(index, state) {
    if (currentClass.grade_compositions[index].state === state) return;
    const { ...newClass } = currentClass;
    newClass.grade_compositions[index].state = state;
    setCurrentClass(newClass);
  }

  function downloadGradeTemplate() {
    const data = [["Student id", "Grade"]];
    const newStudentList = studentList.slice();
    newStudentList.sort((a, b) => (a.student_id < b.student_id ? -1 : 1));
    newStudentList.forEach((s) => {
      data.push([s.student_id]);
    });
    const file = createXlsx(data);
    saveAs(file, "Grade template.xlsx");
  }

  useEffect(() => {
    if (studentList == null) {
      // For testing only
      setStudentList(testStudentList);
      setEditing(new Array(testStudentList.length).fill(false));
    }

    if (mappedAccount == null) {
      // Fortesting only
      setMappedAccount(testAccount);
    }
  }, []);

  return (
    <>
      <div className="min-h-full p-6">
        <div className="h-full w-fit max-w-full bg-white mx-auto rounded-lg drop-shadow-md">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold">Grade board</h6>
              </div>
              <div className="flex items-center flex-row-reverse gap-2">
                <PopoverMenu
                  menuItems={[
                    { title: "Grade template", onClick: downloadGradeTemplate },
                    { title: "Grade board", onClick: () => {} },
                    { title: "Student list", onClick: () => {} },
                  ]}
                >
                  <button className="fill-blue-gray-400 hover:fill-blue-gray-700">
                    <MdDownload size="1.4rem" className="fill-inherit" />
                  </button>
                </PopoverMenu>
                <PopoverMenu
                  menuItems={[
                    {
                      title: "Grades for a composition",
                      onClick: () => {
                        setUploadgrade(true);
                      },
                    },
                    { title: "Student list", onClick: () => {} },
                  ]}
                >
                  <button className="fill-blue-gray-400 hover:fill-blue-gray-700">
                    <MdOutlineUploadFile
                      size="1.4rem"
                      className="fill-inherit"
                    />
                  </button>
                </PopoverMenu>
              </div>
            </div>
          </div>
          <hr className="border-gray-300" />
          <div className="max-w-full overflow-x-auto">
            <table className="text-sm table-fixed">
              <thead>
                <tr className="bg-indigo-800 text-gray-50">
                  <th className="px-1 font-medium min-w-[3.5rem] text-center">
                    #
                  </th>
                  <th className="px-1 font-medium min-w-[6rem] text-left">
                    Student ID
                  </th>
                  <th className="px-1 font-medium min-w-[11rem] text-left">
                    Full name
                  </th>
                  <th className="px-1 font-medium min-w-[11rem] text-left">
                    Account
                  </th>
                  {currentClass?.grade_compositions.map((c, index) => (
                    <th key={c._id} className="font-medium min-w-[8rem]">
                      <div className="w-[8rem] px-2 py-2">
                        <h6 className="truncate">{c.name}</h6>
                        <h6 className="text-xs truncate">{c.scale}%</h6>
                        <div className="flex items-center gap-1 w-[7.5rem] justify-center">
                          <label className="text-[11px] font-light">
                            State:
                          </label>
                          <PopoverMenu
                            menuItems={[
                              {
                                title: "In-progress",
                                onClick: () =>
                                  setCompositionState(index, "In-progress"),
                              },
                              {
                                title: "Finalized",
                                onClick: () =>
                                  setCompositionState(index, "Finalized"),
                              },
                            ]}
                          >
                            <button className="flex gap-2">
                              <span className="text-xs font-normal">
                                {c.state}
                              </span>
                              <div>
                                <IoMdArrowDropup className="-m-1" />
                                <IoMdArrowDropdown className="-m-1" />
                              </div>
                            </button>
                          </PopoverMenu>
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="px-1 font-medium min-w-[7rem]">Total</th>
                  <th className="px-1 font-medium min-w-[7rem]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentList?.map((s, index) =>
                  !editing[index] ? (
                    <tr
                      key={index}
                      className="h-[50px] border-t border-gray-300 font-light"
                    >
                      <td className="px-1 text-center">{index + 1}</td>
                      <td className="px-1">{s.student_id}</td>
                      <td className="px-1">{s.full_name}</td>
                      <td className="px-1">
                        {s.account && (
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                s.account.image != ""
                                  ? s.account.image
                                  : "/default-user-image.png"
                              }
                              className="w-8 h-8 rounded-full object-cover object-center"
                            />

                            <div className="flex gap-0 flex-col">
                              <small className="text-xs font-normal">
                                {s.account.full_name}
                              </small>
                              <small className="text-[0.7rem] font-light leading-3">
                                {s.account.email}
                              </small>
                            </div>
                          </div>
                        )}
                      </td>
                      {s.grades.map((g) => (
                        <td key={g._id} className="px-1 text-center">
                          {g.value}
                        </td>
                      ))}

                      <td className="px-1">
                        <h6 className="text-center">
                          {currentClass &&
                            getTotal(currentClass.grade_compositions, s.grades)}
                        </h6>
                      </td>
                      <td className="px-1">
                        <div className="flex justify-center items-center gap-1">
                          <Tooltip
                            className="bg-gray-700 text-xs py-1"
                            placement="bottom"
                            content="Edit"
                          >
                            <button
                              className="fill-blue-gray-600 hover:fill-blue-gray-900"
                              onClick={(e) => onEditBtnClick(index)}
                            >
                              <FaRegEdit
                                size="1.15rem"
                                className="fill-inherit"
                              />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <EditStudent
                      key={index}
                      index={index}
                      student={s}
                      compositions={currentClass.grade_compositions}
                      handleSuccess={handleSuccess}
                      handleCancel={handleCancel}
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UploadGrades
        open={uploadGrade}
        handleOpen={() => setUploadgrade(false)}
      ></UploadGrades>
    </>
  );
}

export default ClassGradeManagement;
