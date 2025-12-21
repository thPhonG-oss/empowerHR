import AdminLayout from "../../components/layout/AdminLayout";
import DashboardAdmin from "../../pages/admin/Dashboard";
import EmployeeManagement from "../../pages/admin/EmployeeManagement";
import DetailProfile from "../../pages/common/DetailProfile";
import EditProfile from "../../pages/common/EditProfile";
import AccountManagement from "../../pages/admin/AccountManagement";
import RunningActivityManagement from "../../pages/admin/ActivityAManagement";
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
      { path: "employee-management/:employeeId", element: <DetailProfile /> },
      {
        path: "employee-management/:employeeId/edit",
        element: <EditProfile />,
      },
      { path: "employee-accounts", element: <AccountManagement /> },
      {
        path: "activity-management",
        element: <RunningActivityManagement />,
      },
      // thêm các route admin khác ở đây
    ],
  },
];

export default adminRoutes;
