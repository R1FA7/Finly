import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useButtonLoader } from "../../../hooks/useButtonLoader";
import { useLoader } from "../../../hooks/useLoader";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { Button } from "../../common/components/Button";
import { ConfirmDialog } from "../../common/components/ConfirmDialog";
import { LoadingSpinner } from "../../common/components/loaders/LoadingSpinner";
import UserTable from "../components/UserTable";
import { useUrlPagination } from "../hooks/useUrlPagination";

export const UsersPage = () => {
  const { page, setPage, limit, setLimit, search, setSearch, resetPage } =
    useUrlPagination();
  // const [localSearch, setLocalSearch] = useState(debouncedValue);
  const [searchQuery, setSearchQuery] = useState(search);
  // const debouncedValue = useDebounceSearch(searchQuery);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); //delete or role
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isSearching, setIsSearching] = useState(false); //to not debounce again after clicking on a suggestion
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [goPage, setGoPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, withLoading } = useLoader();
  const { btnLoadingMap, withBtnLoading } = useButtonLoader();

  // shows searchquery in url
  // useEffect(() => {
  //   setSearch(searchQuery);
  // }, []);

  // useEffect(() => {
  //   if (debouncedValue?.trim().length > 0) fetchSuggestions(debouncedValue);
  //   console.log("D", debouncedValue);
  // }, [debouncedValue]);

  // useEffect(() => {
  //   setFilters({ search: debouncedSearch });
  // }, [debouncedSearch]);

  //Debounced Suggestion

  // useEffect(() => {
  //   console.log("I am here");
  //   if (!isSearching) return;
  //   if (!search.trim()) {
  //     setFilteredSuggestions([]);
  //     fetchUsers("", 1, limit);
  //     return;
  //   }
  //   //setSearch(searchQuery);
  //   const tid = setTimeout(() => {
  //     fetchSuggestions(search);
  //   }, [500]);
  //   return () => clearTimeout(tid);

  //   //fetchSuggestions(debouncedValue);
  // }, [search]);
  useEffect(() => {
    if (!isSearching) return;
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      resetPage();
      setSearch("");
      fetchUsers();
      return;
    }
    const tid = setTimeout(() => fetchSuggestions(searchQuery), 500);
    return () => clearTimeout(tid);
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL, {
        params: { search: query },
      });
      if (res?.data?.success) {
        const suggestions = res.data.data.users.map((user) => ({
          name: user.name,
          email: user.email,
        }));
        setFilteredSuggestions(suggestions);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };
  //start up whole data & url changes & ui change
  useEffect(() => {
    withLoading(async () => {
      await fetchUsers(search, page, limit);
    });
  }, [limit, page, search]);

  //final search & pagination
  const fetchUsers = async (query = searchQuery, page, limit) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL, {
        params: { page: page, limit: limit, search: query },
      });
      if (res?.data?.success) {
        console.log(res.data);
        const { users, pagination } = res.data.data;
        const { totalPages, totalUsers } = pagination || {};
        console.log(totalUsers);
        setUsers(users);
        setTotalPages(totalPages);
        setTotalUsers(totalUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
    setFilteredSuggestions([]);
  };
  //final button search
  const handleSearch = async (query) => {
    console.log("SE", searchQuery);
    resetPage();
    const searchedVal = query ?? searchQuery;
    await fetchUsers(searchedVal, 1, limit);
    setSearchQuery(searchedVal);
    setFilteredSuggestions([]);
    setIsSearching(false);
    setSearch(searchQuery);
  };
  const handleRoleChange = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setActionType("role");
    setIsDialogOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setActionType("delete");
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    const btnKey = actionType === "delete" ? "Delete" : "Confirm";

    withBtnLoading(btnKey, async () => {
      try {
        if (actionType === "delete") {
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const res = await axiosInstance.post(
            API_PATHS.ADMIN.DELETE(selectedUser._id)
          );

          if (res.data.success) toast.success("User deleted successfully");
        }

        if (actionType === "role" && newRole) {
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const res = await axiosInstance.put(
            API_PATHS.ADMIN.UPDATE(selectedUser._id),
            {
              role: newRole,
            }
          );
          if (res.data.success) toast.success("User role updated successfully");
        }
        await fetchUsers();
      } catch (error) {
        toast.error("Action failed. Please try again.");
        console.error("Error in confirm action:", error);
      } finally {
        // Reset everything
        setIsDialogOpen(false);
        setSelectedUser(null);
        setActionType(null);
        setNewRole(null);
        //resetPage();
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
        Users
      </h1>
      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            onBlur={() => setFilteredSuggestions([])}
            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 pl-10 pr-4 py-2.5 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {filteredSuggestions.length > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 z-10 bg -white dark:bg-gray-800 shadow-lg rounded-lg w-full md:w-3/4 lg:w-1/3">
              {filteredSuggestions.map((item, i) => (
                <div
                  key={i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSearch(item.name)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">{item.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={() => handleSearch(searchQuery)}>Search</Button>
      </div>
      {!users.length ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-500">
          <p>No users found matching your search.</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-end space-x-2 text-sm pr-2">
            <label
              htmlFor="perPage"
              className="text-gray-600 dark:text-gray-100"
            >
              Show per page:
            </label>
            <select
              className="w-12 sm:w-16 px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-4">
            {/* Centered pagination buttons */}
            <div className="flex-1 flex flex-wrap justify-center gap-5">
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-0"
                >
                  «
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((num) => {
                    // Show first, last, current ± 1
                    return (
                      num === 1 ||
                      num === totalPages ||
                      (num >= page - 1 && num <= page + 1)
                    );
                  })
                  .map((num, i, arr) => {
                    const prevNum = arr[i - 1];
                    const showEllipsis = prevNum && num - prevNum > 1;
                    return (
                      <React.Fragment key={num}>
                        {showEllipsis && (
                          <span className="px-2 py-1 text-gray-400 dark:text-gray-500">
                            …
                          </span>
                        )}
                        <button
                          onClick={() => setPage(num)}
                          className={`px-3 py-1 rounded transition ${
                            page === num
                              ? "font-bold text-black dark:text-white"
                              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {num}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-0"
                >
                  »
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label>Page</label>
                <input
                  type="number"
                  className="w-12 sm:w-16 px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  //defaultValue={page}
                  min={1}
                  max={totalPages}
                  value={goPage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGoPage(val === "" ? "" : Number(val));
                  }}
                />
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    setPage(goPage <= totalPages ? goPage : totalPages)
                  }
                >
                  💨
                </button>
              </div>
            </div>
            {/* Right-aligned total info */}
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-auto pr-2">
              {Math.max(1, (page - 1) * limit + 1)}–
              {Math.min(page * limit, totalUsers)} of {totalUsers}
            </p>
          </div>
        </div>
      )}
      {/* Users Table */}
      <UserTable
        users={users}
        onRoleChange={handleRoleChange}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        loading={btnLoadingMap}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedUser(null);
          setActionType(null);
          setNewRole(null);
        }}
        onConfirm={handleConfirm}
        title={
          actionType === "delete"
            ? `Delete user ${selectedUser?.name}?`
            : `Change role of ${selectedUser?.name}?`
        }
        description={
          actionType === "delete" ? (
            <>
              This will permanently{" "}
              <span className="font-bold text-red-600">delete </span>
              the user
            </>
          ) : (
            <>
              This will change the user's role to{" "}
              <span
                className={`font-bold ${
                  newRole === "admin"
                    ? "text-red-600"
                    : "text-blue-700 dark:text-blue-400"
                }`}
              >
                {newRole}
              </span>
            </>
          )
        }
        confirmText={actionType === "delete" ? "Delete" : "Confirm"}
        cancelText="Cancel"
      />
    </div>
  );
};
