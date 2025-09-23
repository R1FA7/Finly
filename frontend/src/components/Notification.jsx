import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const Notification = ({ type, exceededBy, onClose }) => {
  const navigate = useNavigate();

  //color classes based on type
  const colorMap = {
    income: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-500",
      text: "text-emerald-800",
      border: "border-emerald-200",
      hover: "hover:text-emerald-700",
    },
    expense: {
      bar: "bg-red-500",
      iconBg: "bg-red-500",
      text: "text-red-800",
      border: "border-red-200",
      hover: "hover:text-red-700",
    },
  };

  const colors = colorMap[type] || colorMap.income;

  return (
    <div
      className={`bg-white border ${colors.border} ${colors.text} shadow-lg px-4 py-3 rounded-md flex items-center w-fit max-w-sm space-x-3 relative`}
    >
      {/* vertical bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${colors.bar} rounded-l-md`}
      />

      {/* Spacer */}
      <div className="w-2" />

      {/* Info Icon */}
      <ExclamationCircleIcon
        className={`w-6 h-6 p-1 rounded-full ${colors.iconBg} text-white flex-shrink-0 cursor-pointer`}
        onClick={() => {
          onClose();
          navigate("/dashboard");
        }}
      />

      {/* Message */}
      <p className="text-sm font-medium flex-1">
        You've exceeded your {type.toLowerCase()} goal by{" "}
        <strong>TK {exceededBy}</strong>.
      </p>

      {/* Dismiss button */}
      <button
        className={`transition ${colors.hover}`}
        onClick={onClose}
        aria-label="Close notification"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
