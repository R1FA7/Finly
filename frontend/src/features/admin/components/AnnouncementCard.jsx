import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components/Button";
import { ButtonLoader } from "../../../components/loaders/ButtonLoader";
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
      bg: "bg-red-500/20",
      text: "text-red-300",
    },
    medium: {
      label: "Medium Priority",
      bg: "bg-yellow-500/20",
      text: "text-yellow-300",
    },
    low: {
      label: "Low Priority",
      bg: "bg-slate-300/20",
      text: "text-slate-300",
    },
  };

  const userTargetLabel =
    msg.targetUsers?.length === totalUsers
      ? "All Users"
      : `Specific Users (${msg.targetUsers?.length})`;

  const priority = priorityBadge[msg.priority];

  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:bg-gray-800/80 transition ${
        !msg.isActive ? "opacity-50" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <UserIcon className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white">
                {msg?.createdBy?.name || "Admin"}
              </h4>
              <span className="text-gray-500 text-sm">
                ({msg?.createdBy?.email})
              </span>
              <span className="text-gray-500 text-sm">
                {formattedDate(msg.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {priority && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${priority.bg} ${priority.text}`}
            >
              {priority.label}
            </span>
          )}

          {msg.targetUsers?.length > 0 && (
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
              {userTargetLabel}
            </span>
          )}

          {msg.expiresAt && (
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
              Expires: {formattedDate(msg.expiresAt)}
            </span>
          )}

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              msg.isActive
                ? "bg-green-500/20 text-green-300"
                : "bg-gray-600/30 text-gray-400"
            }`}
          >
            {msg.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Title & Content */}
      {msg.title && (
        <h3 className="font-bold text-white text-lg mb-2">{msg.title}</h3>
      )}
      <p className="text-gray-300 mb-4 text-base whitespace-pre-line">
        {msg.content}
      </p>

      {/* Footer */}
      <div className="flex justify-end items-center text-gray-500 text-sm">
        {msg.isActive ? (
          <button
            onClick={() => onDeactivate(msg._id)}
            disabled={loading.deactivateBtn}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded transition"
          >
            {loading.deactivateBtn ? (
              <ButtonLoader text="Deactiviting" />
            ) : (
              "Deactivate"
            )}
          </button>
        ) : (
          <Button
            onClick={() => onDelete(msg._id)}
            disabled={loading.deleteMsgBtn}
            className="bg-red-500/10 text-red-300 hover:bg-red-500/20"
          >
            {loading.deleteMsgBtn ? <ButtonLoader text="Deleting" /> : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
};
