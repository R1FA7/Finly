import { MegaphoneIcon, UserIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
import { useButtonLoader } from "../../../hooks/useButtonLoader";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { AnnoucementForm } from "../components/AnnoucementForm";
import { AnnouncementCard } from "../components/AnnouncementCard";

export const AnnouncementPage = () => {
  const { adminDashboardData, user, adminMessages, fetchAdminMessages } =
    useOutletContext();
  const { setAnnouncements } = useContext(AppContext);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageForm, setMessageForm] = useState({
    title: "",
    content: "",
    priority: "medium", // default value
    targetType: "all", // "all" or "specific"
    targetUsers: [], // array of user IDs (if targetType === "specific")
    expiresAt: "", // ISO string or date input value
  });
  const [userSearch, setUserSearch] = useState("");
  const { btnLoadingMap, withBtnLoading } = useButtonLoader();

  // Handle message submission
  const handleSendMessage = async () => {
    if (!messageForm.content.trim()) {
      toast.error("Please enter message content");
      return;
    }

    if (
      messageForm.targetType === "specific" &&
      messageForm.targetUsers.length === 0
    ) {
      toast.error("Please select at least one user");
      return;
    }
    withBtnLoading("postBtn", async () => {
      try {
        const payload = {
          title: messageForm.title || "",
          content: messageForm.content,
          priority: messageForm.priority,
          createdBy: user._id, //remove it after middleware
          targetUsers:
            messageForm.targetType === "specific"
              ? messageForm.targetUsers
              : adminDashboardData?.users?.map((user) => user._id),
          ...(messageForm.expiresAt && {
            expiresAt: new Date(messageForm.expiresAt).toISOString(),
          }),
        };
        console.log(payload);

        const res = await axiosInstance.post(
          API_PATHS.ADMIN.SEND_MESSAGE,
          payload
        );

        if (res.data.success) {
          toast.success("Announcement posted successfully");
          setMessageForm({
            title: "",
            content: "",
            priority: "medium",
            targetType: "all",
            targetUsers: [],
            expiresAt: "",
          });
          setShowMessageForm(false);
          setAnnouncements((prev = []) => [payload, ...prev]);
          await fetchAdminMessages();
        }
      } catch (error) {
        console.error("Error sending message", error);
        toast.error(
          error.response?.data?.message || "Failed to post announcement"
        );
      }
    });
  };

  // Handle message deactivation
  const handleDeactivateMessage = async (messageId) => {
    withBtnLoading("deactivateBtn", async () => {
      try {
        const res = await axiosInstance.patch(
          API_PATHS.ADMIN.DEACTIVATE_MSG(messageId)
        );
        if (res.data.success) {
          toast.success("Message deactivated");
          await fetchAdminMessages();
        }
      } catch (error) {
        console.error("Error deactivating message", error);
        toast.error("Failed to deactivate message");
      }
    });
  };

  const handleDeleteMessage = async (messageId) => {
    withBtnLoading("deleteMsgBtn", async () => {
      try {
        const res = await axiosInstance.delete(
          API_PATHS.ADMIN.DELETE_MSG(messageId)
        );
        if (res.data.success) {
          toast.success("Message deleted");
          await fetchAdminMessages();
        }
      } catch (error) {
        console.error("Error deleting message", error);
        toast.error("Failed to deleting message");
      }
    });
  };
  return (
    <div className="space-y-6">
      {/* Message Form */}
      <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 transition-all max-w-full ${
          showMessageForm && "ring-2 ring-blue-500"
        }`}
      >
        <div className="flex gap-4 flex-col md:flex-row items-center md:items-start">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>

          {/* Form Content */}
          <div className="flex-1">
            <textarea
              placeholder="What's Up?"
              value={messageForm.content}
              onClick={() => setShowMessageForm(true)}
              onChange={(e) => {
                setMessageForm({
                  ...messageForm,
                  content: e.target.value,
                });
              }}
              className="text-center w-full max-w-full bg-transparent text-base sm:text-2xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none resize-none break-words overflow-hidden"
              rows={showMessageForm ? 3 : 1}
            />

            {showMessageForm && (
              <AnnoucementForm
                messageForm={messageForm}
                setMessageForm={setMessageForm}
                userSearch={userSearch}
                setUserSearch={setUserSearch}
                adminDashboardData={adminDashboardData}
                handleSendMessage={handleSendMessage}
                loading={btnLoadingMap}
              />
            )}
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2">
        {adminMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MegaphoneIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No announcements yet</p>
          </div>
        ) : (
          adminMessages.map((msg) => (
            <AnnouncementCard
              key={msg._id}
              msg={msg}
              totalUsers={adminDashboardData?.users.length || 0}
              onDeactivate={handleDeactivateMessage}
              onDelete={handleDeleteMessage}
              loading={btnLoadingMap}
            />
          ))
        )}
      </div>
    </div>
  );
};
