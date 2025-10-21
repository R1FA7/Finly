import { CurrencyBangladeshiIcon } from "@heroicons/react/24/outline";
import React from "react";
export const SummaryCard = ({
  title,
  value,
  icon,
  className = "",
  moneyIcon = true,
}) => {
  return (
    <div
      className={`p-5 rounded-lg text-center shadow hover:shadow-md transition ${className}`}
    >
      <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
        {icon && React.cloneElement(icon, { className: "h-5 w-5" })}
        {title}
      </p>
      <p className="text-3xl font-bold mt-1 flex justify-center items-center">
        {/* {icon2 && React.cloneElement(icon2, { className: "h-8 w-8 mr-1" })} */}
        {moneyIcon && <CurrencyBangladeshiIcon className="w-8 h-8" />}
        {value}
      </p>
    </div>
  );
};
