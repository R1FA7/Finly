import {
  CalendarIcon,
  CurrencyBangladeshiIcon,
  PencilSquareIcon,
  TrashIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"; // Required for linking

export const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
  callFrom,
}) => {
  const { _id, type, source, amount, date } = transaction;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-center hover:shadow-md transition duration-200 mx-auto w-3/4 relative">
      <div
        className={`absolute -top-2 left-2 text-xs font-medium px-2 py-0.5 rounded ${
          type === "income"
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        {type.toUpperCase()}
      </div>

      <div className="flex flex-col space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">{source}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between space-y-2">
        {callFrom !== "dashboard" ? (
          <div className="flex space-x-4 text-sm">
            <button
              onClick={() => onEdit?.(transaction)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition"
              title="Edit"
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete?.(_id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <Link
            to={`/${type}`}
            className="text-sm text-blue-600 hover:text-blue-800 transition
            flex items-center gap-2"
          >
            <WrenchIcon className="w-5 h-5" />
            Actions
          </Link>
        )}

        <div className="text-right">
          <p className="text-xl font-bold text-slate-800 flex items-center">
            <CurrencyBangladeshiIcon className="h-5 w-5 mr-1" />
            {amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};
