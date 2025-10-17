import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { useButtonLoader } from "./useButtonLoader";
import { useLoader } from "./useLoader";

export const useTransactionManager = 
(transactionType) => {

  const [transactionData, setTransactionData] = useState([])
  const [dashboardData, setDashboardData] = useState();
  const [searchKey, setSearchKey] = useState("")
  const [debouncedSearchKey,setDebouncedSearchKey] = useState("")
  const [searchActive, setSearchActive]=  useState(false)
  const [showSrchSuggestions, setShowSrchSuggestions] = useState(false)
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [editingTxn, setEditingTxn] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("weekly")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedTxnId,setSelectedTxnId] = useState(null)//for delete

  const {loading, withLoading} = useLoader()
  const {btnLoadingMap, withBtnLoading} = useButtonLoader() 
  

  //fetch all txns & dashboard data
  const fetchTransactions = async() => {
    try {
      const [txnsRes, dashboardRes] = await Promise.all([
        axiosInstance.get(API_PATHS.TRANSACTION.GET_ALL(transactionType)),
        axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA)
      ])

      setTransactionData(txnsRes?.data?.data)
      console.log(txnsRes?.data?.data)
      setDashboardData(dashboardRes?.data?.data?.breakdowns)
    } catch (error) {
      console.error(`Error fetching ${transactionType} data`, error);
      toast.error(`Failed to load ${transactionType} data`);
    }
  }

  useEffect(()=>{
    withLoading(fetchTransactions)
  },[])

  // Calculate source-wise breakdown
  const sourceWiseBreakdown = useMemo(() => {
    const result = transactionData.reduce((acc, { source, amount }) => {
      acc[source] = (acc[source] || 0) + amount;
      return acc;
    }, {});

    return Object.entries(result)
      .map(([source, amount]) => ({ source, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactionData]);

  // Calculate totals
  const { total, maximum } = useMemo(() => {
    let total = 0;
    let maximum = 0;
    transactionData.forEach((item) => {
      total += item.amount;
      maximum = Math.max(maximum, item.amount);
    });
    return { total, maximum };
  }, [transactionData]);

  //Debounce search key(setting up key for suggestion after auto 300s) 
  useEffect(()=>{
    const tid = setTimeout(()=>{
      if(searchKey.trim().length>0 && !searchActive) setDebouncedSearchKey(searchKey.trim())
      else setDebouncedSearchKey("")
    },300)
    return ()=>clearTimeout(tid)
  },[searchKey, searchActive])

  // Show/hide suggestions dropdown
  useEffect(() => {
    setShowSrchSuggestions(debouncedSearchKey.length > 0 && !searchActive);
  }, [debouncedSearchKey, searchActive]);

  //Get filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (!debouncedSearchKey) return [];
    return transactionData.filter((txn) =>
      txn.source.toLowerCase().includes(debouncedSearchKey.toLowerCase())
    );
  }, [debouncedSearchKey, transactionData]);

  const handleSearch = () => {
    if (!searchKey.trim()) {
      setFilteredTransactions([]);
      setSearchActive(false);
      return;
    }

    const filtered = transactionData.filter((item) =>
      item.source.toLowerCase().includes(searchKey.toLowerCase())
    );

    setFilteredTransactions(filtered);
    setSearchActive(true);
    setShowSrchSuggestions(false);
    setDebouncedSearchKey("");
  }

  // Handle suggestion click
  const handleSuggestionClick = (source) => {
    setSearchKey(source);
    setSearchActive(true);
    setShowSrchSuggestions(false);

    const filtered = transactionData.filter((item) =>
      item.source.toLowerCase() === source.toLowerCase()
    );
    setFilteredTransactions(filtered);
  };

  // Clear search when search key is empty
  useEffect(() => {
    if (!searchKey || searchKey.trim() === "") {
      setFilteredTransactions([]);
      setSearchActive(false);
      setShowSrchSuggestions(false);
    }
  }, [searchKey]);

    // Handle form submission
  const handleSubmit = async (txnData) => {
    withBtnLoading("submitTransaction", async () => {
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
          toast.success(`${transactionType} updated successfully`);
        } else {
          await axiosInstance.post(API_PATHS.TRANSACTION.ADD, cleanedTxnData);
          toast.success(`${transactionType} added successfully!`);
        }

        await fetchTransactions();
        setFilteredTransactions([]);
        setSearchKey("");
        setShowForm(false);
        setEditingTxn(null);
        setSearchActive(false);
      } catch (err) {
        console.error(`Error saving ${transactionType}`, err);
        toast.error(`Failed to save ${transactionType}. Try again.`);
      }
    });
  };

  // Handle delete: 3 steps
  //step 1: show confirmation modal
  const handleRequestDelete = (id) => {
    setSelectedTxnId(id)
    setShowConfirmModal(true)
  }

  //step 2: cancel delete
  const handleCancelDelete = () => {
    setShowConfirmModal(false)
    setSelectedTxnId(null)
  }

  //step3 : nah delete that sh..
  const handleConfirmedDelete = async () =>{
    withBtnLoading("deleteTxn",async ()=>{
      try {
      const res = await axiosInstance.delete(
        API_PATHS.TRANSACTION.DELETE(selectedTxnId)
      );
      if (res.data.success) {
        await fetchTransactions();
        toast.success(res.data.message);
        setShowConfirmModal(false)
        setSelectedTxnId(null)
      }
    } catch (err) {
      console.error(`Error deleting ${transactionType}`, err);
      toast.error(`Failed to delete ${transactionType}`);
    }
    })
  }

  const handleDownloadExcel = async () => {
    const confirmDownload = window.confirm(
      `Download full ${transactionType} Excel file?`
    );
    if (!confirmDownload) return;
    withBtnLoading("downloadTxns",async ()=>{
      try {
        const res = await axiosInstance.get(
          API_PATHS.TRANSACTION.DOWNLOAD_EXCEL(transactionType),
          { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${transactionType}_details.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading file", err);
        toast.error("Failed to download the file. Please try again.");
      }
    })
  };

  // Handle edit
  const handleEdit = (txn) => {
    setEditingTxn(txn);
    setShowForm(true);
  };

  return {
    // State
    transactionData,
    searchKey,
    filteredTransactions,
    editingTxn,
    dashboardData,
    selectedFrequency,
    searchActive,
    showSrchSuggestions,
    showForm,
    filteredSuggestions,
    sourceWiseBreakdown,
    total,
    maximum,
    loading,
    btnLoadingMap,
    showConfirmModal,
    
    //state methods 
    setSearchKey,
    setSelectedFrequency,
    setShowForm,
    setShowSrchSuggestions,
    // Methods
    handleSearch,
    handleSuggestionClick,
    handleSubmit,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmedDelete,
    handleDownloadExcel,
    handleEdit,
  };

}