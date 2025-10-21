import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { LoadingSpinner } from "../../../components/loaders/LoadingSpinner";
import { useButtonLoader } from "../../../hooks/useButtonLoader";
import { useLoader } from "../../../hooks/useLoader";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";

export const UsersPage = () => {
  const { adminDashboardData, fetchAdminDashboardData } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); //delete or role
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(null);
  const { loading } = useLoader();
  const { btnLoadingMap, withBtnLoading } = useButtonLoader();

  const handleConfirm = async () => {
    if (!selectedUser) return;
    const btnKey = actionType === "delete" ? "Delete" : "Confirm";

    withBtnLoading(btnKey, async () => {
      try {
        if (actionType === "delete") {
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const res = await axiosInstance.post(
            API_PATHS.ADMIN.DELETE(selectedUser._id)
          );

          if (res.data.success) toast.success("User deleted successfully");
        }

        if (actionType === "role" && newRole) {
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const res = await axiosInstance.put(
            API_PATHS.ADMIN.UPDATE(selectedUser._id),
            {
              role: newRole,
            }
          );
          if (res.data.success) toast.success("User role updated successfully");
        }
        await fetchAdminDashboardData();
      } catch (error) {
        toast.error("Action failed. Please try again.");
        console.error("Error in confirm action:", error);
      } finally {
        // Reset everything
        setIsDialogOpen(false);
        setSelectedUser(null);
        setActionType(null);
        setNewRole(null);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 pl-10 pr-4 py-2.5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {adminDashboardData?.users
                ?.filter(
                  (user) =>
                    user.name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    user.email
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <tr
                    key={user._id}
                    className={`transition-all duration-200 ${
                      user.role === "admin"
                        ? "hover:bg-red-900/20"
                        : "hover:bg-blue-900/20"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        {user.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 bg-gray-700 p-1 rounded-full max-w-[128px]">
                        {["user", "admin"].map((roleOption) => (
                          <button
                            key={roleOption}
                            onClick={() => {
                              if (user.role !== roleOption) {
                                setSelectedUser(user);
                                setNewRole(roleOption);
                                setActionType("role");
                                setIsDialogOpen(true);
                              }
                            }}
                            className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                              user.role === roleOption
                                ? roleOption === "admin"
                                  ? "bg-red-500 text-white"
                                  : "bg-blue-500 text-white"
                                : "text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            {roleOption.charAt(0).toUpperCase() +
                              roleOption.slice(1)}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {user.isAccountVerified ? (
                        <div className="flex justify-center">
                          <CheckBadgeIcon
                            className="text-cyan-300 h-8 w-8"
                            title="verified"
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <ExclamationCircleIcon
                            className="text-gray-400 w-8 h-8"
                            title="Unverified"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setActionType("delete");
                          setIsDialogOpen(true);
                        }}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-200/10 text-red-400 hover:bg-red-500/30 transition-colors duration-150"
                        title="Delete user"
                      >
                        <TrashIcon
                          className="w-6 h-6"
                          style={{ color: "red" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <ConfirmDialog
          loading={btnLoadingMap}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedUser(null);
            setActionType(null);
            setNewRole(null);
          }}
          onConfirm={handleConfirm}
          title={
            actionType === "delete"
              ? `Delete user ${selectedUser?.name}?`
              : `Change role of ${selectedUser?.name}?`
          }
          description={
            actionType === "delete" ? (
              "This will permanently delete the user."
            ) : (
              <>
                This will change the user's role to{" "}
                <span
                  className={`font-semibold ${
                    newRole === "admin" ? "text-red-600" : "text-blue-400"
                  }`}
                >
                  {newRole}
                </span>
              </>
            )
          }
          confirmText={actionType === "delete" ? "Delete" : "Confirm"}
          cancelText="Cancel"
        />

        {/* Empty State */}
        {!adminDashboardData?.users?.some(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        ) && (
          <div className="p-8 text-center text-gray-400">
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
