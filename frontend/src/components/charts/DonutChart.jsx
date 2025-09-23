import { Cell, Pie, PieChart, Tooltip } from "recharts";

export const DonutChart = ({ type, goalAmount, currentAmount }) => {
  const remaining = goalAmount - currentAmount;

  let colors = ["#FACC15", "#E5E7EB"]; // default: green + gray
  if (type === "expense" && remaining < 0) {
    colors = ["#EF4444", "#E5E7EB"]; // red
  } else if (type === "income" && remaining < 0) {
    colors = ["#10B981", "#E5E7EB"]; // extra green
  }

  const progress = Math.min(currentAmount, goalAmount);
  const data = [
    { name: "Used", value: progress > 0 ? progress : 0 },
    { name: "Remaining", value: Math.max(goalAmount - progress, 0) },
  ];

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        innerRadius={50}
        outerRadius={80}
        startAngle={90}
        endAngle={-270}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => [`TK${value}`, name]}
        contentStyle={{
          backgroundColor: "#fff",
          borderRadius: "6px",
          border: "1px solid #ddd",
        }}
      />
    </PieChart>
  );
};
