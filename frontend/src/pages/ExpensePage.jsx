import {
  ArrowDownTrayIcon,
  CurrencyBangladeshiIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { BarBreakdownChart } from "../components/charts/BarBreakDownChart.jsx";
import { HorizontalBarBreakdown } from "../components/charts/HorizontalBreakDownBar.jsx";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList.jsx";
import { API_PATHS } from "../utils/apiPaths.js";
import axiosInstance from "../utils/axiosInstance.js";
export const ExpensePage = () => {
  //Expense summary Block(simple just total & highest) more will in dashboard
  //Expense overview(Bar Chart)
  //search(Done) + filter(is it needed?)
  //Expense source(List all)(edit,delete)(Done)
  //Add + button (FORM)(Done)
  //Excel download button(done)
  //date range filter
  const [showForm, setShowForm] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [searchKey, setSearchKey] = useState();
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [editingTxn, setEditingTxn] = useState(null);
  const [eDashboardData, setEDashboardData] = useState();
  const [selectedFrequency, setSelectedFrequency] = useState("weekly");

  const fetchExpense = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.TRANSACTION.GET_ALL("expense")
      );
      console.log("expenseALL: ", res.data.data);
      const DashboardData = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DATA
      );
      const breakDowns = await DashboardData?.data?.data?.breakdowns;
      console.log(breakDowns);
      setEDashboardData(breakDowns);
      setExpenseData(res?.data?.data);
      console.log(DashboardData);
    } catch (error) {
      console.error("Error fetching expense data", error);
    }
  };
  useEffect(() => {
    fetchExpense();
  }, []);

  const sourceWiseExpense = useMemo(() => {
    const res = expenseData.reduce((acc, { source, amount }) => {
      acc[source] = (acc[source] || 0) + amount;
      return acc;
    }, {});
    console.log(res);
    return Object.entries(res)
      .map(([source, amount]) => ({ source, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenseData]);

  const { totalExpense, maxExpense } = useMemo(() => {
    let totalExpense = 0;
    let maxExpense = 0;
    expenseData.forEach((item) => {
      totalExpense += item.amount;
      maxExpense = Math.max(maxExpense, item.amount);
    });
    return { totalExpense, maxExpense };
  }, [expenseData]);
  const handleClick = () => {
    const query = searchKey.trim().toLowerCase();
    const filtered = expenseData.filter((item) =>
      item.source.toLowerCase().includes(query)
    );
    setFilteredExpense(filtered);
  };
  const handleSubmit = async (txnData) => {
    try {
      const cleanedTxnData = {
        type: txnData.type,
        source: txnData.source,
        amount: txnData.amount,
        date: txnData.date,
      };

      if (editingTxn) {
        await axiosInstance.put(
          API_PATHS.TRANSACTION.UPDATE(editingTxn._id),
          cleanedTxnData
        );
        toast.success("Expense updated successfully");
      } else {
        await axiosInstance.post(API_PATHS.TRANSACTION.ADD, cleanedTxnData);
        toast.success("Expense added successfully!");
      }
      await fetchExpense();
      setFilteredExpense([]);
      setSearchKey("");
      setShowForm(false);
      setEditingTxn(null);
    } catch (err) {
      console.error("Error saving transaction", err);
      toast.error("Failed to save transaction. Try again.");
    }
  };
  const handleDelete = async (txnId) => {
    try {
      const res = await axiosInstance.delete(
        API_PATHS.TRANSACTION.DELETE(txnId)
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchExpense();
      }
    } catch (err) {
      console.error("Error Deleting Expense", err);
    }
  };
  const handleDownloadExcel = async () => {
    //ask a popout box are want to download full expense excel file? if so go next
    const confirmDownload = window.confirm("Download full expense Excel file?");
    if (!confirmDownload) return;
    try {
      const res = await axiosInstance.get(
        API_PATHS.TRANSACTION.DOWNLOAD_EXCEL("expense"),
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
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
  useEffect(() => {
    if (!searchKey || searchKey.trim() === "") {
      setFilteredExpense([]);
    }
  }, [searchKey]);
  const handleEdit = (txn) => {
    console.log("HI");
    setEditingTxn(txn);
    setShowForm(true);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="p-5 bg-red-50 border border-red-200 rounded-lg text-center shadow hover:shadow-md transition w-60">
              <p className="text-sm text-gray-600">💵 Total Expense</p>
              <p className="text-3xl font-bold text-red-700 mt-1 flex justify-center items-center">
                <CurrencyBangladeshiIcon className="h-8 w-8 mr-1" />
                {totalExpense}
              </p>
            </div>

            {/* Highest Expense */}
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg text-center shadow hover:shadow-md transition min-w-[220px]">
              <p className="text-sm text-gray-600">📈 Highest Expense</p>
              <p className="text-3xl font-bold text-gray-600 mt-1 flex justify-center items-center">
                <CurrencyBangladeshiIcon className="h-8 w-8 mr-1" />
                {maxExpense}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Search Expense (e.g. Salary)"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <Button
            onClick={handleClick}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Search
          </Button>
        </div>
        <div className="flex justify-between mt-5 self-start md:self-center gap-4">
          <Button
            onClick={handleDownloadExcel}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download Expense
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add Expense
          </Button>
        </div>

        {showForm && (
          <div className="mt-4">
            <TransactionForm
              txnType={"expense"}
              typeSelectDisabled={true}
              initialData={editingTxn}
              onClose={() => {
                setShowForm(false);
                setEditingTxn(null);
              }}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200">
        <TransactionList
          type={"expense"}
          transactions={
            filteredExpense.length > 0 ? filteredExpense : expenseData
          }
          onEdit={(t) => handleEdit(t)}
          onDelete={(id) => handleDelete(id)}
          onDownloadExcel={() => handleDownloadExcel()}
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 m-1.5 border border-gray-200 relative">
        <select
          className="border-gray-900 absolute right-3 top-3 p-2 drop-shadow-emerald-900 rounded-lg font-semibold"
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value)}
        >
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
          <option value="yearly">yearly</option>
        </select>
        <BarBreakdownChart
          data={eDashboardData?.[selectedFrequency]?.map((d) => ({
            period: d.period,
            expense: d.expense,
          }))}
          type={"expense"}
          frequency={selectedFrequency}
          barColors={"#0ea5e9"}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 m-1.5 border border-gray-200">
        <HorizontalBarBreakdown data={sourceWiseExpense} type="expense" />
      </div>
    </div>
  );
};
