import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ExpenseChartProps {
  expenses: number;
  income: number;
}

export const ExpenseChart = ({ expenses, income }: ExpenseChartProps) => {
  const [data, setData] = useState(() => {
    // Generate sample data for January to May
    const historicalData = [
      {
        month: "Jan",
        expenses: 980,
        income: 2100
      },
      {
        month: "Feb",
        expenses: 1200,
        income: 2300
      },
      {
        month: "Mar",
        expenses: 850,
        income: 1900
      },
      {
        month: "Apr",
        expenses: 1100,
        income: 2400
      },
      {
        month: "May",
        expenses: 1300,
        income: 2600
      },
      {
        month: "Jun",
        expenses: 0,
        income: 0
      }
    ];
    return historicalData;
  });

  useEffect(() => {
    // Update only June's data with current expenses and income
    setData(prevData => {
      const newData = [...prevData];
      newData[5] = {
        ...newData[5],
        expenses,
        income
      };
      return newData;
    });
  }, [expenses, income]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">2024 Expense Trend</h3>
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