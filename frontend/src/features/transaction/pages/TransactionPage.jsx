import { ArrowDownTrayIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { Button } from "../../common/components/Button";
import { BarBreakdownChart } from "../../common/components/charts/BarBreakDownChart";
import { HorizontalBarBreakdown } from "../../common/components/charts/HorizontalBreakDownBar";
import { ConfirmDialog } from "../../common/components/ConfirmDialog";
import { ButtonLoader } from "../../common/components/loaders/ButtonLoader";
import { LoadingSpinner } from "../../common/components/loaders/LoadingSpinner";
import { SearchWithSuggestions } from "../../common/components/SearchWithSuggestions";
import { SummaryCard } from "../../common/components/SummaryCard";
import { TransactionList } from "../../common/components/TransactionList";
import { TransactionForm } from "../components/TransactionForm";

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5 w-full">
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
        <SearchWithSuggestions
          showSrchSuggestions={showSrchSuggestions}
          setShowSrchSuggestions={setShowSrchSuggestions}
          handleSearch={handleSearch}
          handleSuggestionClick={handleSuggestionClick}
          transactionType={transactionType}
          filteredSuggestions={filteredSuggestions}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />

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
            <ConfirmDialog
              loading={btnLoadingMap}
              isOpen={showConfirmModal}
              onClose={() => {
                handleCancelDelete();
              }}
              onConfirm={handleConfirmedDelete}
              title="Are you want to delete the transaction?"
              description={
                <>
                  This will permanently{" "}
                  <span className="font-bold text-red-600">delete </span>
                  the transaction
                </>
              }
              confirmText="Delete"
              cancelText="Cancel"
            />
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

        <h2 className="text-lg font-semibold mb-4 flex justify-start md:justify-center">
          {selectedFrequency.charAt(0).toUpperCase() +
            selectedFrequency.slice(1)}{" "}
          {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}{" "}
          Trend
        </h2>

        <p className="text-sm text-gray-500 flex justify-start md:justify-center mb-4 dark:text-gray-400">
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
