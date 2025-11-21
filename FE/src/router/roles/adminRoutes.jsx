import AdminLayout from "../../components/layout/AdminLayout";
import DashboardAdmin from "../../pages/admin/Dashboard";
import EmployeeManagement from "../../pages/admin/EmployeeManagement";

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

      // thêm các route admin khác ở đây
    ],
  },
];

export default adminRoutes;
