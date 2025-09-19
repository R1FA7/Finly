export const Button = ({ children, className = "", onClick }) => {
  return (
    <button
      className={`border border-gray-500 rounded-lg px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-300 inline-flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
