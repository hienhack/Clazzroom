import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AccountMenu() {
  const { user, logout } = useContext(AuthContext);

  function handleSignout() {
    logout();
  }

  return (
    <Popover placement="bottom-end">
      <PopoverHandler>
        <button>
          <Avatar
            src={user?.image?.url || "/default-user-image.png"}
            size="sm"
          ></Avatar>
        </button>
      </PopoverHandler>
      <PopoverContent className="w-72">
        <div className="mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4">
          <Avatar src={user?.image?.url || "/default-user-image.png"} />
          <div>
            <Typography variant="h6" color="blue-gray">
              {user?.full_name || "Full name"}
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="font-medium text-blue-gray-500"
            >
              {user?.email || "abc@gmail.com"}
            </Typography>
          </div>
        </div>
        <List className="p-0">
          <Link
            to="/account"
            className="text-initial font-medium text-blue-gray-500"
          >
            <ListItem className="hover:bg-blue-gray-100">
              <ListItemPrefix>
                <FaUserCircle size="1.25rem" />
              </ListItemPrefix>
              My Account
            </ListItem>
          </Link>
          <button
            className="text-initial font-medium text-blue-gray-500 "
            onClick={handleSignout}
          >
            <ListItem className="hover:bg-blue-gray-100">
              <ListItemPrefix>
                <PiSignOutBold size="1.25rem" />
              </ListItemPrefix>
              Sign Out
            </ListItem>
          </button>
        </List>
      </PopoverContent>
    </Popover>
  );
}

export default AccountMenu;
