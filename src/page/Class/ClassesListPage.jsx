import {
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import CreateClassForm from "./CreateClassForm";
import JoinClassForm from "./JoinClassForm";
import ClassCard from "./ClassCard";
import { ClassContext } from "../../context/ClassContext";
import Loading from "../../component/common/Loading";
import { AuthContext } from "../../context/AuthContext";

function ClassesListPage() {
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const { classList } = useContext(ClassContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (classList != null) {
      setLoading(false);
      setEmpty(classList.length == 0);
    }
  }, [classList]);

  return (
    <div className="w-full bg-gray-100 h-[calc(100vh-66px)]">
      <div className="flex flex-col h-full">
        <ListPageNavbar
          onCreateClass={() => setCreating(true)}
          onJoinClass={() => setJoining(true)}
        ></ListPageNavbar>
        {loading && <Loading></Loading>}
        {!loading && empty && (
          <div className="grow flex flex-col justify-center items-center">
            <img className="w-36" src="/empty.png" />
            <div className="my-5 flex flex-col gap-2 items-center">
              <h1 className="text-center text-lg text-blue-gray-800 font-medium">
                There is no class to display
              </h1>
              <h6 className="text-sm text-blue-gray-700">
                {user?.role == "student"
                  ? "Let's join a class now"
                  : "Let's join a class or create a new one!"}
              </h6>
            </div>
          </div>
        )}
        {!loading && !empty && (
          <div className="overflow-y-auto">
            <div className="p-6 flex flex-wrap justify-center gap-6">
              {classList?.map((clazz) => (
                <ClassCard key={clazz?._id} clazz={clazz} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateClassForm
        open={creating}
        handleOpen={() => setCreating(!creating)}
      ></CreateClassForm>
      <JoinClassForm
        open={joining}
        handleOpen={() => setJoining(!joining)}
      ></JoinClassForm>
    </div>
  );
}

function ListPageNavbar({ onCreateClass, onJoinClass }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white px-6 h-[50px] min-h-[50px] border-b border-gray-300 flex items-center justify-between">
      <h1 className="font-medium text-blue-gray-800">List of classes</h1>
      <div className="flex h-full gap-3 items-center">
        {user?.role == "teacher" && (
          <Popover placement="bottom-end">
            <Tooltip
              className="bg-gray-700 text-xs py-1"
              placement="bottom"
              content="Create or join a class"
            >
              <PopoverHandler>
                <button className="p-2 -m-2 rounded-full hover:bg-blue-gray-50">
                  <AiOutlinePlus
                    size="1.5rem"
                    className="w-6 h-6 fill-blue-gray-800"
                  />
                </button>
              </PopoverHandler>
            </Tooltip>
            <PopoverContent className="w-72">
              <List className="p-0">
                <button onClick={onCreateClass}>
                  <ListItem className="text-blue-gray-800">
                    Create a new class
                  </ListItem>
                </button>
                <button onClick={onJoinClass}>
                  <ListItem className="text-blue-gray-800">
                    Join a class
                  </ListItem>
                </button>
              </List>
            </PopoverContent>
          </Popover>
        )}
        {user?.role == "student" && (
          <Tooltip
            className="bg-gray-700 text-xs py-1"
            placement="bottom"
            content="Join a class"
          >
            <button
              className="p-2 -m-2 rounded-full hover:bg-blue-gray-50"
              onClick={onJoinClass}
            >
              <AiOutlinePlus
                size="1.5rem"
                className="w-6 h-6 fill-blue-gray-800"
              />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default ClassesListPage;
