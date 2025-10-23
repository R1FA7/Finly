import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ButtonLoader } from "../../../components/loaders/ButtonLoader";

export const AnnoucementForm = ({
  messageForm,
  setMessageForm,
  userSearch,
  setUserSearch,
  adminDashboardData,
  handleSendMessage,
  loading,
}) => {
  return (
    <div className="space-y-5 w-full max-w-full">
      {/* Title */}
      <input
        type="text"
        placeholder="Message Title (optional)"
        value={messageForm.title}
        onChange={(e) =>
          setMessageForm({ ...messageForm, title: e.target.value })
        }
        className="w-full max-w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Priority Selection */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
          Priority
        </label>
        <div className="flex gap-3 flex-wrap">
          {["low", "medium", "high"].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="priority"
                value={level}
                checked={messageForm.priority === level}
                onChange={(e) =>
                  setMessageForm({ ...messageForm, priority: e.target.value })
                }
                className="w-4 h-4 accent-blue-500"
              />
              <span
                className={`text-sm px-3 py-1 rounded-full transition ${
                  messageForm.priority === level
                    ? level === "high"
                      ? "bg-red-100 text-red-600 dark:bg-red-500/30 dark:text-red-300"
                      : level === "medium"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-300"
                      : "bg-green-100 text-green-600 dark:bg-green-500/30 dark:text-green-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Target Type */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
          Send To
        </label>
        <div className="flex gap-4 flex-wrap">
          {["all", "specific"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <input
                type="radio"
                name="targetType"
                value={type}
                checked={messageForm.targetType === type}
                onChange={(e) =>
                  setMessageForm({
                    ...messageForm,
                    targetType: e.target.value,
                    ...(e.target.value === "all" ? { targetUsers: [] } : {}),
                  })
                }
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm capitalize text-gray-800 dark:text-gray-200">
                {type} Users
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Specific User Selector */}
      {messageForm.targetType === "specific" && (
        <div className="space-y-2">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 pl-10 pr-4 py-2.5 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtered users list */}
          <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800">
            {adminDashboardData?.users
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                  user.email.toLowerCase().includes(userSearch.toLowerCase())
              )
              .map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 text-sm text-gray-800 dark:text-white cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={messageForm.targetUsers.includes(user._id)}
                    onChange={(e) => {
                      const updatedUsers = e.target.checked
                        ? [...messageForm.targetUsers, user._id]
                        : messageForm.targetUsers.filter(
                            (id) => id !== user._id
                          );

                      setMessageForm({
                        ...messageForm,
                        targetUsers: updatedUsers,
                      });
                    }}
                  />
                  {user.name} ({user.email})
                </label>
              ))}
          </div>

          {/* Selected user chips */}
          {messageForm.targetUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {messageForm.targetUsers.map((userId) => {
                const user = adminDashboardData?.users.find(
                  (u) => u._id === userId
                );
                return (
                  <span
                    key={userId}
                    className="bg-blue-100 text-blue-700 dark:bg-blue-500/30 dark:text-blue-200 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {user?.name}
                    <button
                      onClick={() =>
                        setMessageForm({
                          ...messageForm,
                          targetUsers: messageForm.targetUsers.filter(
                            (id) => id !== userId
                          ),
                        })
                      }
                      className="hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Expiry Date */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
          Expires At (optional)
        </label>
        <input
          type="datetime-local"
          value={messageForm.expiresAt}
          onChange={(e) =>
            setMessageForm({
              ...messageForm,
              expiresAt: e.target.value,
            })
          }
          className="w-full max-w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Post Button */}
      <div className="text-right">
        <button
          onClick={handleSendMessage}
          disabled={loading.postBtn}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading.postBtn ? <ButtonLoader text="Posting" /> : "Post"}
        </button>
      </div>
    </div>
  );
};
