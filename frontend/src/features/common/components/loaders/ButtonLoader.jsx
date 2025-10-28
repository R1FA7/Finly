import { LoadingSpinner } from "./LoadingSpinner";
export const ButtonLoader = ({
  text = "Loading...",
  size = "sm",
  //color="white",
}) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={size} />
      <span>{text}</span>
    </div>
  );
};
