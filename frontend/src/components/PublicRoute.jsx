import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AppContext);

  if (isLoggedIn) {
    return user.role === "admin" ? (
      <Navigate to="/admin/overview" replace />
    ) : (
      <Navigate to="/home" replace />
    );
  }

  return children;
};

export default PublicRoute;
