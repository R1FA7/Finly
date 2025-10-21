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
  const [announcements, setAnnouncements] = useState([]);

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
      const [userRes, msgRes] = await Promise.all([
        axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO),
        axiosInstance.get(API_PATHS.AUTH.EXTRACT_MSG),
      ]);
      if (userRes.data.success) {
        setUser(userRes.data.user);
        setPermissions(userRes.data.permissions);
        setIsLoggedIn(true);
      }
      if (msgRes.data.success) setAnnouncements(msgRes?.data?.data);
    } catch (error) {
      console.log("Failed to fetch user info:", error);
      setIsLoggedIn(false);
      setPermissions([]);
      setUser(null);
      setAnnouncements([]);
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
    announcements,
    setAnnouncements,
  };
  return (
    <AppContext.Provider value={value}>
      {!loading && props.children}
    </AppContext.Provider>
  );
};
