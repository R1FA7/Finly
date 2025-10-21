import { useEffect, useState } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { AppContext } from "./AppContext";

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  //will be gone if user refreshes the page
  //so need consistent  user data as long as token present. So need an api call
  const updateUser = (userData) => {
    setUser(userData);
  };
  //api call
  const getUserData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (res.data.success) {
        setUser(res.data.user);
        setPermissions(res.data.permissions);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Failed to fetch user info:", error);
      setIsLoggedIn(false);
      setPermissions([]);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Token on mount:", token);
    if (token) {
      console.log("Calling getUserData...");
      getUserData();
    } else {
      console.log("No token found, skipping getUserData");
      setLoading(false);
    }
  }, []);

  console.log(isLoggedIn);
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    user,
    updateUser,
    getUserData,
    loading,
    theme,
    toggleTheme,
    permissions,
    setPermissions,
  };
  return (
    <AppContext.Provider value={value}>
      {!loading && props.children}
    </AppContext.Provider>
  );
};
