import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LineBreakDownChartComponent = ({ data }) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "BDT",
              }).format(value)
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={3}
          />
          <Line type="" dataKey="expense" stroke="#dc2626" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export const LineBreakDownChart = React.memo(LineBreakDownChartComponent);
