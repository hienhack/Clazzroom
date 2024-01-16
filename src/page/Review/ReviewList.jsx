import {
  Button,
  Checkbox,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { ClassContext } from "../../context/ClassContext";
import { Link, useOutletContext } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { getDateFormated } from "../../utils/DateHelper";
import { set } from "react-hook-form";

const SortLabel = {
  asc: "Ascending updated date",
  des: "Descending updated date",
};

function SelectSort({ handleSelect, defaultValue }) {
  const [focus, setFocus] = useState(false);
  const [currentMode, setCurrentMode] = useState(defaultValue);

  function onSelect(value) {
    setFocus(false);
    setCurrentMode(value);
    handleSelect(value);
  }

  return (
    <>
      <Menu open={focus} handler={() => setFocus(false)}>
        <MenuHandler>
          <button className="w-full p-2 outline outline-1 z-0 text-sm rounded-md invisible">
            ignore
          </button>
        </MenuHandler>
        <MenuList>
          <MenuItem onClick={() => onSelect("asc")}>
            Ascending updated date
          </MenuItem>
          <MenuItem onClick={() => onSelect("des")}>
            Descending updated date
          </MenuItem>
        </MenuList>
      </Menu>
      <button
        onClick={() => setFocus(true)}
        type="button"
        className={`p-2 ps-3 z-10 -mt-9 outline rounded-md flex items-center gap-2 w-full text-blue-gray-700 ${
          focus ? "outline-2 outline-black" : "outline-1 outline-blue-gray-200"
        }`}
      >
        <h6 className="text-sm w-11/12 text-left truncate">
          {SortLabel[currentMode]}
        </h6>
        <IoIosArrowDown
          className={`transition-all ${focus ? "rotate-180" : ""}`}
        />
      </button>
    </>
  );
}

function reducer(state, action) {
  const { ...updated } = state;
  switch (action.type) {
    case "set_status": {
      updated.status = action.status;
      break;
    }
    case "set_sort": {
      updated.sort = action.mode;
      break;
    }
    case "set_display_class": {
      updated.ignoreClass = state.ignoreClass.slice();
      const index = updated.ignoreClass.findIndex((id) => id == action.classId);
      if (index != -1) {
        updated.ignoreClass.splice(index, 1);
      } else {
        updated.ignoreClass.push(action.classId);
      }
      break;
    }
  }
  localStorage.setItem("filter", JSON.stringify(updated));
  return updated;
}

function initFilter() {
  let filterSaved = localStorage.getItem("filter");
  let defaultFilter = {
    status: "Pending",
    sort: "asc",
    ignoreClass: [],
  };

  return filterSaved ? JSON.parse(filterSaved) : defaultFilter;
}

function getQuery(filter, classList) {
  if (classList == null) return;
  let result = "";
  classList.forEach((c) => {
    if (!filter.ignoreClass.includes(c._id)) {
      result = result + "class_id=" + c._id + "&";
    }
  });
  result = result + "state=" + filter.status + "&";
  result = result + "sort=" + filter.sort + "_last_updated";
  return result;
}

function ReviewList() {
  const [filter, dispatch] = useReducer(reducer, null, initFilter);
  const { reviewList, setReviewList, setCurrentReview } = useOutletContext();
  const { classList } = useContext(ClassContext);
  const [loading, setLoading] = useState(true);
  const queryRef = useRef(null);

  function setStatus(status) {
    dispatch({ type: "set_status", status: status });
  }

  function setSort(mode) {
    dispatch({ type: "set_sort", mode: mode });
  }

  function setClass(id) {
    dispatch({ type: "set_display_class", classId: id });
  }

  useEffect(() => {
    if (filter.ignoreClass.length == classList.length) {
      setReviewList([]);
      return;
    }
    setLoading(true);
    axios
      .get("/reviews", {
        params: filter,
        paramsSerializer: (params) => getQuery(params, classList),
      })
      .then((res) => {
        setReviewList(res.data.data);
        setLoading(false);
      })
      .catch((error) => alert("Something went wrong, please reload the page!"));
  }, [filter]);

  return (
    <div className="h-full p-6 overflow-y-scroll">
      <div className="min-h-full w-full flex justify-center space-x-6">
        <div className="w-64 h-fit max-h-full bg-white drop-shadow-md rounded-md p-6">
          <h6 className="font-semibold text-sm mb-4">Reviews' state</h6>
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              color="indigo"
              className="w-full normal-case"
              onClick={() => setStatus("Pending")}
              {...{ variant: filter.status == "Pending" ? "filled" : "text" }}
            >
              Pending
            </Button>
            <Button
              size="sm"
              color="indigo"
              className="w-full normal-case"
              onClick={() => setStatus("Finalized")}
              {...{ variant: filter.status == "Finalized" ? "filled" : "text" }}
            >
              Finalized
            </Button>
          </div>
          <hr className="border-gray-300 mt-5 mb-6"></hr>
          <h6 className="font-semibold text-sm mb-4">Sort by</h6>

          <SelectSort
            handleSelect={setSort}
            defaultValue={filter.sort}
          ></SelectSort>

          <hr className="border-gray-300 mt-5 mb-6"></hr>
          <h6 className="font-semibold text-sm mb-4">Classes</h6>
          <div className="flex flex-col gap-4 mb-4">
            {classList &&
              classList.map((c) => (
                <label
                  key={c._id}
                  className="inline-flex items-center gap-5 p-1"
                >
                  <Checkbox
                    size="xs"
                    color="indigo"
                    type="checkbox"
                    onClick={() => setClass(c._id)}
                    defaultChecked={!filter.ignoreClass.includes(c._id)}
                    containerProps={{ className: "-m-4" }}
                  />
                  <span className="text-sm font-light truncate">
                    {c.class_name}
                  </span>
                </label>
              ))}
          </div>
        </div>
        <div className="w-[600px] flex flex-col gap-6">
          {!loading &&
            reviewList?.length != 0 &&
            reviewList?.map((r) => (
              <Link key={r._id} to={`/review/${r._id}`}>
                <div className="rouned-md drop-shadow-md bg-white rounded-md">
                  <div className="px-6 py-3">
                    <h1 className="font-semibold mb-1 text-blue-gray-900">
                      {r.class.class_name}
                    </h1>
                    <h1 className="text-xs">{r.grade_composition.name}</h1>
                  </div>
                  <hr className="border-gray-300"></hr>
                  <div className="px-6 py-3">
                    <div className="grid grid-cols-7 gap-3">
                      <div className="col-span-3 flex gap-2 items-center">
                        <img
                          src={r.student.image || "/default-user-image.png"}
                          className="w-7 h-7 rouned-full"
                        ></img>
                        <div className="flex flex-col">
                          <h6 className="text-xs truncate">
                            {r.student.full_name}
                          </h6>
                          <h6 className="text-[10px]">
                            {r.student.student_id}
                          </h6>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 justify-end">
                        <small className="text-gray-800">Current grade:</small>
                        <small className="font-medium">{r.current_grade}</small>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 justify-end">
                        <small className="text-gray-800">
                          Expectation grade:
                        </small>
                        <small className="font-medium">
                          {r.expectation_grade}
                        </small>
                      </div>
                    </div>
                  </div>
                  <hr className="border-gray-300"></hr>
                  <div className="px-6 py-3">
                    <div className="flex flex-row-reverse gap-5">
                      <div className="flex gap-2 items-center">
                        <small className="text-gray-700">Last updated:</small>
                        <small className="font-semibold text-green-600 text-xs leading-3">
                          {getDateFormated(r.updatedAt)}
                        </small>
                      </div>
                      <div className="flex gap-2 items-center">
                        <small className="text-gray-700">Comments:</small>
                        <small className="font-semibold text-green-600 text-xs leading-3">
                          {r.comment_count}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          {!loading && reviewList?.length == 0 && (
            <div className="flex flex-col w-full items-center gap-4 mt-20">
              <img className="w-[200px]" src="/empty.png"></img>
              <h6 className="font-semibold text-gray-600">No review found</h6>
            </div>
          )}
          {loading &&
            [1, 2, 3, 4].map((v) => (
              <div
                key={v}
                className="rouned-md drop-shadow-md bg-white rounded-md animate-pulse"
              >
                <div className="px-6 py-3">
                  <div className="h-4 w-5/12 bg-gray-200 rounded-sm"></div>
                  <div className="h-3 mt-3 w-5/12 bg-gray-200 rounded-sm"></div>
                </div>
                <hr className="border-gray-300"></hr>
                <div className="px-6 py-3">
                  <div className="grid grid-cols-7 gap-3">
                    <div className="col-span-3 flex gap-2 items-center">
                      <div className="bg-gray-200 rounded-full w-7 h-7"></div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <div className="h-3 mt-3 w-10/12 bg-gray-200 rounded-sm"></div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <div className="h-3 mt-3 w-10/12 bg-gray-200 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-300"></hr>
                <div className="px-6 py-3">
                  <div className="flex flex-row-reverse gap-5">
                    <div className="flex gap-2 items-center w-full justify-end">
                      <div className="h-3 mt-3 w-5/12 bg-gray-200 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
