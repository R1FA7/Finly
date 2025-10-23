import {
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/loaders/LoadingSpinner";
import { AppContext } from "../../../context/AppContext";
import { useLoader } from "../../../hooks/useLoader";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { AdminNavbar } from "../components/AdminNavbar";

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: <MegaphoneIcon className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "Users",
    icon: <UserGroupIcon className="w-5 h-5" />,
  },
  // Add more nav items here
];

export const AdminPage = () => {
  const navigate = useNavigate();
  const { loading, withLoading } = useLoader();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminDashboardData, setAdminDashboardData] = useState();
  const [adminMessages, setAdminMessages] = useState([]);
  const { user } = useContext(AppContext);
  const fetchAdminDashboardData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL);
      if (res.data.success) {
        console.log(res.data);
        setAdminDashboardData(res.data);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data", error);
    }
  };

  const fetchAdminMessages = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.GET_ADMIN_MSG);
      if (res.data.success) {
        // toast.success("Fetched all admin message successfully");
        setAdminMessages(res?.data?.data);
        console.log(res?.data?.data);
      }
    } catch (error) {
      console.error("Error getting messages", error);
      toast.error("Error fetching admin messages");
    }
  };
  useEffect(() => {
    withLoading(async () => {
      await fetchAdminMessages();
      await fetchAdminDashboardData();
    });
  }, []);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/admin/${tabId}`);
  };
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row">
      <AdminNavbar
        navItems={navItems}
        activeTab={activeTab}
        onNavClick={(tabId) => handleNavClick(tabId)}
      />
      <main className="flex-1 p-6 overflow-y-hidden bg-white dark:bg-gray-900 mt-2">
        <h1 className="text-4xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          {activeTab === "overview" && "Overview"}
          {activeTab === "announcements" && "Announcements"}
          {activeTab === "users" && "Users"}
        </h1>
        <Outlet
          context={{
            adminDashboardData,
            user,
            adminMessages,
            fetchAdminDashboardData,
            fetchAdminMessages,
          }}
        />
      </main>
    </div>
  );
};
