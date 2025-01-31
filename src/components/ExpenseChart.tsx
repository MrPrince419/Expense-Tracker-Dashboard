import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ExpenseChartProps {
  expenses: number;
  income: number;
}

export const ExpenseChart = ({ expenses, income }: ExpenseChartProps) => {
  const [data, setData] = useState(() => {
    // Generate data for January 1-31
    const januaryData = [];
    for (let i = 1; i <= 31; i++) {
      januaryData.push({
        day: i,
        expenses: 0,
        income: 0
      });
    }
    return januaryData;
  });

  useEffect(() => {
    // Update the last day's data with current expenses and income
    setData(prevData => {
      const newData = [...prevData];
      newData[newData.length - 1] = {
        ...newData[newData.length - 1],
        expenses,
        income
      };
      return newData;
    });
  }, [expenses, income]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">January 2024 Expense Trend</h3>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Jan ${value}`}
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
                        Expenses: ${payload[0]?.value}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        Income: ${payload[1]?.value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#ef4444" }}
            />
            <Line
              type="monotone"
              dataKey="income"
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