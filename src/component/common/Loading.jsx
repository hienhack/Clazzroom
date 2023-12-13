import { useEffect, useRef } from "react";

function Loading({ size, width, fontSize, text }) {
  size = size || "w-6 h-6";
  width = width || "3px";
  fontSize = fontSize || "";
  text = text || "Loading";

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 opacity-40">
      <div className="flex items-center gap-2">
        <div
          className={
            "rounded-full border-t-gray-900 border-r-gray-900 border-b-white border-l-white animate-spin " +
            size +
            ` border-[${width}] ` +
            fontSize
          }
        ></div>
        <h6 className="font-medium text-gray-900">{text}...</h6>
      </div>
    </div>
  );
}

export default Loading;
