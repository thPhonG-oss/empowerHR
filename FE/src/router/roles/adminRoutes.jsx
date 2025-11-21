import AdminLayout from "../../components/layout/AdminLayout";
import DashboardAdmin from "../../pages/admin/Dashboard";
import StaffManagement from "../../pages/admin/StaffManagement";

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
      { path: "staff-management", element: <StaffManagement /> },

      // thêm các route admin khác ở đây
    ],
  },
];

export default adminRoutes;
