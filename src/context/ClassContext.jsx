import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

// It is the first version, the better version must be implemented using useReducer hook

const ClassContext = createContext();

function ClassContextProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [currentClass, setCurrentClass] = useState(-1);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (token == null) {
      return;
    }
    axios
      .get("/classes", {})
      .then((res) => {
        setClassList(res.data.data);
        // console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    // get all user's classes
    //axios.get()
    // setClassList();
  }, []);

  return (
    <ClassContext.Provider
      value={{ classList, currentClass, setClassList, setCurrentClass }}
    >
      {children}
    </ClassContext.Provider>
  );
}
export { ClassContext, ClassContextProvider };
