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

const HorizontalBarBreakdownComponent = ({ data, type = "income" }) => {
  const styleText = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 40, 200)}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis
          type="number"
          tickFormatter={(v) => `Tk ${v}`}
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="source"
          width={70}
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
        />
        <Tooltip
          formatter={(value) => [
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "BDT",
            }).format(value),
            "Amount",
          ]}
          cursor={{ fill: "rgba(14,165,233,0.1)" }}
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
        />
        <Bar
          dataKey="amount"
          fill={type === "income" ? "#0ea5e9" : "#ef4444"}
          name={styleText(type)}
          radius={[0, 6, 6, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HorizontalBarBreakdown = React.memo(
  HorizontalBarBreakdownComponent
);
