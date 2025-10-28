export default function UserRoleSelector({ user, onRoleChange }) {
  const roles = ["user", "admin"];

  return (
    <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full max-w-[128px]">
      {roles.map((roleOption) => (
        <button
          key={roleOption}
          onClick={() => user.role !== roleOption && onRoleChange(roleOption)}
          className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
            user.role === roleOption
              ? roleOption === "admin"
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
              : "text-gray-900 dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-600"
          }`}
        >
          {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
        </button>
      ))}
    </div>
  );
}
