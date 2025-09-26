import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarBreakdownChartComponent = ({
  data,
  type,
  frequency, // = { income: "#22c55e", expense: "#ef4444" },
  showBoth = false,
}) => {
  const styleText = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const formatDateToDayMonth = (dateStr) => {
    if (frequency === "yearly") return dateStr;

    const date = new Date(dateStr);
    const day = date.getDate();
    const monthShort = date.toLocaleString("default", { month: "short" }); // e.g., "Jan"
    const year = date.getFullYear().toString().slice(2); // last two digits of year

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return `${n}th`;
      switch (n % 10) {
        case 1:
          return `${n}st`;
        case 2:
          return `${n}nd`;
        case 3:
          return `${n}rd`;
        default:
          return `${n}th`;
      }
    };

    if (frequency === "monthly") {
      return `${monthShort}'${year}`;
    }

    // Default: return "4th Jan"
    return `${getOrdinal(day)} ${monthShort}`;
  };

  const getFrequencyDescription = () => {
    switch (frequency) {
      case "weekly":
        return "last 7 days";
      case "monthly":
        return "last 12 months";
      case "yearly":
        return "last few years";
      default:
        return `selected ${frequency} period`;
    }
  };

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-4 text-center">
        {" "}
        {styleText(frequency)} {styleText(type)} Trend{" "}
      </h2>
      <p className="text-sm text-gray-500 text-center mb-4 dark:text-gray-400">
        Breakdown of {type} over the {getFrequencyDescription()}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey="period"
            tickFormatter={(value) => formatDateToDayMonth(value)}
          />
          <YAxis domain={[0, (dataMax) => dataMax * 0.8]} />
          <Tooltip labelFormatter={(value) => formatDateToDayMonth(value)} />
          <Legend />
          <Bar
            dataKey={type}
            fill={type === "income" ? "#0ea5e9" : "#ef4444"}
            //name={styleText(type)}
          />
          {showBoth && (
            <Bar dataKey="expense" fill={"#ef4444"} name="Expense" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export const BarBreakdownChart = React.memo(BarBreakdownChartComponent);
