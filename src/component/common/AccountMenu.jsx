import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { FaUserCircle } from "react-icons/fa";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";

function AccountMenu() {
  return (
    <Menu>
      <MenuHandler>
        <Avatar className="bg-indigo-500" src="" size="sm"></Avatar>
      </MenuHandler>
      <MenuList>
        <MenuItem>
          <Link to="/profile">
            <div className="flex items-center gap-2">
              <FaUserCircle size="1.25rem" />

              <Typography variant="small" className="font-medium">
                My Profile
              </Typography>
            </div>
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default AccountMenu;
