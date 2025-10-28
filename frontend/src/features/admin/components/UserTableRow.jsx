import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import UserRoleSelector from "./UserRoleSelector";

export default function UserTableRow({ user, onRoleChange, onDelete }) {
  return (
    <tr
      key={user._id}
      className={`transition-all duration-200 ${
        user.role === "admin"
          ? "hover:bg-red-100 dark:hover:bg-red-900/20"
          : "hover:bg-blue-100 dark:hover:bg-blue-900/20"
      }`}
    >
      <td className="px-6 py-4">
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {user.name}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-800 dark:text-gray-400 text-sm">
          {user.email}
        </span>
      </td>
      <td className="px-6 py-4">
        <UserRoleSelector
          user={user}
          onRoleChange={(role) => onRoleChange(user, role)}
        />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center">
          {user.isAccountVerified ? (
            <CheckBadgeIcon
              className="text-cyan-300 dark:text-cyan-400 h-8 w-8"
              title="Verified"
            />
          ) : (
            <ExclamationCircleIcon
              className="text-gray-400 w-8 h-8"
              title="Unverified"
            />
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center">
          <button
            onClick={() => onDelete(user)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-200/10 text-red-500 hover:bg-red-500/30 transition-colors duration-150"
            title="Delete user"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </td>
    </tr>
  );
}
