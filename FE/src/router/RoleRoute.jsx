import { Navigate } from "react-router-dom";

function RoleRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("token");
  let user = {};

  try {
    user = JSON.parse(sessionStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  // Không có thì điều về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role không hợp lệ sẽ thông báo k có quyền truy cập
  if (!user.role || !allowedRoles.includes(user.role)) {
    // return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;
