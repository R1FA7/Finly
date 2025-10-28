import {
  BellAlertIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export const Notification = ({
  type,
  exceededBy,
  onClose,
  callFor = "goal",
  messageId,
  content,
}) => {
  const navigate = useNavigate();
  // Color classes based on type for goal-related notifications
  const colorMap = {
    income: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-500",
      text: "text-emerald-950",
      border: "border-emerald-200",
      hover: "hover:text-emerald-700",
    },
    expense: {
      bar: "bg-red-500",
      iconBg: "bg-red-500",
      text: "text-red-800",
      border: "border-red-200",
      hover: "hover:text-red-900",
    },
    general: {
      bar: "bg-teal-500",
      iconBg: "bg-teal-500",
      text: "text-slate-800",
      border: "border-teal-200",
      hover: "hover:text-teal-700",
    },
  };

  // Choose color based on type (income or expense)
  const colors = colorMap[type] || colorMap.income;

  return (
    <div
      className={`bg-gradient-to-r from-gray-800/40 via-gray-700/70 dark:via-gray-800 to-gray-700/40 backdrop-blur-2xl border text-white shadow-md px-4 py-3 rounded-md flex items-center w-fit max-w-sm space-x-3 relative pointer-events-auto shadow-gray-200 dark:shadow-gray-800 border-none`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 border-none ${colors.bar} rounded-l-md`}
      />

      {callFor === "announcement" ? (
        <BellAlertIcon
          className={`w-6 h-6 p-1 rounded-full ${colors.iconBg} text-white flex-shrink-0`}
        />
      ) : (
        <ExclamationCircleIcon
          title="info"
          className={`w-6 h-6 p-1 rounded-full ${colors.iconBg} text-white flex-shrink-0 cursor-pointer hover:scale-150`}
          onClick={() => {
            navigate("/dashboard");
            if (typeof onClose === "function") onClose();
          }}
          aria-label="Notification info"
        />
      )}

      <p className="text-sm font-medium flex-1">
        {callFor === "announcement" ? (
          content
        ) : (
          <>
            You've exceeded your {type.toLowerCase()} goal by{" "}
            <strong>TK {exceededBy}</strong>.
          </>
        )}
      </p>

      <button
        className={`transition absolute -right-2 -top-2 bg-gradient-to-br from-gray-800/40 via-gray-700 to-gray-700/40 backdrop-blur-3xl border border-white/20 shadow-md rounded-full p-1`}
        onClick={() => {
          if (callFor === "announcement") {
            if (typeof onClose === "function") onClose(messageId);
          } else {
            if (typeof onClose === "function") onClose();
          }
        }}
        aria-label="Close notification"
      >
        <XMarkIcon
          className="w-3 h-3 cursor-pointer dark:text-white hover:scale-150"
          aria-label="Dismiss Notification "
          title="dismiss"
        />
      </button>
    </div>
  );
};
