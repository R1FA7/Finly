import {
  ArrowDownTrayIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "./Button";
import { TransactionCard } from "./TransactionCard";

export const TransactionList = ({
  type = "transactions",
  transactions = [],
  onEdit,
  onDelete,
  onExcelDownload,
  callFrom = "incomePage",
}) => {
  const INIT_VISIBLE = 4;
  const SHOW_MORE_STEP = 3;
  const MAX_VISIBLE = 7;
  const [visibleCount, setVisibleCount] = useState(INIT_VISIBLE);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShowMore = () => {
    const newCnt = Math.min(visibleCount + SHOW_MORE_STEP, transactions.length);
    setVisibleCount(newCnt);
    if (newCnt >= MAX_VISIBLE || newCnt >= transactions.length)
      setIsExpanded(true);
  };
  const handleCollapse = () => {
    setVisibleCount(INIT_VISIBLE);
    setIsExpanded(false);
  };

  if (transactions.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No {type} found.</p>;
  }
  return (
    <div className="flex-col space-y-3">
      {transactions.slice(0, visibleCount).map((txn) => (
        <TransactionCard
          key={txn._id}
          transaction={txn}
          onEdit={onEdit}
          onDelete={onDelete}
          callFrom={callFrom}
        />
      ))}
      <div className="text-center mt-4">
        {visibleCount < transactions.length && (
          <Button onClick={handleShowMore}>
            <ChevronDoubleDownIcon className="w-5 h-5" />
            Show more
          </Button>
        )}

        {isExpanded && visibleCount > INIT_VISIBLE && (
          <div className="flex justify-center mt-2 space-x-2">
            <Button onClick={handleCollapse}>
              {" "}
              <ChevronDoubleUpIcon className="w-5 h-5" /> Collapse
            </Button>
            <Button onClick={onExcelDownload}>
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
