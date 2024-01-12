import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDateFormated, getTime } from "../../utils/DateHelper";
import { toast } from "react-toastify";

function Item({ className, content, date, url, state, onClick }) {
  return (
    <Link to={url}>
      <div
        className={`py-3 px-4 hover:bg-light-blue-100 rounded-md ${
          state == "new" && "bg-light-blue-50"
        }`}
        onClick={onClick}
      >
        <h6
          className={`text-[0.8rem] font-medium ${
            state == "new" ? "!text-blue-gray-900" : "!text-blue-gray-700"
          }`}
        >
          {className}
        </h6>
        <p className={`text-xs ${state == "new" && "text-blue-gray-800"}`}>
          {content}
        </p>
        <div className="flex justify-end">
          <small className="font-semibold text-green-600 text-[0.6rem] leading-3">
            {date}
          </small>
        </div>
      </div>
    </Link>
  );
}

function Notification() {
  const [notificationList, setNotificationList] = useState([]);
  const [noNew, setNoNew] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const loadedPageRef = useRef(0);
  const maxPagesRef = useRef(0);

  function handleView(id, index) {
    if (notificationList[index].state == "viewed") return;
    axios
      .post(`/notifications/${id}`, { state: "viewed" })
      .then((res) => {
        const newNotificationList = notificationList.slice();
        newNotificationList[index].state = "viewed";
        setNotificationList(newNotificationList);
        setNoNew(noNew - 1);
      })
      .catch((error) => {});
  }

  function handleLoad() {
    if (loadedPageRef.current >= maxPagesRef.current) return;
    setLoading(true);
    axios
      .get(`/notifications?page=${loadedPageRef.current + 1}`)
      .then((res) => {
        const data = res.data.data;
        loadedPageRef.current = loadedPageRef.current + 1;
        // remove duplicate
        const newNotificationList = notificationList.filter(
          (n) => !data.data.find((n2) => n2._id == n._id)
        );
        setNotificationList([...newNotificationList, ...data.data]);
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again later");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    axios
      .get("/notifications")
      .then((res) => {
        console.log(res.data.data);
        const data = res.data.data;
        loadedPageRef.current = 1;
        maxPagesRef.current = data.total;
        setNotificationList(data.data);
        setHasNew(data.new && data.new > 0);
      })
      .catch((error) => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <button className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-blue-gray-50 fill-blue-gray-300 hover:fill-blue-gray-600">
          <FaBell size="1.3rem" className="fill-inherit" />
          {noNew > 0 && (
            <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-2"></div>
          )}
        </button>
      </MenuHandler>
      <MenuList className="p-0 w-[400px] h-[500px] overflow-y-auto">
        {notificationList.length == 0 && (
          <div className="h-full w-full flex items-center justify-center">
            <h6 className="font-semibold text-blue-gray-800">
              There is no notification!
            </h6>
          </div>
        )}
        {notificationList.map((n, index) => (
          <MenuItem key={n._id} className="p-0">
            <div>
              <Item
                className={n.class}
                content={n.content}
                state={n.state}
                url={n.url}
                date={getDateFormated(n.createdAt)}
                onClick={() => handleView(n._id, index)}
              ></Item>
              <hr className="border-gray-300 mx-2"></hr>
            </div>
          </MenuItem>
        ))}
        {loadedPageRef.current < maxPagesRef.current && (
          <Button
            className="normal-case w-full"
            variant="text"
            color="cyan"
            size="sm"
            disabled={loading}
            onClick={handleLoad}
          >
            {loading ? "Loading..." : "See more"}
          </Button>
        )}
      </MenuList>
    </Menu>
  );
}

export default Notification;
