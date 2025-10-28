export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };
  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-gray-300 border-t-cyan-500 ${sizes[size]}`}
      />
    </div>
  );
};
