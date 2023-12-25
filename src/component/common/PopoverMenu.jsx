import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";

function PopoverMenu({ menuItems, placement, children }) {
  placement = placement || "bottom";
  return (
    <Popover placement={placement}>
      <PopoverHandler>{children}</PopoverHandler>
      <PopoverContent className="w-fit p-0">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="px-5 text-left text-blue-gray-700 w-full py-2 text-sm block hover:bg-gray-300 hover:text-blue-gray-900 rounded-md"
          >
            {item.title}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default PopoverMenu;
