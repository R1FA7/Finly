import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { LineBreakDownChart } from "../components/charts/LineBreakDownChart";
import { DashboardToolBar } from "../components/DashboardToolBar";
import { SummaryCard } from "../components/SummaryCard";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
export const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState();
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const fetchDashboardStats = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      console.log("Fetched dashboard data:", res.data.data);
      setDashboardStats(res?.data?.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const fetchFilteredTxns = async (params = {}) => {
    try {
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA, {
        params,
      });
      setFilteredTxns(res?.data?.data?.searchFilteredTxns || []);
    } catch (err) {
      console.error("Failed to fetch filtered transactions", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchFilteredTxns({ search, ...filters });
  }, []);

  const handleSubmit = async (txnData) => {
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
        setShowForm(false);
      } else {
        toast.error("Server Error. Try again.");
      }
    } catch (err) {
      console.error("Error saving transaction", err);
      toast.error("Failed to save transaction. Try again.");
    }
  };

  const handleDownload = async () => {
    const choice = window.prompt(
      "Download what type of transactions?(income/expense/both)",
      "income"
    );
    if (!choice) return;
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
  };

  const handleSearch = (query) => {
    setSearch(query);
    fetchFilteredTxns({ search: query, ...filters });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredTxns({ search, ...newFilters });
  };

  return (
    <div className="">
      <div className="m-2">
        <h1 className="text-4xl font-bold text-slate-800 mb-2 text-center gap-2">
          Dashboard
        </h1>
        <p className="text-gray-500 text-center">
          Track your income, expenses, and manage your finances effectively.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200 relative">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-slate-700 transform text-white flex items-center gap-2 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Transaction
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 justify-center">
            <SummaryCard
              icon={<ScaleIcon />}
              title="Total Balance"
              value={dashboardStats?.totalBalance}
              className="bg-slate-50 border border-slate-200 text-slate-800 min-w-[150px]"
            />
            <SummaryCard
              icon={<ArrowTrendingUpIcon />}
              title="Total Income"
              value={dashboardStats?.totalIncome}
              className="bg-green-50 border border-green-200 text-green-600 min-w-[150px]"
            />
            <SummaryCard
              icon={<ArrowTrendingDownIcon />}
              title="Total Expense"
              value={dashboardStats?.totalExpense}
              className="bg-red-50 border border-red-200 text-red-600 min-w-[150px]"
            />
            <SummaryCard
              icon={<ArrowTrendingUpIcon />}
              title="Income Last 7 Days"
              value={
                dashboardStats?.incomeVsExpense?.weekly?.income?.total || 0
              }
              className="bg-green-50 border border-green-200 text-green-600 min-w-[150px]"
            />
            <SummaryCard
              icon={<ArrowTrendingDownIcon />}
              title="Expense Last 7 Days"
              value={
                dashboardStats?.incomeVsExpense?.weekly?.expense?.total || 0
              }
              className="bg-red-50 border border-red-200 text-red-600 min-w-[150px]"
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
        />
      )}
      <div className="bg-white rounded-lg shadow-md p-4 mx-1.5 mb-1.5 mt-8 border border-gray-200">
        <DashboardToolBar
          onSearch={(query) => handleSearch(query)}
          onFilterChange={(newFilters) => handleFilterChange(newFilters)}
          onDownload={() => handleDownload()}
          sourceOptions={["Salary", "Groceries", "Gift"]}
        />
        <TransactionList transactions={filteredTxns} callFrom={"dashboard"} />
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mx-1.5 mb-1.5 mt-8 border border-gray-200 relative">
        <LineBreakDownChart data={dashboardStats?.breakdowns?.weekly} />
      </div>
    </div>
  );
};
