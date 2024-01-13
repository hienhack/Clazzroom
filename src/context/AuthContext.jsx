import axios from "axios";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import useCustomLocation from "../hook/useCustomLocation";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [redirect, setRedirect] = useState(null);

  function login(loginData) {
    localStorage.setItem("token", loginData.token);
    setToken(loginData.token);
    setUser(loginData.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("filter");
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    if (!token) return;

    axios
      .get("/users/profile", {})
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((error) => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, setUser, user, token, redirect, setRedirect }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
