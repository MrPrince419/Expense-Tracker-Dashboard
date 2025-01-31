import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { SummaryCard } from "@/components/SummaryCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Track your expenses and savings</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Balance"
            amount="$4,550.00"
            icon={Wallet}
            trend="+12.5%"
            trendUp={true}
          />
          <SummaryCard
            title="Income"
            amount="$2,250.00"
            icon={TrendingUp}
            trend="+8.2%"
            trendUp={true}
          />
          <SummaryCard
            title="Expenses"
            amount="$1,180.00"
            icon={TrendingDown}
            trend="+5.1%"
            trendUp={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExpenseChart />
          </div>
          <div>
            <TransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;