import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Button } from "../../common/components/Button";
import { ButtonLoader } from "../../common/components/loaders/ButtonLoader";

export const DashboardToolBar = ({
  onSearch,
  onFilterChange,
  onDownload,
  sourceOptions = {},
  loading,
}) => {
  console.log(sourceOptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [localFilters, setLocalFilters] = useState({
    type: "",
    source: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleReset = () => {
    const resetFilters = {
      type: "",
      source: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  useEffect(() => {
    const tId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(tId);
  }, [searchTerm]);

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white shadow-md rounded-lg mb-4 border border-gray-200 dark:bg-gray-900 ">
      {/* search  */}
      <div className="relative w-full md:w-1/2">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

        <input
          type="text"
          placeholder="Search by source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex w-full md:w-auto justify-between md:justify-start gap-3">
        {/* Download  */}
        <Button onClick={onDownload} disabled={loading.downloadTxns}>
          <ArrowDownTrayIcon className="w-5 h-5" />
          {loading.downloadTxns ? (
            <ButtonLoader text="Downloading" />
          ) : (
            "Download"
          )}
        </Button>
        {/* Filter Popover */}
        <Popover className="relative">
          <PopoverButton
            className="flex justify-center items-center gap-2 border px-4 py-2 rounded-md border-gray-500 text-gray-800 
          dark:bg-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            {loading.filteredTxns ? (
              <ButtonLoader text="Filtering" />
            ) : (
              "Filter"
            )}
          </PopoverButton>
          <PopoverPanel className="absolute left-auto right-0 z-20 mt-2 w-80 bg-white dark:bg-gray-900  border border-gray-200 rounded-md shadow-lg p-4 space-y-4">
            <div className="flex text-sm items-center gap-2">
              <label className="text-gray-600 dark:text-gray-100">Type: </label>
              <select
                value={localFilters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1
                focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            {/* source  */}
            <div className="flex text-sm mt-1 gap-2 items-center">
              <label className="text-gray-600 dark:text-gray-100">
                Source:
              </label>
              <select
                value={localFilters.source}
                onChange={(e) => handleFilterChange("source", e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1
                focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">All Sources</option>
                {sourceOptions[localFilters.type || "all"].map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
            {/* Amount Range Query  */}
            <div className="flex items-center text-sm gap-2">
              <label className="text-gray-600 dark:text-gray-100">
                Amount Range:{" "}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Minimum"
                  min={0}
                  value={localFilters.minAmount}
                  onChange={(e) =>
                    handleFilterChange("minAmount", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Maximum"
                  min={0}
                  value={localFilters.maxAmount}
                  onChange={(e) =>
                    handleFilterChange("maxAmount", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
            </div>
            {/* Date Range Query */}
            <div className="flex flex-col text-sm gap-2">
              <label className="text-gray-600 dark:text-gray-100">
                Date Range:
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
                <input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
            </div>

            {/* Buttons  */}
            <div className="flex justify-between pt-2">
              <button
                as="button"
                onClick={handleReset}
                className="text-sm text-red-500 hover:underline"
              >
                Reset
              </button>
              <PopoverButton
                as="button"
                onClick={() => onFilterChange(localFilters)}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Apply
              </PopoverButton>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
};
