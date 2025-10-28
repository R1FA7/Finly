export const Button = ({
  disabled,
  children,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      className={`border border-gray-500 rounded-lg px-4 py-2 inline-flex items-center justify-center gap-2
        text-gray-800 dark:bg-gray-900 dark:text-gray-100
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300 dark:hover:bg-slate-800 cursor-pointer"
        }
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
