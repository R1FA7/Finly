import { useCallback } from "react";
import { useUrlState } from "../../../hooks/useUrlState";

export const useUrlPagination = () => {
  const [page, setPage] = useUrlState("page", 1);
  const [limit, setLimit] = useUrlState("limit", 5);
  const [search, setSearch] = useUrlState("search", "");
  const resetPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  return {
    page, 
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    resetPage
  };
};
// import { useCallback } from "react";
// import { useSearchParams } from "react-router-dom";

// export const useUrlPagination = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const page = Number(searchParams.get("page")) || 1;
//   const limit = Number(searchParams.get("limit")) || 5;
//   const search = searchParams.get("search") || "";

//   const setParam = useCallback((key, value) => {
//     setSearchParams(prev => {
//       const params = new URLSearchParams(prev);
//       if (value === "" || value == null) params.delete(key);
//       else params.set(key, value);
//       return params;
//     });
//   }, [setSearchParams]);

//   const setPage = useCallback(
//     val => {
//       const newPage = typeof val === "function" ? val(page) : val;
//       setParam("page", newPage);
//     },
//     [page, setParam]
//   );

//   const setLimit = useCallback(
//     val => {
//       const newLimit = typeof val === "function" ? val(limit) : val;
//       setParam("limit", newLimit);
//       setParam("page", 1); // reset page when limit changes
//     },
//     [limit, setParam]
//   );

//   const setSearch = useCallback(
//     val => {
//       setParam("search", val);
//       setParam("page", 1); // reset page when searching
//     },
//     [setParam]
//   );

//   const resetPage = useCallback(() => setPage(1), [setPage]);

//   return { page, setPage, limit, setLimit, search, setSearch, resetPage };
// };
