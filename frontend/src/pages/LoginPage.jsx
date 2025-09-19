import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { AppContext } from "../context/AppContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

export const LoginPage = () => {
  const [register, setRegister] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setIsLoggedIn, updateUser } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint = register
        ? API_PATHS.AUTH.REGISTER
        : API_PATHS.AUTH.LOGIN;
      const payload = register
        ? { name, email, password }
        : { email, password };

      const res = await axiosInstance.post(endpoint, payload);

      if (res.data.success) {
        localStorage.setItem("access_token", res.data.access_token);
        setIsLoggedIn(true);
        updateUser(res.data.user);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
      <div className="bg-slate-900 text-white rounded-lg w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {register ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col space-y-4">
          {register && (
            <input
              type="text"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 rounded bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </span>
          </div>
          {!register && (
            <div
              className="flex justify-start font-light text-sm text-cyan-500 cursor-pointer w-29"
              onClick={() => navigate("/reset-password")}
            >
              Forget password?
            </div>
          )}
          <Button
            type="submit"
            className="bg-cyan-400 text-slate-900 font-semibold py-2 px-4 rounded hover:bg-cyan-300 transition cursor-pointer w-full"
          >
            {register ? "Register" : "Login"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-gray-200">
          {register ? "Already have an acount?" : "Don't have an account?"}
        </p>
        <p
          className="font-light text-sm text-cyan-500 cursor-pointer"
          onClick={() => (navigate("/login"), setRegister(!register))}
        >
          {register ? "Login" : "Register"}
        </p>
      </div>
    </div>
  );
};
