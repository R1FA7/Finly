import {
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "./Button";
import { TransactionCard } from "./TransactionCard";

export const TransactionList = ({
  type = "transactions",
  transactions = [],
  onEdit,
  onDelete,
  callFrom = "incomePage",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleInSinglePage, setVisibleInSinlgePage] = useState(4); //txns
  const totalTxns = transactions.length;
  const pageCount = Math.ceil(totalTxns / visibleInSinglePage);

  //sorting
  const [sortBy, setSortBy] = useState({
    date: "desc",
    amount: "mix", //from low to high,vice-versa,default by date
    user: "mix", //group by user(should i do it?)
  });

  let sortedTransactions = [...transactions];

  sortedTransactions.sort((a, b) => {
    // First, sort by date if active
    if (sortBy.date !== "mix") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const dateCompare = sortBy.date === "asc" ? dateA - dateB : dateB - dateA;
      if (dateCompare !== 0) return dateCompare;
    }

    // Then by user if active (and dates are equal)
    if (sortBy.user !== "mix") {
      const userA = a.userId?.toString() || "";
      const userB = b.userId?.toString() || "";
      const userCompare =
        sortBy.user === "asc"
          ? userA.localeCompare(userB)
          : userB.localeCompare(userA);
      if (userCompare !== 0) return userCompare;
    }

    // Finally by amount if active (and dates and users are equal)
    if (sortBy.amount !== "mix") {
      return sortBy.amount === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    return 0;
  });

  /*
  0 -> 1 2
  1 -> 3 4
  2 -> 5 6
  */
  const pageBtnCnt = 5; //numbers in single page 1,2,3,4,5
  const currentBtnStart = Math.floor(currentPage / pageBtnCnt) * pageBtnCnt;

  //[5,0] = [0,1,2,3,4]
  const visiblePages = Array.from(
    { length: Math.min(pageBtnCnt, pageCount - currentBtnStart) },
    (_, i) => currentBtnStart + i
  );

  const handleNextClick = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const handlePrevClick = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleSortToggle = (field) => {
    setSortBy((prev) => {
      const currentSort = prev[field];
      if (currentSort === "mix") {
        return { ...prev, [field]: "asc" };
      } else if (currentSort === "asc") {
        return { ...prev, [field]: "desc" };
      } else {
        return { ...prev, [field]: "mix" };
      }
    });
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSortBy({ date: "mix", amount: "mix", user: "mix" });
    setCurrentPage(0);
  };

  if (transactions.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8 dark:text-gray-100">
        No {type} found.
      </p>
    );
  }

  return (
    <div className="flex-col space-y-5">
      {/* Sort Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-evenly gap-2 sm:gap-4 px-2 text-sm text-gray-300 border p-2 rounded-md">
        <span className="font-semibold whitespace-nowrap">Sort by:</span>

        <div className="flex gap-6 flex-wrap">
          {/* Date Sort */}
          <button
            onClick={() => handleSortToggle("date")}
            className="flex items-center space-x-1 hover:text-white transition"
            title="Click to cycle: off → ascending → descending"
          >
            <CalendarDaysIcon className="w-5 h-5" />
            {sortBy.date === "asc" ? (
              <ArrowUpIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-green-400" />
            )}
          </button>

          {/* User Sort */}
          <button
            onClick={() => handleSortToggle("user")}
            className="flex items-center space-x-1 hover:text-white transition"
            title="Click to cycle: off → ascending → descending"
          >
            <UserIcon className="w-5 h-5" />
            {sortBy.user === "asc" ? (
              <ArrowUpIcon className="w-4 h-4 text-green-400" />
            ) : sortBy.user === "desc" ? (
              <ArrowDownIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowsUpDownIcon className="w-4 h-4" />
            )}
          </button>

          {/* Amount Sort */}
          <button
            onClick={() => handleSortToggle("amount")}
            className="flex items-center space-x-1 hover:text-white transition"
            title="Click to cycle: off → ascending → descending"
          >
            <BanknotesIcon className="w-5 h-5" />
            {sortBy.amount === "asc" ? (
              <ArrowUpIcon className="w-4 h-4 text-green-400" />
            ) : sortBy.amount === "desc" ? (
              <ArrowDownIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowsUpDownIcon className="w-4 h-4" />
            )}
          </button>
          {/* Reset Sort */}
          <Button
            onClick={handleReset}
            className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 text-sm pr-2">
        <label htmlFor="perPage" className="text-gray-600 dark:text-gray-100">
          Show per page:
        </label>
        <input
          id="perPage"
          type="number"
          min="1"
          placeholder="4"
          className="w-12 sm:w-16 px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={visibleInSinglePage}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setVisibleInSinlgePage("");
              return;
            }
            setVisibleInSinlgePage(Number(val));
          }}
        />
      </div>

      <div className="flex justify-center items-center space-x-2">
        {currentPage > 0 && (
          <button
            className="border py-0.5 px-2 rounded-md cursor-pointer"
            onClick={handlePrevClick}
          >
            <ChevronDoubleLeftIcon className="w-2.5 h-6" />
          </button>
        )}
        {visiblePages.map((i) => (
          <span
            key={i}
            className={`${
              i !== currentPage
                ? "border py-0.5 px-2 rounded-md cursor-pointer font-light"
                : "font-extrabold"
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </span>
        ))}
        {currentPage < pageCount - 1 && (
          <button
            className="border py-0.5 px-2 rounded-md cursor-pointer"
            onClick={handleNextClick}
          >
            <ChevronDoubleRightIcon className="w-2.5 h-6" />
          </button>
        )}
      </div>
      {/* 
        0-> 0 - 3 slice(start,until) [0,4)
        1-> 4 - 8
        2-> 9 - 13

      */}
      <div className="flex-col space-y-3">
        {sortedTransactions
          .slice(
            currentPage * visibleInSinglePage,
            currentPage * visibleInSinglePage + visibleInSinglePage
          )
          .map((txn) => (
            <TransactionCard
              key={txn._id}
              transaction={txn}
              onEdit={onEdit}
              onDelete={onDelete}
              callFrom={callFrom}
            />
          ))}
      </div>
    </div>
  );
};
