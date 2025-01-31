import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 900 },
  { month: "Mar", amount: 1600 },
  { month: "Apr", amount: 1400 },
  { month: "May", amount: 2000 },
  { month: "Jun", amount: 1800 },
];

export const ExpenseChart = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Expense Trend</h3>
        <select className="text-sm border rounded-md px-2 py-1">
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-gray-900">
                        ${payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#10B981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};