import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { SummaryCard } from "@/components/SummaryCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [balance, setBalance] = useState(4550);
  const [income, setIncome] = useState(2250);
  const [expenses, setExpenses] = useState(1180);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [tempValues, setTempValues] = useState({ balance, income, expenses });
  const { toast } = useToast();

  const handleSave = () => {
    if (Number(tempValues.expenses) > Number(tempValues.income)) {
      toast({
        title: "Warning",
        description: "Expenses cannot be greater than income.",
        variant: "destructive",
      });
      return;
    }

    setBalance(Number(tempValues.balance));
    setIncome(Number(tempValues.income));
    setExpenses(Number(tempValues.expenses));
    setShowEditDialog(false);
    
    toast({
      title: "Success",
      description: "Financial summary updated successfully.",
    });
  };

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
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Update Summary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Financial Summary</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Balance</label>
                  <Input
                    type="number"
                    value={tempValues.balance}
                    onChange={(e) => setTempValues({ ...tempValues, balance: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Income</label>
                  <Input
                    type="number"
                    value={tempValues.income}
                    onChange={(e) => setTempValues({ ...tempValues, income: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expenses</label>
                  <Input
                    type="number"
                    value={tempValues.expenses}
                    onChange={(e) => setTempValues({ ...tempValues, expenses: Number(e.target.value) })}
                  />
                </div>
                <Button className="w-full" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Balance"
            amount={`$${balance.toFixed(2)}`}
            icon={Wallet}
            trend="+12.5%"
            trendUp={true}
          />
          <SummaryCard
            title="Income"
            amount={`$${income.toFixed(2)}`}
            icon={TrendingUp}
            trend="+8.2%"
            trendUp={true}
          />
          <SummaryCard
            title="Expenses"
            amount={`$${expenses.toFixed(2)}`}
            icon={TrendingDown}
            trend="+5.1%"
            trendUp={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExpenseChart expenses={expenses} income={income} />
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