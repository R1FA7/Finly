import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { LineBreakDownChart } from "../components/charts/LineBreakDownChart";
import { PieChartBreakdown } from "../components/charts/PieChart";
import { DashboardToolBar } from "../components/DashboardToolBar";
import { LoadingSpinner } from "../components/loaders/LoadingSpinner";
import { SetGoalCard } from "../components/SetGoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { useButtonLoader } from "../hooks/useButtonLoader";
import { useLoader } from "../hooks/useLoader";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

export const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState();
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const { loading, withLoading } = useLoader();
  const { btnLoadingMap, withBtnLoading } = useButtonLoader();

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  const fetchDashboardStats = async () => {
    try {
      const [incomeRes, expenseRes, dashboardRes] = await Promise.all([
        axiosInstance.get(API_PATHS.TRANSACTION.GET_ALL("income")),
        axiosInstance.get(API_PATHS.TRANSACTION.GET_ALL("expense")),
        axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA),
      ]);
      setDashboardStats(dashboardRes?.data?.data);
      setIncomeData(incomeRes?.data?.data);
      setExpenseData(expenseRes?.data?.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const fetchFilteredTxns = async (params = {}) => {
    withBtnLoading("filterTxns", async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA, {
          params,
        });
        setFilteredTxns(res?.data?.data?.searchFilteredTxns || []);
      } catch (err) {
        console.error("Failed to fetch filtered transactions", err);
      }
    });
  };

  useEffect(() => {
    withLoading(async () => {
      await fetchDashboardStats();
      await fetchFilteredTxns({ search, ...filters });
    });
  }, []);

  // Calculate source-wise breakdown
  const calculateSourceBreakdown = (data) => {
    const grouped = data.reduce((acc, { source, amount }) => {
      acc[source] = (acc[source] || 0) + amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([source, amount]) => ({ source, amount }))
      .sort((a, b) => b.amount - a.amount);
  };
  const incomeBreakdown = useMemo(
    () => calculateSourceBreakdown(incomeData),
    [incomeData]
  );

  const expenseBreakdown = useMemo(
    () => calculateSourceBreakdown(expenseData),
    [expenseData]
  );
  const handleSubmit = (txnData) => {
    withBtnLoading("submitTxns", async () => {
      const cleanedTxnData = {
        type: txnData.type,
        source: txnData.source,
        amount: txnData.amount,
        date: txnData.date,
      };
      try {
        const res = await axiosInstance.post(
          API_PATHS.TRANSACTION.ADD,
          cleanedTxnData
        );
        if (res.data.success) {
          toast.success(`${txnData.type} data added successfully`);
          await fetchDashboardStats();
          await fetchFilteredTxns({ search, ...filters });
          setShowForm(false);
        } else {
          toast.error("Server Error. Try again.");
        }
      } catch (err) {
        console.error("Error saving transaction", err);
        toast.error("Failed to save transaction. Try again.");
      }
    });
  };

  const handleDownload = () => {
    const choice = window.prompt(
      "Download what type of transactions?(income/expense/both)",
      "income"
    );
    if (!choice) return;

    withBtnLoading("downloadTxns", async () => {
      const downloadFile = async (type) => {
        try {
          const res = await axiosInstance.get(
            API_PATHS.TRANSACTION.DOWNLOAD_EXCEL(type),
            { responseType: "blob" }
          );
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${type}_details.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log(res);
        } catch (err) {
          console.error("Error downloading file", err);
          toast.error("Failed to download the file. Please try again.");
        }
      };
      if (choice === "both") {
        await downloadFile("income");
        await downloadFile("expense");
      } else if (["income", "expense"].includes(choice)) {
        await downloadFile(choice);
      } else {
        toast.error("Invalid option.");
      }
    });
  };

  const handleSearch = (query) => {
    setSearch(query);
    fetchFilteredTxns({ search: query, ...filters });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredTxns({ search, ...newFilters });
  };

  const handleSaveGoal = async (goal) => {
    try {
      const res = await axiosInstance.post(API_PATHS.GOAL.CU_GOAL, goal);
      if (res?.data?.success) {
        console.log("Goal saved", res?.data?.data);
        //can't depend on dashboardStats as async so needed to do updatedStats var
        const updatedStats = await fetchDashboardStats();
        const incomeRemaining = updatedStats?.goals?.income?.remaining;
        const expenseRemaining = updatedStats?.goals?.expense?.remaining;
        toast.success(res?.data?.message);
        //If again updated goal && still exceedeed show again
        if (incomeRemaining < 0) {
          localStorage.setItem("dismissed-income-notification", "false");
        }
        if (expenseRemaining < 0) {
          localStorage.setItem("dismissed-expense-notification", "false");
        }
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.error("Error saving goal", error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="m-2">
        <h1 className="text-4xl font-bold text-slate-800 mb-2 text-center gap-2 dark:bg-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-500 text-center dark:text-gray-400 ">
          Track your income, expenses, and manage your finances effectively.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200 relative dark:bg-gray-900 dark:text-gray-100">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-slate-700 transform text-white flex items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Transaction
        </Button>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-center gap-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 lg:grid-cols-5 lg:gap-2 md:w-full">
            <SummaryCard
              icon={<ScaleIcon />}
              title="Total Balance"
              value={dashboardStats?.totalBalance}
              className="bg-slate-50 border border-slate-200 text-slate-800 "
            />
            <SummaryCard
              icon={<ArrowTrendingUpIcon />}
              title="Total Income"
              value={dashboardStats?.totalIncome}
              className="bg-green-50 border border-green-200 text-green-600 "
            />
            <SummaryCard
              icon={<ArrowTrendingDownIcon />}
              title="Total Expense"
              value={dashboardStats?.totalExpense}
              className="bg-red-50 border border-red-200 text-red-600"
            />
            <SummaryCard
              icon={<ArrowTrendingUpIcon />}
              title="Income (7d)"
              value={
                dashboardStats?.incomeVsExpense?.weekly?.income?.total || 0
              }
              className="bg-green-50 border border-green-200 text-green-600 "
            />
            <SummaryCard
              icon={<ArrowTrendingDownIcon />}
              title="Expense (7d)"
              value={
                dashboardStats?.incomeVsExpense?.weekly?.expense?.total || 0
              }
              className="bg-red-50 border border-red-200 text-red-600 w-"
            />
            {/* <SummaryCard
              icon={<ArrowTrendingUpIcon />}
              title="Income Last 30 Days"
              value={
                dashboardData?.incomeVsExpense?.monthly?.income?.total || 0
              }
              className="bg-green-50 border border-green-200 text-green-600 min-w-[150px]"
            />
            <SummaryCard
              icon={<ArrowTrendingDownIcon />}
              title="Expense Last 30 Days"
              value={
                dashboardData?.incomeVsExpense?.monthly?.expense?.total || 0
              }
              className="bg-red-50 border border-red-200 text-red-600 min-w-[150px]"
            /> */}
          </div>
        </div>
      </div>
      {showForm && (
        <TransactionForm
          typeSelectDisabled={false}
          onSubmit={(t) => handleSubmit(t)}
          onClose={() => setShowForm(false)}
          loading={btnLoadingMap.submitTxns}
        />
      )}
      <div className="bg-white rounded-lg shadow-md p-6 mx-2 mb-4 mt-8 border border-gray-200 dark:bg-gray-900 dark:text-gray-100">
        {/* Title and Description */}
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-slate-800 dark:bg-gray-900 dark:text-gray-100">
            Set Your Goal
          </p>
          <p className="mt-3 text-gray-600 text-sm max-w-md mx-auto dark:bg-gray-900 dark:text-gray-400">
            Define your savings target and track your progress effectively.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <SetGoalCard
              data={
                dashboardStats?.goals?.expense || {
                  goalAmount: 0,
                  currentAmount: 0,
                }
              }
              type={"expense"}
              onSubmitGoal={(goal) => handleSaveGoal(goal)}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <SetGoalCard
              data={
                dashboardStats?.goals?.income || {
                  goalAmount: 0,
                  currentAmount: 0,
                }
              }
              type={"income"}
              onSubmitGoal={(goal) => handleSaveGoal(goal)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mx-1.5 mb-1.5 mt-8 border border-gray-200 dark:bg-gray-900">
        <DashboardToolBar
          onSearch={(query) => handleSearch(query)}
          onFilterChange={(newFilters) => handleFilterChange(newFilters)}
          onDownload={() => handleDownload()}
          sourceOptions={{
            income: dashboardStats?.incomeSources || [],
            expense: dashboardStats?.expenseSources || [],
            all: [
              ...(dashboardStats?.incomeSources || []),
              ...(dashboardStats?.expenseSources || []),
            ],
          }}
          loading={btnLoadingMap}
        />
        <TransactionList
          transactions={filteredTxns}
          onExcelDownload={() => handleDownload()}
          callFrom={"dashboard"}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mx-1.5 mb-1.5 mt-8 border border-gray-200 relative dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Income Vs Expense Breakdown
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Visual representation of income and expense amount in last week
        </p>
        <LineBreakDownChart data={dashboardStats?.breakdowns?.weekly} />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mx-2 my-6 border border-gray-200 relative dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2 text-center dark:text-white">
          Source-wise Income & Expense Breakdown
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6 dark:text-gray-400">
          Visual representation of how your money flows in and out.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          <div className="w-full md:w-1/2">
            <h3 className="text-center font-semibold text-green-600 dark:text-green-400 mb-2">
              Income
            </h3>
            <div className="h-[240px]">
              <PieChartBreakdown data={incomeBreakdown} />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-center font-semibold text-red-600 dark:text-red-400 mb-2">
              Expense
            </h3>
            <div className="h-[240px]">
              <PieChartBreakdown data={expenseBreakdown} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
