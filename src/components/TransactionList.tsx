import { motion } from "framer-motion";
import { ShoppingBag, Coffee, Home, Car, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  icon: any;
}

const categoryIcons = {
  Shopping: ShoppingBag,
  Food: Coffee,
  Housing: Home,
  Transport: Car,
};

const initialTransactions = [
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
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const handleAddTransaction = () => {
    if (!newTransaction.title || !newTransaction.amount || !newTransaction.category) {
      return;
    }

    const transaction = {
      id: transactions.length + 1,
      title: newTransaction.title,
      amount: -Math.abs(parseFloat(newTransaction.amount)),
      date: "Today",
      category: newTransaction.category,
      icon: categoryIcons[newTransaction.category as keyof typeof categoryIcons],
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({ title: "", amount: "", category: "" });
    setShowForm(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border rounded-lg space-y-4"
        >
          <Input
            placeholder="Transaction title"
            value={newTransaction.title}
            onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          />
          <Select
            value={newTransaction.category}
            onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categoryIcons).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
          </div>
        </motion.div>
      )}

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