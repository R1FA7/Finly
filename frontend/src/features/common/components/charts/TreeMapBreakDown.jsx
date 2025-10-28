import { ResponsiveContainer, Tooltip, Treemap } from "recharts";

export const TreeMapBreakDown = ({ data, type = "income" }) => {
  const styleText = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const CustomTreemapTooltip = ({ active, payload }) => {
    if (active && payload?.length > 0) {
      const { source, amount } = payload[0].payload;
      return (
        <div className="bg-white shadow-md rounded px-2 py-1 text-sm text-gray-800 border border-gray-300">
          <div>
            <strong>{source}</strong>
          </div>
          <div>Tk {amount}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">
        Source-wise {styleText(type)} Breakdown
      </h2>
      <p className="text-sm text-gray-500 text-center mb-4">
        Visual representation of {type} sources and their relative amounts
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={data}
          dataKey="amount"
          nameKey="source"
          stroke="#fff"
          fill="#0ea5e9"
          aspectRatio={4 / 3}
        >
          {/* <Tooltip
            formatter={(value) => [`Tk${value}`, "Amount"]}
            labelFormatter={(label) => `Source:${label}`}
          /> */}
          <Tooltip content={<CustomTreemapTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};
