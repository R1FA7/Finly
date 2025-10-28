export const ProfileCard = ({ user }) => {
  return (
    <div className="w-full border rounded-md p-5 bg-slate-50 dark:bg-gray-900 shadow-sm border-gray-200">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 dark:bg-blue-300 flex items-center justify-center text-cyan-200 dark:text-cyan-800 font-bold text-xl ring-4 ring-cyan-500/40 mb-4">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-100">
          {user.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>
    </div>
  );
};
