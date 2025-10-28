import {
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useTransactionManager } from "../../../hooks/useTransactionManager";
import { TransactionPage } from "./TransactionPage";

export const ExpensePage = () => {
  const transactionManager = useTransactionManager("expense");

  const summaryCardConfig = {
    summaryCardClass: {
      card1: "bg-red-50 border border-red-200 text-red-600 w-full",
      card2: "bg-red-100 border border-red-300 text-red-700 w-full",
    },
    icon1: <ArrowTrendingDownIcon />,
    icon2: <ExclamationTriangleIcon />,
    label1: "Total Expense",
    label2: "Max Expense",
  };

  return (
    <TransactionPage
      transactionType="expense"
      useTransactionHook={transactionManager}
      summaryCardConfig={summaryCardConfig}
    />
  );
};
