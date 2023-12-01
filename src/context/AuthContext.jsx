import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState();
  //   const [user, setUser] = useState(testUser);

  const login = useCallback((loginData, errorHandler) => {
    localStorage.setItem("token", loginData.token);
    axios
      .get("/users/profile", loginData.token)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((error) => {
        if (!errorHandler) return;
        errorHandler(error);
      });

  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  console.log("go here");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Load account
    // axios.post('/account', {
    //     token:
    // })

    // pesudo-user
    console.log("Loading user");
    let loadedUser = {
      is_verified: false,
      image: "",
      full_name: "Hien Thai",
      email: "hienthai@gmail.com",
    };

    setUser(loadedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
