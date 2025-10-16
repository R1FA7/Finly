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

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
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
          radius={[4, 4, 0, 0]}
        />
        {showBoth && (
          <Bar
            dataKey="expense"
            fill={"#ef4444"}
            name="Expense"
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
export const BarBreakdownChart = React.memo(BarBreakdownChartComponent);
