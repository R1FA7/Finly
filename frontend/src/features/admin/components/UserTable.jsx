import UserTableRow from "./UserTableRow";

export default function UserTable({ users, onRoleChange, onDelete }) {
  console.log("USERs", users);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 dark:from-gray-900 to-gray-200 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                Role
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {users.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
                onRoleChange={onRoleChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
