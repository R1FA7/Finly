import { ArrowTrendingUpIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { useTransactionManager } from "../../../hooks/useTransactionManager.js";
import { TransactionPage } from "./TransactionPage.jsx";
export const IncomePage = () => {
  const transactionManager = useTransactionManager("income");

  const summaryCardConfig = {
    summaryCardClass: {
      card1: "bg-green-50 border border-green-200 text-green-600 w-full",
      card2: "bg-green-100 border border-green-300 text-green-700 w-full",
    },
    icon1: <ArrowTrendingUpIcon />,
    icon2: <TrophyIcon />,
    label1: "Total Income",
    label2: "Max Income",
  };

  return (
    <TransactionPage
      transactionType="income"
      useTransactionHook={transactionManager}
      summaryCardConfig={summaryCardConfig}
    />
  );
};
