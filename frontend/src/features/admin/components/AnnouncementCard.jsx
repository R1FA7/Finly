import { UserIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { ButtonLoader } from "../../../components/loaders/ButtonLoader";
import { MessageBadges } from "./MessageBadges";

export const AnnouncementCard = ({
  msg,
  totalUsers = 0,
  onDeactivate,
  onDelete,
  loading,
}) => {
  const formattedDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const priorityBadge = {
    high: {
      label: "High Priority",
      bg: "bg-red-100 dark:bg-red-500/20",
      text: "text-red-600 dark:text-red-300",
    },
    medium: {
      label: "Medium Priority",
      bg: "bg-yellow-100 dark:bg-yellow-500/20",
      text: "text-yellow-700 dark:text-yellow-300",
    },
    low: {
      label: "Low Priority",
      bg: "bg-slate-200 dark:bg-slate-300/20",
      text: "text-slate-700 dark:text-slate-300",
    },
  };

  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const userTargetLabel =
    msg.targetUsers?.length === totalUsers
      ? "All Users"
      : `Specific Users (${msg.targetUsers?.length})`;

  const priority = priorityBadge[msg.priority];

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-md
    ${
      msg.isActive
        ? "transition duration-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:dark:shadow-[0_0_15px_rgba(96,165,250,0.3)]"
        : "opacity-60"
    }
  `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <UserIcon className="w-5 h-5" />
          </div>

          {/* Creator Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-800 dark:text-white">
                {msg?.createdBy?.name || "Admin"}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({msg?.createdBy?.email})
              </span>
              <span className="text-sm text-gray-400">
                {formattedDate(msg.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="hidden md:flex flex-wrap items-center justify-end gap-2 text-xs">
          <MessageBadges
            priority={priority}
            msg={msg}
            userTargetLabel={userTargetLabel}
            formattedDate={formattedDate}
          />
        </div>
        <div
          className="md:hidden relative"
          onClick={() => setShowExtraInfo((prev) => !prev)}
        >
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </div>
        {showExtraInfo && (
          <div className="absolute top-8 right-5 flex flex-col space-y-1.5 bg-gray-900 px-1 py-2 rounded-md">
            <MessageBadges
              priority={priority}
              msg={msg}
              userTargetLabel={userTargetLabel}
              formattedDate={formattedDate}
            />
          </div>
        )}
      </div>

      {/* Title & Content */}
      {msg.title && (
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          {msg.title}
        </h3>
      )}
      <p className="text-gray-800 dark:text-gray-300 mb-4 whitespace-pre-line leading-relaxed">
        {msg.content}
      </p>

      {/* Footer Actions */}
      <div className="flex justify-end">
        {msg.isActive ? (
          <button
            onClick={() => onDeactivate(msg._id)}
            disabled={loading.deactivateBtn}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1 rounded-md transition disabled:opacity-60"
          >
            {loading.deactivateBtn ? (
              <ButtonLoader text="Deactivating" />
            ) : (
              "Deactivate"
            )}
          </button>
        ) : (
          <Button
            onClick={() => onDelete(msg._id)}
            disabled={loading.deleteMsgBtn}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            {loading.deleteMsgBtn ? <ButtonLoader text="Deleting" /> : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
};
