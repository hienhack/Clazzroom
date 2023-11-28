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
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function AccountMenu() {
  return (
    <Popover placement="bottom-end">
      <PopoverHandler>
        <button>
          <Avatar className="bg-indigo-500" src="" size="sm"></Avatar>
        </button>
      </PopoverHandler>
      <PopoverContent className="w-72">
        <div className="mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4">
          <Avatar src="https://docs.material-tailwind.com/img/team-4.jpg" />
          <div>
            <Typography variant="h6" color="blue-gray">
              Tania Andrew
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="font-medium text-blue-gray-500"
            >
              hienthai@gmail.com
            </Typography>
          </div>
        </div>
        <List className="p-0">
          <Link
            to="/account"
            className="text-initial font-medium text-blue-gray-500"
          >
            <ListItem>
              <ListItemPrefix>
                <FaUserCircle size="1.25rem" />
              </ListItemPrefix>
              My Account
            </ListItem>
          </Link>
          <Link
            to="/logout"
            className="text-initial font-medium text-blue-gray-500"
          >
            <ListItem>
              <ListItemPrefix>
                <FaSignOutAlt size="1.25rem" />
              </ListItemPrefix>
              Sign Out
            </ListItem>
          </Link>
        </List>
      </PopoverContent>
    </Popover>
  );
}

export default AccountMenu;
