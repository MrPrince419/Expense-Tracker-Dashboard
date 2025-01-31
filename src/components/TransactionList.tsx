import { motion } from "framer-motion";
import { ShoppingBag, Coffee, Home, Car } from "lucide-react";
import { Card } from "@/components/ui/card";

const transactions = [
  {
    id: 1,
    title: "Groceries",
    amount: -120.50,
    date: "Today",
    category: "Shopping",
    icon: ShoppingBag,
  },
  {
    id: 2,
    title: "Coffee Shop",
    amount: -4.99,
    date: "Yesterday",
    category: "Food",
    icon: Coffee,
  },
  {
    id: 3,
    title: "Rent",
    amount: -1200,
    date: "Mar 1",
    category: "Housing",
    icon: Home,
  },
  {
    id: 4,
    title: "Gas",
    amount: -45.00,
    date: "Feb 28",
    category: "Transport",
    icon: Car,
  },
];

export const TransactionList = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <transaction.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.title}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};