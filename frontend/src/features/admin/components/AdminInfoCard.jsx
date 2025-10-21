import {
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
const AdminInfoCard = () => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-full px-4 py-6 flex flex-col items-center shadow-xl">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full p-2 border-2 border-slate-700 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-white" />
        </div>
        {/* Name */}
        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">
          Tim Howard
        </p>
      </div>
      {/* Action Icons */}
      <div className="flex gap-4 mt-3">
        <button
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md transition"
          onClick={() => handleCopy("ref@gmail.com")}
          title="Copy Email"
        >
          <EnvelopeIcon className="w-5 h-5 text-blue-500" />
        </button>

        <button
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md transition"
          onClick={() => console.log("Edit clicked")}
          title="Edit Profile"
        >
          <PencilSquareIcon className="w-5 h-5 text-green-500" />
        </button>

        <button
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md transition"
          onClick={() => console.log("Phone clicked")}
          title="Copy Mobile"
        >
          <PhoneIcon className="w-5 h-5 text-purple-500" />
        </button>
      </div>
    </div>
  );
};
export default AdminInfoCard;
