export const Button = ({ children, className = "", onClick }) => {
  return (
    <button
      className={`border border-gray-500 rounded-lg px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-300 dark:hover:bg-slate-800 inline-flex items-center justify-center gap-2 dark:bg-gray-900 dark:text-gray-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
