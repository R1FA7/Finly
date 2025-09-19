//icon(img)
//type(2options in transaction page but in specific page default in/ exp)
//source(textBox)
//amount(number)
//date(calender)
//Add button {based on type it will change after choosing by default transaction}
//at top right there will be a x button as after clicking the add button this form will pop out

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./Button";
export const TransactionForm = ({
  txnType = "income",
  typeSelectDisabled = false,
  initialData = {},
  onClose,
  onSubmit,
}) => {
  const safeInitialData = initialData || {};

  const [type, setType] = useState(safeInitialData.type || txnType);
  const [source, setSource] = useState(safeInitialData.source || "");
  const [amount, setAmount] = useState(safeInitialData.amount || "");
  const [date, setDate] = useState(
    safeInitialData.date
      ? new Date(safeInitialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source.trim() || !amount || Number(amount) <= 0) {
      toast("Please enter a valid source and amount.");
      return;
    }
    const txnData = {
      type,
      source,
      amount: Number(amount),
      date,
    };
    console.log("K", txnData);
    onSubmit(txnData);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">
          {safeInitialData._id
            ? `Edit ${type}`
            : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          {typeSelectDisabled ? (
            <div className="rounded-md">
              <input
                type="text"
                value={txnType.charAt(0).toUpperCase() + txnType.slice(1)}
                disabled
                className={`w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed
                ${
                  txnType === "income"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }`}
              />
            </div>
          ) : (
            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              required
              type="text"
              placeholder={
                type === "income"
                  ? "e.g. Salary, Freelance"
                  : "e.g. Rent, Groceries"
              }
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-blue-400 "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g. 1000, 2000"
              value={amount}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-blue-400 "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-blue-400 "
            />
          </div>
          <Button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer">
            {safeInitialData._id ? "Update " : "Add "}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </form>
      </div>
    </div>
  );
};
