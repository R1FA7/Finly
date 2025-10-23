export function MessageBadges({
  priority,
  msg,
  userTargetLabel,
  formattedDate,
}) {
  return (
    <>
      {priority && (
        <span
          className={`px-2 py-1 rounded-full font-medium text-center ${priority.bg} ${priority.text}`}
        >
          {priority.label}
        </span>
      )}

      {msg.targetUsers?.length > 0 && (
        <span className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
          {userTargetLabel}
        </span>
      )}

      {msg.expiresAt && (
        <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300">
          Expires: {formattedDate(msg.expiresAt)}
        </span>
      )}

      <span
        className={`px-2 py-1 rounded-full font-medium ${
          msg.isActive
            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
            : "bg-gray-200 dark:bg-gray-600/30 text-gray-600 dark:text-gray-400"
        }`}
      >
        {msg.isActive ? "Active" : "Inactive"}
      </span>
    </>
  );
}
