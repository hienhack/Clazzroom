import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const ClassContext = createContext();

function ClassProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [classList, setClassList] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);

  function loadClassList() {
    axios
      .get("/classes", {})
      .then((res) => {
        setClassList(res.data.data);
      })
      .catch((error) => {
        if (error.response.data.status == 500) {
          toast.error("Error loading classes, please reload the page!");
        }
      });
  }

  useEffect(() => {
    if (token == null) {
      return;
    }
    loadClassList();
  }, [token]);

  return (
    <ClassContext.Provider
      value={{
        classList,
        currentClass,
        setClassList,
        reloadClassList: loadClassList,
        setCurrentClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}
export { ClassContext, ClassProvider };
