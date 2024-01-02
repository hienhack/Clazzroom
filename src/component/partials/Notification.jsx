import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";

const testNotifications = [
  {
    _id: "1",
    class_name: "Software Architecture",
    content:
      "Hien Thai added a commnent to the review of Assignment grade composition",
    date: "THU-20-11-2023",
    state: "new",
    url: "/review/23dsfasd",
  },
  {
    _id: "2",
    class_name: "Advanced web development",
    content: "This is for testing only",
    date: "THU-20-11-2023",
    state: "viewed",
    url: "/review/23dsfasd",
  },
];

function Item({ className, content, date, url, state, onClick }) {
  return (
    <Link to={url}>
      <div
        className={`py-3 px-4 hover:bg-light-blue-100 ${
          state == "new" && "bg-light-blue-50"
        }`}
        onClick={() => console.log("Clicked")}
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
  const [notificationList, setNotificationList] = useState(testNotifications);
  const [hasNew, setHasNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadedPageRef = useRef(0);
  const maxPagesRef = useRef(0);

  function handleView(id) {
    console.log(id);
  }

  function handleLoad() {
    setLoading(true);

    // For testing
    setTimeout(() => {
      setLoading(false);
      loadedPageRef.current = loadedPageRef.current + 1;
      const newList = notificationList.slice();
      newList.push({
        ...testNotifications[1],
        _id: loadedPageRef.current * 2 - 1,
      });
      newList.push({
        ...testNotifications[1],
        _id: loadedPageRef.current * 2,
      });
      setNotificationList(newList);
    }, 1500);
  }

  useEffect(() => {
    loadedPageRef.current = 1;
    maxPagesRef.current = 5;
    setTimeout(() => setHasNew(true), 2000);
  }, []);

  return (
    <Popover placement="bottom-end">
      <PopoverHandler>
        <button className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-blue-gray-50 fill-blue-gray-300 hover:fill-blue-gray-600">
          <FaBell size="1.3rem" className="fill-inherit" />
          {hasNew && (
            <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-2"></div>
          )}
        </button>
      </PopoverHandler>
      <PopoverContent className="p-0">
        <div className="w-[400px] h-[500px] overflow-y-auto ">
          {notificationList.length == 0 && (
            <div className="h-full w-full flex items-center justify-center">
              <h6 className="font-semibold text-blue-gray-800">
                There is no notification!
              </h6>
            </div>
          )}
          {notificationList.map((n) => (
            <>
              <Item
                key={n._id}
                className={n.class_name}
                content={n.content}
                state={n.state}
                url={n.url}
                date={n.date}
                onClick={() => handleView(n._id)}
              ></Item>
              <hr className="border-gray-300"></hr>
            </>
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
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Notification;
