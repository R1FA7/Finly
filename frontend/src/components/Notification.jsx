import {
  BellAlertIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
      className={`bg-white/50 border ${colors.border} ${colors.text} shadow-lg px-4 py-3 rounded-md flex items-center w-fit max-w-sm space-x-3 relative pointer-events-auto`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 ${colors.bar} rounded-l-md`}
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
        className={`transition ${colors.hover}`}
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
          className="w-4 h-4 cursor-pointer text-red-500 hover:scale-150 rounded-full border-2"
          aria-label="Dismiss Notification"
          title="dismiss"
        />
      </button>
    </div>
  );
};
