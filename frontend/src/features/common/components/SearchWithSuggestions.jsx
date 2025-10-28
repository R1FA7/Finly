import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Button } from "./Button";

export const SearchWithSuggestions = ({
  showSrchSuggestions,
  setShowSrchSuggestions,
  handleSearch,
  handleSuggestionClick,
  transactionType,
  filteredSuggestions,
  searchKey,
  setSearchKey,
}) => {
  const searchContainterRef = useRef();
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (
  //       searchContainterRef.current &&
  //       searchContainterRef.current.contains(e.target) &&
  //       showSrchSuggestions
  //     )
  //       setShowSrchSuggestions(false);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [showSrchSuggestions]);
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="relative flex-1 sm:mx-auto" ref={searchContainterRef}>
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder={`Search ${transactionType} source (e.g. ${
            transactionType === "income" ? "Salary" : "Rent"
          })`}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onBlur={() => setTimeout(() => setShowSrchSuggestions(false), 200)}
          className="w-full border border-gray-300 px-10 py-2 rounded-lg shadow-sm 
      dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {showSrchSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[50vw] sm:w-[500px] mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border-green-200 border-2 max-h-60 overflow-y-auto">
            {filteredSuggestions.map((item, i) => (
              <div
                key={i}
                onMouseDown={(e) => e.preventDefault()}
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
  );
};
