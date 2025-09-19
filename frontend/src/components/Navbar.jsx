import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Button } from "./Button";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, updateUser } = useContext(AppContext);
  const handleClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
      updateUser(null);
      navigate("/");
      toast.success("Logged out Successfully");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="w-full fixed top-0 left-0 z-50 flex justify-between items-center p-2 sm:p-4 sm:px-24 bg-white shadow">
      <img src={assets.logo} alt="logo.png" className="" />
      <Button onClick={handleClick}>{isLoggedIn ? "Logout" : "Login"} </Button>
    </div>
  );
};
