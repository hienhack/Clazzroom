function InputFileButton({ onChange }) {
  function handleInput(event) {
    if (event.target.files != null) {
      onChange(event.target.files[0]);
    }
  }

  return (
    <div className="!absolute right-1 top-1">
      <input
        id="input-file"
        type="file"
        className="hidden"
        onChange={handleInput}
        accept=".xlsx"
      ></input>
      <label
        className="hover:cursor-pointer hover:drop-shadow-md block py-2 px-3 rounded-md bg-blue-500 hover:bg-blue-400 w-fit text-xs font-bold text-white"
        htmlFor="input-file"
      >
        Browse
      </label>
    </div>
  );
}

export default InputFileButton;
