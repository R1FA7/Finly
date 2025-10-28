import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CurrencyBangladeshiIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { SummaryCard } from "../../common/components/SummaryCard";
import { TransactionList } from "../../common/components/TransactionList";
import { AccordionBreakdown } from "../components/AccordionBreakdown";

export const OverviewPage = () => {
  const { adminDashboardData, adminMessages } = useOutletContext();
  const [showAccordionDown, setShowAccordionDown] = useState({
    weekly: true,
    monthly: false,
    yearly: false,
  });

  return (
    <div>
      <h1 className="text-4xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
        Overview
      </h1>
      {/* Summary Cards */}
      <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
        <SummaryCard
          icon={<UserGroupIcon />}
          title="Total Users"
          value={adminDashboardData?.users.length}
          moneyIcon={false}
          className="bg-slate-50 border border-slate-200 text-slate-800"
        />
        <SummaryCard
          icon={<ArrowTrendingUpIcon />}
          title="Total Income"
          value={adminDashboardData?.totalIncomeExpense?.[1]?.totalAmount}
          className="bg-green-50 border border-green-200 text-green-600"
        />
        <SummaryCard
          icon={<ArrowTrendingDownIcon />}
          title="Total Expense"
          value={adminDashboardData?.totalIncomeExpense?.[0]?.totalAmount}
          className="bg-red-50 border border-red-200 text-red-600"
        />
        <SummaryCard
          icon={<ArrowTrendingUpIcon />}
          title="Active Messages"
          value={adminMessages.filter((msg) => msg.isActive === true).length}
          className="bg-blue-50 border border-blue-200 text-blue-600"
        />
      </div>

      {/* Flex Layout Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Transaction + Sources */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              🧾 Recent Transactions
            </h2>
            <TransactionList
              transactions={adminDashboardData?.recentLogs}
              callFrom="adminPage"
            />
          </div>

          {/* Top Sources */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              <ArrowPathRoundedSquareIcon className="w-5 h-5 inline mr-2 text-gray-800 dark:text-white" />
              Top Sources
            </h3>
            <div className="divide-y divide-gray-300 dark:divide-gray-700 mt-4">
              {adminDashboardData?.commonSources.map((source, idx) => (
                <div
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  {/* Source Info */}
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {source._id.source}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      {source._id.type}
                    </p>
                  </div>

                  {/* Amount + Count */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <CurrencyBangladeshiIcon className="w-5 h-5 inline mr-1" />
                      {Number(source.totalAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-500">
                      {source.count} txns
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Accordion Section */}
        <div className="w-full lg:w-1/2 lg:h-fit bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            🔥 What’s Trending
          </h2>

          <AccordionBreakdown
            isOpen={showAccordionDown.weekly}
            data={adminDashboardData?.breakdowns?.weekly}
            type="Weekly"
            onToggle={() =>
              setShowAccordionDown((prev) => ({
                ...prev,
                weekly: !prev.weekly,
              }))
            }
          />
          <AccordionBreakdown
            isOpen={showAccordionDown.monthly}
            data={adminDashboardData?.breakdowns?.monthly}
            type="Monthly"
            onToggle={() =>
              setShowAccordionDown((prev) => ({
                ...prev,
                monthly: !prev.monthly,
              }))
            }
          />
          <AccordionBreakdown
            isOpen={showAccordionDown.yearly}
            data={adminDashboardData?.breakdowns?.yearly}
            type="Yearly"
            onToggle={() =>
              setShowAccordionDown((prev) => ({
                ...prev,
                yearly: !prev.yearly,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};
