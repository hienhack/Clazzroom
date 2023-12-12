import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const ClassContext = createContext();

function ClassProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [classList, setClassList] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);

  useEffect(() => {
    if (token == null) {
      if (classList != null) {
        setClassList(null);
        setCurrentClass(null);
      }
      return;
    }

    axios
      .get("/classes", {})
      .then((res) => {
        setClassList(res.data.data);
      })
      .catch((error) => {});
  }, [token]);

  return (
    <ClassContext.Provider
      value={{
        classList,
        currentClass,
        setClassList,
        setCurrentClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}
export { ClassContext, ClassProvider };
