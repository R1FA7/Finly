import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { ButtonLoader } from "../components/loaders/ButtonLoader";
import { AppContext } from "../context/AppContext";
import { useButtonLoader } from "../hooks/useButtonLoader";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

export const LoginPage = () => {
  const [register, setRegister] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setIsLoggedIn, updateUser, setPermissions } = useContext(AppContext);
  const { btnLoadingMap, withBtnLoading } = useButtonLoader();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    withBtnLoading("authenticating", async () => {
      //await new Promise((resolve) => setTimeout(resolve, 6000));
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
          setPermissions(res.data.permissions);
          navigate("/home");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-slate-950 text-gray-800 dark:text-gray-100 rounded-lg w-full max-w-md p-8 shadow-xl transition-colors">
        <h2 className="text-2xl font-bold mb-6">
          {register ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col space-y-4">
          {register && (
            <input
              type="text"
              name="name"
              autoComplete="on"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            autoComplete="on"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-300"
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
              className="flex justify-start font-light text-sm text-cyan-600 dark:text-cyan-400 cursor-pointer w-fit"
              onClick={() => navigate("/reset-password")}
            >
              Forget password?
            </div>
          )}
          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold w-full"
            disabled={btnLoadingMap.authenticating}
          >
            {register ? (
              btnLoadingMap.authentacating ? (
                <ButtonLoader text="Registering" />
              ) : (
                "Register"
              )
            ) : btnLoadingMap.authenticating ? (
              <ButtonLoader text="Signing in" />
            ) : (
              "Sign in"
            )}
            {/* {register ? "Register" : "Login"} */}
          </Button>
        </form>
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          {register ? "Already have an account?" : "Don't have an account?"}
        </p>
        <p
          className="font-light text-sm text-cyan-600 dark:text-cyan-400 cursor-pointer"
          onClick={() => (navigate("/login"), setRegister(!register))}
        >
          {register ? "Login" : "Register"}
        </p>
      </div>
    </div>
  );
};
