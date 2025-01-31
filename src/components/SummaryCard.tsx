import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  trend,
  trendUp,
}: SummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{amount}</p>
    </motion.div>
  );
};