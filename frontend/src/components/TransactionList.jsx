import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
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

  if (transactions.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8 dark:text-gray-100">
        No {type} found.
      </p>
    );
  }
  return (
    <div className="flex-col space-y-5">
      <div className="flex items-center justify-end space-x-2 text-sm pr-2">
        <label htmlFor="perPage" className="text-gray-600 dark:text-gray-100">
          Show per page:
        </label>
        <input
          id="perPage"
          type="number"
          min="1"
          placeholder="4"
          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
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
        {transactions
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
