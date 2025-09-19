import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { LOGO_URL } from "../utils/constants";
import { ProfileMenu } from "./ProfileMenu";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, updateUser, user } =
    useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
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
      <li>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/income" onClick={() => setIsMobileMenuOpen(false)}>
          Income
        </Link>
      </li>
      <li>
        <Link to="/expense" onClick={() => setIsMobileMenuOpen(false)}>
          Expense
        </Link>
      </li>
      <li>
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          Dashboard
        </Link>
      </li>
    </>
  );

  return (
    <header className="w-full bg-white shadow-lg px-4 py-2 relative">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="logo-container">
          <img
            className="w-16 h-16 cursor-pointer"
            src={LOGO_URL}
            alt="Logo"
            onClick={() => navigate("/")}
          />
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          {isLoggedIn && (
            <>
              {[
                { name: "Home", path: "/" },
                { name: "Income", path: "/income" },
                { name: "Expense", path: "/expense" },
                { name: "Dashboard", path: "/dashboard" },
              ].map(({ name, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `relative group px-2 py-1 font-semibold transition-colors duration-200 text-gray-700 ${
                      isActive && "hover:text-blue-600"
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
            </>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Show burger menu only when logged in */}
          {isLoggedIn && (
            <button
              className="md:hidden text-3xl focus:outline-none"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          )}

          {/* Profile menu or Register link */}
          {isLoggedIn ? (
            <ProfileMenu user={user} onLogout={handleLogOut} />
          ) : (
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Register
            </span>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu — only if logged in */}
      {isLoggedIn && isMobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white p-4 absolute right-4 top-20 z-50 w-48 shadow-xl rounded-lg">
          <ul className="flex flex-col gap-3">{mobileNavLinks}</ul>
        </div>
      )}
    </header>
  );
};

export default Header;
