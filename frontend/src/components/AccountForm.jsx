import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./Button";
export const AccountForm = ({ user, onEdit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (info.password.trim() && info.password.length < 6)
      return toast.error("Password must be at last 6 characters long.");
    onEdit(info);
  };
  return (
    <div className="w-full border rounded-md p-6 bg-white shadow-sm relative">
      <p className="text-blue-800 font-semibold text-lg mb-6 border-b pb-2">
        Account Details
      </p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="relative">
          <label
            htmlFor="name"
            className="absolute top-0 right-2 bg-slate-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-bl-md"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={info.name}
            onChange={handleChange}
            className="w-full p-3 pt-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <label
            htmlFor="email"
            className="absolute top-0 right-2 bg-slate-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-bl-md"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={info.email}
            onChange={handleChange}
            className="w-full p-3 pt-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="absolute top-0 right-2 bg-slate-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-bl-md"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Must be at least 6 characters long"
            name="password"
            value={info.password}
            onChange={handleChange}
            className="w-full p-3 pt-5 border border-gray-300 
            rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 bottom-2"
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button className="w-full">Edit</Button>
        </div>
      </form>
    </div>
  );
};
