import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const CanAccess = ({ permission, children, fallback = null }) => {
  const { permissions = [] } = useContext(AppContext);

  if (!permissions.includes(permission)) {
    return fallback;
  }

  return children;
};

export default CanAccess;
