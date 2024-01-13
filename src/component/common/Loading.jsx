import { Spinner } from "@material-tailwind/react";

function Loading({ size, width, fontSize, text, bg }) {
  size = size || "w-6 h-6";
  width = width || "3px";
  fontSize = fontSize || "";
  text = text || "Loading";
  bg = bg || "bg-gray-200";

  return (
    <div
      className={
        "w-full h-full flex items-center justify-center opacity-40 " + bg
      }
    >
      <div className="flex items-center gap-2">
        <Spinner color="teal" className={size} />
        <h6 className={"font-medium text-gray-900 " + fontSize}>{text}...</h6>
      </div>
    </div>
  );
}

export default Loading;
