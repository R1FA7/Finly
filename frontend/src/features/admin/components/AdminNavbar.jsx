import AdminInfoCard from "./AdminInfoCard";

export const AdminNavbar = ({ navItems, activeTab, onNavClick }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-800 border-x border-y border-slate-200 dark:border-slate-700 mt-20 rounded-tr-2xl rounded-br-2xl flex-col">
        <AdminInfoCard />
        <div className="mt-10 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors
                ${
                  activeTab === item.id
                    ? "bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-white font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Navbar */}
      <div className="fixed z-20 bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors
                ${
                  activeTab === item.id
                    ? "text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700/50 font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
