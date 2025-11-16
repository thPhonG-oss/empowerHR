import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

import Login from "../pages/auth/Login";

// Admin
import DashboardAdmin from "../pages/admin/Dashboard";

// Manager
import DashboardManager from "../pages/manager/Dashboard";

// Employee
import DashboardEmployee from "../pages/employee/Dashboard";

export default function AppRouter() {
  return (
    <Routes>
      {/* Route không cần đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Route cần đăng nhập */}
      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <DashboardAdmin />
          </RoleRoute>
        }
      />

      {/* Manager */}
      <Route
        path="/manager/dashboard"
        element={
          <RoleRoute allowedRoles={["MANAGER"]}>
            <DashboardManager />
          </RoleRoute>
        }
      />

      {/* Employee */}
      <Route
        path="/employee/dashboard"
        element={
          <RoleRoute allowedRoles={["EMPLOYEE"]}>
            <DashboardEmployee />
          </RoleRoute>
        }
      />
    </Routes>
  );
}
