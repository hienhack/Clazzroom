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
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { set, useFieldArray, useForm, useWatch } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineUploadFile, MdDownload, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import PopoverMenu from "../../component/common/PopoverMenu";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useOutletContext, useParams } from "react-router-dom";
import { ClassContext } from "../../context/ClassContext";
import { ErrorMessage } from "@hookform/error-message";
import InputFileButton from "../../component/common/InputFileButton";
import axios from "axios";
import { readXlsx, createXlsx } from "../../utils/XLSXHelper";
import { saveAs } from "file-saver";

function getTotal(compositions, grades) {
  let result = 0;
  compositions.forEach((c) => {
    const found = grades.find((g) => g.grade_composition_id == c._id);
    if (found) {
      if (!isNaN(found.value)) {
        result = result + (c.scale / 100) * found.value;
      }
    }
  });

  return result.toFixed(2);
}

function Total({ control, compositions }) {
  const grades = useWatch({ control: control, name: "grades" });
  console.log(grades);
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
  const { classId } = useParams();
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
      grades: student.grades,
    },
  });
  const { fields, remove } = useFieldArray({
    control,
    name: "grades",
  });

  function handleSave() {
    setSaving(true);
    if (isValid) {
      const message = toast.loading("Saving");
      const data = getValues();
      data.grades.forEach((g) => {
        if (isNaN(g.value)) {
          g.value = null;
        }
      });

      axios
        .put(`/classes/${classId}/student-list/${student._id}`, data)
        .then((res) => {
          handleSuccess(index, res.data.data);
          toast.update(message, {
            type: "success",
            render: "Saved successfully",
            isLoading: false,
            autoClose: true,
          });
          setSaving(false);
        })
        .catch((error) => {
          if (error.reponse.data.statusCode == 400) {
            toast.update(message, {
              type: "error",
              render: error.response.data.message,
              isLoading: false,
              autoClose: true,
            });
          } else {
            alert("Something went wrong, please try again");
          }
        })
        .finally(() => setSaving(false));
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
              src={student.account.image || "/default-user-image.png"}
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

function ClassGradeManagement() {
  const { currentClass, setCurrentClass } = useContext(ClassContext);
  const { classId } = useParams();
  const messageRef = useRef();
  const {
    mappedAccount,
    setMappedAccount,
    studentList,
    setStudentList,
    gradeCompositions,
    setGradeCompositions,
  } = useOutletContext();
  const [uploadGrade, setUploadgrade] = useState(false);
  const inputFileRef = useRef(null);
  // const message = useRef(null);
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
  }, [studentList, mappedAccount]);

  function onEditBtnClick(index) {
    const newEditing = editing.slice();
    newEditing[index] = true;
    setEditing(newEditing);
  }

  function handleSuccess(index, updated) {
    const newEditing = editing.slice();
    newEditing[index] = false;
    setEditing(newEditing);

    const newStudentList = studentList.slice();
    newStudentList[index] = updated;
    setStudentList(newStudentList);
    loadMappedAccount();
  }

  function handleCancel(index) {
    const newEditing = editing.slice();
    newEditing[index] = false;
    setEditing(newEditing);
  }

  function setCompositionState(index, state) {
    const newGradeCompositions = gradeCompositions.slice();
    newGradeCompositions[index].state = state;
    setGradeCompositions(newGradeCompositions);
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

  function downloadGradeBoard() {
    const data = [
      [
        "Student ID",
        "Full name",
        "Account",
        ...gradeCompositions.map((c) => `${c.name} (${c.scale}%)`),
      ],
    ];
    studentList.forEach((s) => {
      data.push([
        s.student_id,
        s.full_name,
        s.account?.full_name,
        ...s.grades.map((g) => g.value),
      ]);
    });
    const file = createXlsx(data);
    saveAs(file, "Grade board.xlsx");
  }

  function downloadStudentList() {
    const data = [["Student ID", "Full name"]];
    studentList.forEach((s) => {
      data.push([s.student_id, s.full_name]);
    });
    const file = createXlsx(data);
    saveAs(file, "Student list.xlsx");
  }

  function handleUploadStudentList(e) {
    if (e.target.files == null) return;
    messageRef.current = toast.loading("Uploading");
    const resolver = function (loaded) {
      let data = [];
      try {
        data = loaded.map((r) => {
          if (r.length != 2 || !r[0] || !r[1])
            throw new Error("Invalid file format");
          return { student_id: r[0], full_name: r[1] };
        });
      } catch (error) {
        toast.update(messageRef.current, {
          type: "error",
          render: error.message,
          isLoading: false,
          autoClose: true,
        });
        return;
      }

      data.shift();
      axios
        .post(`/classes/${classId}/student-list`, data)
        .then((res) => {
          loadStudentList();
          loadMappedAccount();
          toast.update(messageRef.current, {
            render: "Uploaded successfully",
            isLoading: false,
            type: "success",
            autoClose: "true",
          });
        })
        .catch((error) => {
          console.log(error);
          toast.update(messageRef.current, {
            render: error.reponse.data.message,
            isLoading: false,
            type: "error",
            autoClose: "true",
          });
        });
    };
    const onFinish = (e) => {
      console.log("Finished");
    };
    const onError = (e) => {
      toast.update(messageRef.current, {
        render: e.message,
        isLoading: false,
        type: "error",
        autoClose: true,
      });
    };

    readXlsx(e.target.files[0], resolver, onFinish, onError);
  }

  function setFinalized(index, id) {
    if (gradeCompositions[index].state === "Finalized") return;
    axios
      .patch(`/classes/${classId}/grade-compositions/${id}/finalized`)
      .then(() => {
        setCompositionState(index, "Finalized");
        toast.success(gradeCompositions[index].name + " state updated");
      })
      .catch((error) => alert("Something went wrong, please reload the page!"));
  }

  function setInProgress(index, id) {
    if (gradeCompositions[index].state === "In-progress") return;
    axios
      .put(`/classes/${classId}/grades`, [
        { ...gradeCompositions[index], state: "In-progress" },
      ])
      .then((res) => {
        toast.success(gradeCompositions[index].name + " state updated");
        setCompositionState(index, "In-progress");
      })
      .catch((error) => alert("Something when wrong, please reload the page"));
  }

  const loadMappedAccount = useCallback(() => {
    axios
      .get(`/classes/${classId}/student-list/mapped-account`)
      .then((res) => {
        setMappedAccount(res.data.data);
      })
      .catch((error) => {});
  }, []);

  const loadStudentList = useCallback(() => {
    axios
      .get(`/classes/${classId}/student-list`)
      .then((res) => {
        setStudentList(res.data.data);
        setEditing(new Array(res.data.data.length).fill(false));
      })
      .catch((error) => {});
  });

  useEffect(() => {
    loadStudentList();
  }, []);

  useEffect(() => {
    loadMappedAccount();
  }, []);

  return (
    <>
      <div className="h-full p-6 over">
        <div className="min-h-full w-fit max-w-full bg-white mx-auto rounded-lg drop-shadow-lg flex flex-col">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold">Grade board</h6>
              </div>
              <div className="flex items-center flex-row-reverse gap-2">
                <PopoverMenu
                  menuItems={[
                    { title: "Grade template", onClick: downloadGradeTemplate },
                    { title: "Grade board", onClick: downloadGradeBoard },
                    { title: "Student list", onClick: downloadStudentList },
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
                    {
                      title: "Student list",
                      onClick: () => inputFileRef.current.click(),
                    },
                  ]}
                >
                  <button className="fill-blue-gray-400 hover:fill-blue-gray-700">
                    <MdOutlineUploadFile
                      size="1.4rem"
                      className="fill-inherit"
                    />
                  </button>
                </PopoverMenu>
                <input
                  className="hidden"
                  onChange={(e) => handleUploadStudentList(e)}
                  ref={inputFileRef}
                  type="file"
                  accept=".xlsx"
                ></input>
              </div>
            </div>
          </div>
          <hr className="border-gray-300" />
          <div className="max-w-ful min-h-full overflow-x-auto grow">
            <table className="text-sm table-fixed">
              <thead>
                <tr className="bg-indigo-800 text-gray-50 h-[50px]">
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
                  {gradeCompositions?.map((c, index) => (
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
                                onClick: () => setInProgress(index, c._id),
                              },
                              {
                                title: "Finalized",
                                onClick: () => setFinalized(index, c._id),
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
                              src={s.account.image || "/default-user-image.png"}
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
                            getTotal(gradeCompositions, s.grades)}
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
                      compositions={gradeCompositions}
                      handleSuccess={handleSuccess}
                      handleCancel={handleCancel}
                    />
                  )
                )}
              </tbody>
            </table>
            {studentList?.length == 0 && (
              <div className="mt-16 flex flex-col items-center justify-center">
                <img src="/empty.png" className="w-[150px]"></img>
                <h6 className="text-center font-bold mt-8 text-blue-gray-700">
                  Student list is empty
                </h6>
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadGrades
        open={uploadGrade}
        handleOpen={() => setUploadgrade(false)}
        compositions={gradeCompositions}
        onSuccess={loadStudentList}
      ></UploadGrades>
    </>
  );
}

function UploadGrades({ open, handleOpen, compositions, onSuccess }) {
  const { currentClass } = useContext(ClassContext);
  const [processing, setProcessing] = useState(false);
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
    setProcessing(true);
    let grades = [];

    const resolver = (loaded) => {
      loaded.shift();
      try {
        grades = loaded.map((r) => {
          if (r.length != 2 || !r[0] || !r[1] || isNaN(r[1]))
            throw new Error("Invalid file format");
          return { student_id: r[0], value: r[1] };
        });
      } catch (error) {
        toast.update(message.current, {
          type: "error",
          render: error.message,
          isLoading: false,
          autoClose: true,
        });
        setProcessing(false);
        return;
      }

      axios
        .put(`/classes/${currentClass._id}/grades/upload`, {
          grade_composition_id: data.composition,
          data: grades,
        })
        .then((res) => {
          toast.update(message.current, {
            render: "Uploaded successfully",
            isLoading: false,
            type: "success",
            autoClose: "true",
          });
          handleOpen();
          onSuccess();
        })
        .catch((error) => {
          toast.update(message.current, {
            render: error.reponse.data.message,
            isLoading: false,
            type: "error",
            autoClose: "true",
          });
        })
        .finally(() => setProcessing(false));
    };

    const onFinish = () => {};

    const onError = (e) => {
      toast.update(message.current, {
        render: e.message,
        isLoading: false,
        type: "error",
        autoClose: true,
      });
    };

    readXlsx(fileRef.current, resolver, onFinish, onError);
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
      dismiss={{ enabled: false }}
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
                  {compositions?.map((c) => (
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
                disabled={processing}
              >
                <span>Cancel</span>
              </Button>
              <Button
                type="submit"
                className="normal-case rounded-md"
                size="sm"
                variant="gradient"
                color="blue"
                disabled={processing}
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

export default ClassGradeManagement;
