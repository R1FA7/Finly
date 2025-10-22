import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/loaders/LoadingSpinner.jsx";
import { Notification } from "../components/Notification";
import { AppContext } from "../context/AppContext";
import { useLoader } from "../hooks/useLoader.js";
import { API_PATHS } from "../utils/apiPaths.js";
import axiosInstance from "../utils/axiosInstance";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user, setAnnouncements, announcements } = useContext(AppContext);
  const { loading, withLoading } = useLoader();
  const [goals, setGoals] = useState({
    income: null,
    expense: null,
  });

  //auto remove unclossed notif after logout
  useEffect(() => {
    if (!user) {
      setShowIncomeNotification(false);
      setShowExpenseNotification(false);
    }
  }, [user]);

  const [showIncomeNotification, setShowIncomeNotification] = useState(false);
  const [showExpenseNotification, setShowExpenseNotification] = useState(false);

  const fetchNotificationData = async () => {
    try {
      const [goalRes, msgRes] = await Promise.all([
        axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA),
        axiosInstance.get(API_PATHS.AUTH.EXTRACT_MSG),
      ]);
      if (goalRes.data.success) {
        const { income, expense } = goalRes.data.data.goals;
        setGoals({ income, expense });
        if (
          income?.remaining < 0 &&
          localStorage.getItem("dismissed-income-notification") !== "true"
        ) {
          setShowIncomeNotification(true);
        }

        if (
          expense?.remaining < 0 &&
          localStorage.getItem("dismissed-expense-notification") !== "true"
        ) {
          setShowExpenseNotification(true);
        }
      } else console.errror("GOAL FAILED");
      if (msgRes.data.success) {
        setAnnouncements(msgRes?.data?.data);
      } else console.error("MSG FAILED");
    } catch (error) {
      toast.error("Failed to load dashboard's goal info");
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (!user) return;
    withLoading(async () => {
      await fetchNotificationData();
    });
  }, []);

  // Handle dismissal of announcements from the database
  const handleClose = async (messageId) => {
    try {
      const res = await axiosInstance.patch(API_PATHS.AUTH.DISMISS_MSG, {
        msgId: messageId, // backend expects msgId
      });
      if (res.data.success) {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (announcement) => announcement._id !== messageId
          )
        );
      }
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-136px)] text-center px-4 relative">
      {/* notification container(needed for showing 2 notification together)  */}
      {/* container remains top-25 but notification comes space-y-3  */}
      <div className="absolute bottom-10 left-5 z-50 space-y-3 pointer-events-none">
        {["income", "expense"].map((type) => {
          const goal = goals?.[type];
          const showNotification =
            type === "income"
              ? showIncomeNotification
              : showExpenseNotification;

          return (
            goal &&
            showNotification && (
              <Notification
                key={type}
                type={type}
                exceededBy={Math.abs(goal?.remaining)}
                onClose={() => {
                  //to show again in next login period again if not dismissed/seen
                  localStorage.setItem(
                    `dismissed-${type}-notification`,
                    "true"
                  );
                  type === "income"
                    ? setShowIncomeNotification(false)
                    : setShowExpenseNotification(false);
                }}
              />
            )
          );
        })}
        {announcements?.map((announcement) => (
          <Notification
            type="general"
            key={announcement._id}
            messageId={announcement._id}
            onClose={(messageId) => handleClose(messageId)}
            callFor="announcement"
            content={announcement.content}
          />
        ))}
      </div>

      <h3 className="text-lg text-gray-700 dark:text-gray-200 max-w-xl mb-2">
        Hey {user ? String(user.name).toUpperCase() : "there"}
      </h3>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 dark:text-gray-200">
        Welcome to Finly
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-2 dark:text-gray-300">
        Smarter financial tracking. Spend smart. Save smarter.
      </p>
      <Button onClick={() => navigate("/dashboard")}>Get Started</Button>
    </div>
  );
};
