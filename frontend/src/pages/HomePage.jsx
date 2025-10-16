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
  const { user } = useContext(AppContext);
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

  const fetchGoalData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      if (res.data.success) {
        const { income, expense } = res.data.data.goals;
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
      }
    } catch (error) {
      toast.error("Failed to load dashboard's goal info");
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (!user) return;
    withLoading(async () => {
      await fetchGoalData();
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 relative dark:bg-gray-900">
      {/* notification container(needed for showing 2 notification together)  */}
      {/* container remains top-25 but notification comes space-y-3  */}
      <div className="absolute bottom-10 left-5 z-50 space-y-3">
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
