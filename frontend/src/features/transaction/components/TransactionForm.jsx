//icon(img)
//type(2options in transaction page but in specific page default in/ exp)
//source(textBox)
//amount(number)
//date(calender)
//Add button {based on type it will change after choosing by default transaction}
//at top right there will be a x button as after clicking the add button this form will pop out

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../common/components/Button";
import { ButtonLoader } from "../../common/components/loaders/ButtonLoader";

export const TransactionForm = ({
  txnType = "income",
  typeSelectDisabled = false,
  initialData = {},
  onClose,
  onSubmit,
  loading,
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
    onSubmit(txnData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 transition text-xl cursor-pointer"
          aria-label="Close form"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
          {safeInitialData._id
            ? `Edit ${type}`
            : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Transaction Type
          </label>
          {typeSelectDisabled ? (
            <div className="rounded-md">
              <input
                type="text"
                value={txnType.charAt(0).toUpperCase() + txnType.slice(1)}
                disabled
                className={`w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed
                dark:bg-gray-800 dark:border-gray-700
                ${
                  txnType === "income"
                    ? "text-green-600 font-semibold dark:text-green-400"
                    : "text-red-600 font-semibold dark:text-red-400"
                }`}
              />
            </div>
          ) : (
            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <Button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              safeInitialData._id ? (
                <ButtonLoader text="Updating" />
              ) : (
                <ButtonLoader text="Adding" />
              )
            ) : safeInitialData._id ? (
              "Update "
            ) : (
              "Add "
            )}
            {!loading && type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </form>
      </div>
    </div>
  );
};
