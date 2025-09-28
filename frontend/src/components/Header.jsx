import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { LOGO_URL } from "../utils/constants";
import { AnimatedName } from "./AnimatedName";
import { ProfileMenu } from "./ProfileMenu";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, updateUser, user, theme, toggleTheme } =
    useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      localStorage.removeItem("dismissed-income-notification");
      localStorage.removeItem("dismissed-expense-notification");
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
      updateUser(null);
      toast.success("Logged out Successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  const mobileNavLinks = (
    <>
      {[
        { name: "Home", path: "/" },
        { name: "Income", path: "/income" },
        { name: "Expense", path: "/expense" },
        { name: "Dashboard", path: "/dashboard" },
      ].map(({ name, path }) => (
        <li key={name}>
          <Link
            to={path}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {name}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <header className="w-full bg-white dark:bg-slate-800 shadow-lg px-4 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Logo & Name */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md"
            src={LOGO_URL}
            alt="Logo"
          />
          <AnimatedName />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-200 font-medium">
          {isLoggedIn &&
            [
              { name: "Home", path: "/" },
              { name: "Income", path: "/income" },
              { name: "Expense", path: "/expense" },
              { name: "Dashboard", path: "/dashboard" },
            ].map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative group px-2 py-1 font-semibold transition-colors duration-200 ${
                    isActive ? "text-blue-600" : "hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {name}
                    <span
                      className={`absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 transition-transform duration-300 origin-left ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Burger Menu */}
          {isLoggedIn && (
            <button
              className="md:hidden text-3xl text-gray-700 dark:text-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          )}

          {/* Profile or Register */}
          {isLoggedIn ? (
            <ProfileMenu user={user} onLogout={handleLogOut} />
          ) : (
            <span
              className="cursor-pointer text-blue-600 font-semibold relative group"
              onClick={() => navigate("/login")}
            >
              Register
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
            </span>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isLoggedIn && isMobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white dark:bg-gray-900 p-4 absolute right-4 top-20 z-50 w-48 shadow-xl rounded-lg">
          <ul className="flex flex-col gap-2">{mobileNavLinks}</ul>
        </div>
      )}
    </header>
  );
};

export default Header;
