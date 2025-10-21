import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { LoadingSpinner } from "./loaders/LoadingSpinner";

const ProtectedRoute = ({ requiredPermission, children }) => {
  const { isLoggedIn, loading, permissions } = useContext(AppContext);
  console.log("loading:", loading, "isLoggedIn:", isLoggedIn);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  //permissions->Currnetly logged in user's role permission
  //requiredPermission->permission needs to end this route
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    toast.error("You dont have permission to access the requested page.");
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
