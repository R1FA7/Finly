import {
  ArrowDownTrayIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { BarBreakdownChart } from "./charts/BarBreakDownChart";
import { HorizontalBarBreakdown } from "./charts/HorizontalBreakDownBar";
import { LoadingSpinner } from "./loaders/LoadingSpinner";
import { SummaryCard } from "./SummaryCard";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";

import { ButtonLoader } from "./loaders/ButtonLoader";

export const TransactionPage = ({
  transactionType,
  useTransactionHook,
  summaryCardConfig,
}) => {
  const {
    transactionData,
    searchKey,
    setSearchKey,
    filteredTransactions,
    editingTxn,
    dashboardData,
    selectedFrequency,
    setSelectedFrequency,
    searchActive,
    showSrchSuggestions,
    showForm,
    setShowForm,
    filteredSuggestions,
    sourceWiseBreakdown,
    total,
    maximum,
    loading,
    btnLoadingMap,
    showConfirmModal, //before delete
    setShowSrchSuggestions,
    handleSearch,
    handleSuggestionClick,
    handleSubmit,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmedDelete,
    handleDownloadExcel,
    handleEdit,
  } = useTransactionHook;

  const searchContainterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainterRef.current &&
        !searchContainterRef.current.contains(event.target)
      ) {
        if (showSrchSuggestions) setShowSrchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => removeEventListener("mousedown", handleClickOutside);
  }, [showSrchSuggestions]);

  const getFrequencyDescription = () => {
    switch (selectedFrequency) {
      case "weekly":
        return "last 7 days";
      case "monthly":
        return "last 12 months";
      case "yearly":
        return "last few years";
      default:
        return `selected ${selectedFrequency} period`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { summaryCardClass, icon1, icon2, label1, label2 } = summaryCardConfig;
  return (
    <div className="dark:bg-gray-900 dark:text-gray-100">
      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-center gap-6 mb-6">
          <div className="flex flex-wrap justify-center gap-6">
            <SummaryCard
              icon={icon1}
              title={label1}
              value={total}
              className={summaryCardClass.card1}
            />

            <SummaryCard
              icon={icon2}
              title={label2}
              value={maximum}
              className={summaryCardClass.card2}
            />
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-row items-center gap-2">
          <div
            className="relative w-full sm:w-auto flex-1"
            ref={searchContainterRef}
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${transactionType} source (e.g. ${
                transactionType === "income" ? "Salary" : "Rent"
              })`}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border border-gray-300 px-10 py-2 rounded-lg shadow-sm 
            dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {showSrchSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 w-[50vw] sm:w-[500px] mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border-green-200 border-2 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSuggestionClick(item.source)}
                  >
                    {item.source}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSearch}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg shadow transition"
          >
            Search
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-5 self-start md:self-center gap-4">
          <Button
            onClick={handleDownloadExcel}
            className="bg-slate-600 hover:bg-slate-700 text-white"
            disabled={btnLoadingMap.downloadTxns}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {btnLoadingMap.downloadTxns ? (
              <ButtonLoader text="Downloading" />
            ) : (
              `Download ${transactionType}`
            )}
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add {transactionType}
          </Button>
        </div>

        {showForm && (
          <div className="mt-4">
            <TransactionForm
              txnType={transactionType}
              typeSelectDisabled={true}
              initialData={editingTxn}
              onClose={() => {
                setShowForm(false);
              }}
              onSubmit={handleSubmit}
              loading={btnLoadingMap.submitTransaction}
            />
          </div>
        )}
      </div>

      {/* Transaction List Section */}
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200 dark:bg-gray-900">
        {searchActive && filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No {transactionType} found.
          </div>
        ) : (
          <>
            <TransactionList
              type={transactionType}
              transactions={
                searchActive ? filteredTransactions : transactionData
              }
              onEdit={(t) => handleEdit(t)}
              onDelete={(id) => handleRequestDelete(id)}
              onDownloadExcel={() => handleDownloadExcel()}
            />
            {showConfirmModal && (
              <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
                <div className="bg-cyan-200 dark:bg-gray-700 p-6 rounded shadow-lg max-w-sm w-full">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Are you sure you want to delete this transaction?
                  </h2>
                  <div className="flex justify-end gap-4">
                    <Button
                      onClick={handleCancelDelete}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmedDelete}
                      className="px-4 py-2 rounded dark:bg-red-500 hover:bg-red-700 text-white"
                      disabled={btnLoadingMap.deleteTxn}
                    >
                      {btnLoadingMap.deleteTxn ? (
                        <ButtonLoader text="Deleting" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Trend Chart Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 m-1.5 border border-gray-200 relative">
        <select
          className="border-gray-900 absolute right-3 top-3 p-2 drop-shadow-emerald-900 rounded-lg font-semibold
          dark:bg-gray-800 dark:text-gray-100
          dark:border-gray-700"
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value)}
        >
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
          <option value="yearly">yearly</option>
        </select>

        <h2 className="text-lg font-semibold mb-4 text-center">
          {selectedFrequency.charAt(0).toUpperCase() +
            selectedFrequency.slice(1)}{" "}
          {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}{" "}
          Trend
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4 dark:text-gray-400">
          Breakdown of {transactionType} over the {getFrequencyDescription()}
        </p>

        <BarBreakdownChart
          data={dashboardData?.[selectedFrequency]?.map((d) => ({
            period: d.period,
            [transactionType]: d[transactionType],
          }))}
          type={transactionType}
          frequency={selectedFrequency}
          barColors={transactionType === "income" ? "#0ea5e9" : "#ef4444"}
        />
      </div>

      {/* Breakdown Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Source-wise{" "}
          {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}{" "}
          Breakdown
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          Visual representation of {transactionType} sources and their relative
          amounts
        </p>

        <HorizontalBarBreakdown
          data={sourceWiseBreakdown}
          type={transactionType}
        />
      </div>
    </div>
  );
};
