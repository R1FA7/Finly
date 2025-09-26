import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AccountForm } from "../components/AccountForm";
import { ProfileCard } from "../components/ProfileCard";
import { AppContext } from "../context/AppContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
export const UpdateProfilePage = () => {
  const { user, updateUser } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const handleEdit = async (info) => {
    try {
      const res = await axiosInstance.patch(API_PATHS.AUTH.UPDATE, info);
      if (res.data.success) {
        updateUser(res.data.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Update failed");
    }
  };
  return (
    <div className="py-10 px-4 border-gray-200 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
          Update Your Profile
        </h2>

        {/* Mobile View */}
        <div className="md:hidden">
          {/* Toggle Icon */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-2xl text-teal-600 cursor-pointer"
              aria-label="Toggle Form"
            >
              <ArrowsRightLeftIcon className="w-6 h-6" />
            </button>
          </div>
          {!showForm ? (
            <ProfileCard user={user} />
          ) : (
            <AccountForm user={user} onEdit={(info) => handleEdit(info)} />
          )}
        </div>
        {/* Desktop View */}
        <div className="hidden md:flex gap-6 justify-center items-center">
          <div className="w-1/3">
            <ProfileCard user={user} />
          </div>
          <div className="w-2/3">
            <AccountForm user={user} onEdit={(info) => handleEdit(info)} />
          </div>
        </div>
      </div>
    </div>
  );
};
