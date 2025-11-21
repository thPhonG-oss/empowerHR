import AdminLayout from "../../components/layout/AdminLayout";
import DashboardAdmin from "../../pages/admin/Dashboard";
import EmployeeManagement from "../../pages/admin/EmployeeManagement";
import AccountManagement from "../../pages/admin/AccountManagement";

import RoleRoute from "../RoleRoute";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <RoleRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </RoleRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardAdmin /> },
      { path: "employee-management", element: <EmployeeManagement /> },
      { path: "employee-accounts", element: <AccountManagement /> },

      // thêm các route admin khác ở đây
    ],
  },
];

export default adminRoutes;
