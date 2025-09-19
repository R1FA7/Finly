import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AppContext);
  console.log("loading:", loading, "isLoggedIn:", isLoggedIn);

  if (loading) {
    return (
      <div className="text-white h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
