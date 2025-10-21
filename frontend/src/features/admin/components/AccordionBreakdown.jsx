import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { LineBreakDownChart } from "../../../components/charts/LineBreakDownChart";

export const AccordionBreakdown = ({ isOpen, data, type, onToggle }) => {
  const iconColor = "text-blue-400";

  const emoji = type === "Weekly" ? "7️⃣" : type === "Monthly" ? "🗓️" : "📊";

  return (
    <div className="mb-4 rounded-lg shadow-sm border border-gray-700 bg-gray-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-700 transition-colors rounded-t-lg focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">{emoji}</span>
          <h3 className="text-lg font-semibold text-white">{type} Breakdown</h3>
        </div>
        <div
          className={`transform transition-transform duration-500 ${
            isOpen && "rotate-180"
          }`}
        >
          <ChevronDownIcon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-8 border-t border-gray-700 bg-gray-900 rounded-b-lg">
          <LineBreakDownChart data={data} height={300} />
        </div>
      )}
    </div>
  );
};
