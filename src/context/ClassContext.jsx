import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const ClassContext = createContext();

function ClassContextProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [currentClass, setCurrentClass] = useState(null);
  const [classList, setClassList] = useState([]);

  const setCurrentClassById = useCallback((classId) => {
    const found = classList.filter((clazz) => clazz._id == classId);
    setCurrentClass(found[0]);
  }, []);

  useEffect(() => {
    if (token == null) {
      return;
    }

    localStorage.setItem("token", token);
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
        setCurrentClassById,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}
export { ClassContext, ClassContextProvider };
