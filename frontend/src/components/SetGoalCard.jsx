import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./Button";
import { DonutChart } from "./charts/DonutChart";

export const SetGoalCard = ({ data, type, onSubmitGoal }) => {
  const [isModalOn, setIsModalOn] = useState(false);
  console.log("SETCARD", data);
  const { amount: goalAmount, currentAmount, remaining } = data;
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = e.target;
    const startDate = formData["start-date"].value;
    const endDate = formData["end-date"].value;
    const amount = parseFloat(formData["amount"].value);

    if (!startDate || !endDate || !amount) {
      toast("Please insert valid goal details.");
      return;
    }
    const goalDetails = {
      type,
      startDate,
      endDate,
      amount,
    };
    onSubmitGoal(goalDetails);
    setIsModalOn(false);
  };
  return (
    <div
      className={`bg-white rounded-lg p-4 border relative shadow-md transition-all duration-300 dark:bg-gray-900 dark:text-gray-100 ${
        remaining < 0
          ? type === "expense"
            ? "border-red-500 shadow-red-300 shadow-lg"
            : "border-green-500 shadow-green-300 shadow-lg"
          : "border-gray-200 shadow"
      }`}
    >
      {/* tag */}
      <div className="absolute top-1/2 -left-23 -rotate-90 py-0.3 px-15 bg-slate-300 rounded-md -translate-y-1/2 dark:bg-cyan-900 ">
        <p className="text-gray-700 font-semibold text-sm uppercase tracking-wide dark:text-gray-100">
          {type}
        </p>
      </div>
      {/* icon  */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 p-3 rounded-full shadow-md border-2 border-white ring-2 ring-blue-300">
        <CursorArrowRippleIcon className="w-5 h-5 text-white dark:text-gray-100" />
      </div>

      <div className="flex w-full">
        <div className="w-1/3 flex flex-col items-center justify-center">
          <Button
            className="tracking-wider"
            onClick={() => setIsModalOn(!isModalOn)}
          >
            Goal TK {goalAmount}
          </Button>

          {/* Remaining amount */}
          {remaining > 0 ? (
            <>
              <p className="text-xl font-bold text-emerald-600 mt-4">
                TK {remaining}
              </p>
              <p className="text-gray-500 text-sm tracking-wider dark:text-gray-400">
                Remaining
              </p>
            </>
          ) : (
            <>
              <p
                className={`text-xl font-bold mt-4 ${
                  type === "expense" ? "text-red-600" : "text-teal-700"
                }`}
              >
                TK {Math.abs(remaining)}
              </p>
              <p className="text-gray-500 text-sm tracking-wider dark:text-gray-400 ">
                {type === "expense" ? "Overused" : "Extra Earned"}
              </p>
            </>
          )}
        </div>
        <div className="w-2/3 flex justify-center items-center">
          <div className="relative">
            <DonutChart
              type={type}
              goalAmount={goalAmount || 0}
              currentAmount={currentAmount || 0}
            />
            {remaining < 0 ? (
              <p
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold ${
                  type === "expense" ? "text-red-600" : "text-teal-800"
                }`}
              >
                Exceeded
              </p>
            ) : goalAmount > 0 ? (
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-gray-700 text-center dark:text-gray-300">
                Reached <br />
                {((currentAmount * 100) / goalAmount).toFixed(2)}%
              </p>
            ) : (
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium text-center dark:text-gray-400">
                No goal set
              </p>
            )}
          </div>
        </div>
        {isModalOn && (
          <div className="absolute top-0 left-1/9 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72 z-10 dark:bg-gray-900 dark:text-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-800 tracking-wide dark:text-gray-100">
                  Set/Edit Goal
                </h3>
                <button
                  onClick={() => setIsModalOn(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Start Date */}
              <div className="flex flex-col">
                <label
                  htmlFor="start-date"
                  className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-100"
                >
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <label
                  htmlFor="end-date"
                  className="text-sm font-medium text-gray-700 dark:text-gray-100 mb-1"
                >
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  defaultValue={
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />
              </div>

              {/* Target Amount */}
              <div className="flex flex-col">
                <label
                  htmlFor="target-amount"
                  className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-100"
                >
                  Target Amount (TK)
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  required
                  min={1}
                />
              </div>

              {/* Button aligned right */}
              <div className="flex justify-end">
                <Button type="submit">Save Goal</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
