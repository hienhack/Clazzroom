import { useEffect } from "react";
import "./Style.css";

function InputFormat({ width, height, label, inputRef, defaultValue }) {
  width = width || "w-full";
  height = height || "h-full";

  useEffect(() => {
    if (defaultValue) {
      inputRef.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);

  return (
    <div
      className={
        "input-format relative border-b border-blue-gray-300 transition-all  " +
        height +
        " " +
        width
      }
    >
      <label className="h-full w-full absolute top-0 left-0 z-0 pt-6 text-sm font-normal text-blue-gray-700">
        {label}
      </label>
      <div className="pt-6 z-10 pb-2 absolute w-full h-full">
        <div
          ref={inputRef}
          className="h-full overflow-y-auto w-full outline-none text-sm font-normal text-blue-gray-900 "
          contentEditable
        ></div>
      </div>
    </div>
  );
}

export default InputFormat;
