import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useContext(AuthContext);
  // 1. Nếu chưa đăng nhập
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu không có quyền truy cập
  if (!allowedRoles.includes(role)) {
    console.log("không có quyền");
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Có quyền -> Render component
  return children;
}

export default RoleRoute;
