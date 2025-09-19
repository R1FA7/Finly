import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HorizontalBarBreakdownComponent = ({ data, type }) => {
  const styleText = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  console.log("ooo", data);
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">
        Source-wise {styleText(type)} Breakdown
      </h2>
      <p className="text-sm text-gray-500 text-center mb-4">
        Visual representation of {type} sources and their relative amounts
      </p>

      <ResponsiveContainer
        width="100%"
        height={Math.max(data.length * 40, 100)}
      >
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `Tk ${v}`} />
          <YAxis
            type="category"
            dataKey="source"
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`Tk ${value}`, "Amount"]}
            cursor={{ fill: "rgba(14,165,233,0.1)" }}
          />
          <Bar
            dataKey="amount"
            fill={type === "income" ? "#0ea5e9" : "#ef4444"}
            name={styleText(type)}
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export const HorizontalBarBreakdown = React.memo(
  HorizontalBarBreakdownComponent
);
