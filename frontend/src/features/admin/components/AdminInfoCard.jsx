import {
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
const AdminInfoCard = () => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div
      className="w-full px-4 py-6 flex flex-col items-center bg-white dark:bg-gray-800 rounded-tr-lg
      shadow-[0_0_20px_3px_rgba(96,165,250,0.6)] dark:shadow-[0_0_25px_4px_rgba(129,140,248,0.7)]"
    >
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full p-2 border-2 border-slate-700 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-white" />
        </div>

        {/* Name */}
        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">
          {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}
        </p>
      </div>

      {/* Action Icons */}
      <div className="flex gap-4 mt-3">
        {/* Copy Email */}
        <button
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md transition"
          onClick={() => handleCopy(user?.email)}
          title="Copy Email"
        >
          <EnvelopeIcon className="w-5 h-5 text-blue-500" />
        </button>

        {/* Edit Profile */}
        <button
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md transition"
          onClick={() => navigate("/updateProfile")}
          title="Edit Profile"
        >
          <PencilSquareIcon className="w-5 h-5 text-green-500" />
        </button>

        {/* Copy Mobile */}
        <button
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md transition"
          onClick={() => handleCopy("+8801...")}
          title="Copy Mobile"
        >
          <PhoneIcon className="w-5 h-5 text-purple-500" />
        </button>
      </div>
    </div>
  );
};
export default AdminInfoCard;
