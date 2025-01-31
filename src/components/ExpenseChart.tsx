import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ExpenseChartProps {
  expenses: number;
  income: number;
}

export const ExpenseChart = ({ expenses, income }: ExpenseChartProps) => {
  const [data, setData] = useState([
    { month: "Jan", amount: 0 },
    { month: "Feb", amount: 0 },
    { month: "Mar", amount: 0 },
    { month: "Apr", amount: 0 },
    { month: "May", amount: 0 },
    { month: "Jun", amount: expenses },
  ]);

  useEffect(() => {
    // Update the last month's data with current expenses
    setData(prevData => {
      const newData = [...prevData];
      newData[newData.length - 1].amount = expenses;
      return newData;
    });
  }, [expenses]);

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