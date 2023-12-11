import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const ClassContext = createContext();

function ClassProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [currentClass, setCurrentClass] = useState(null);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    if (token == null) {
      return;
    }

    axios
      .get("/classes", {})
      .then((res) => {
        setClassList(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
