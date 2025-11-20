import ManagerLayout from "../../components/layout/ManagerLayout";
import DashboardManager from "../../pages/manager/Dashboard";
import RoleRoute from "../RoleRoute";

const managerRoutes = [
  {
    path: "/manager",
    element: (
      <RoleRoute allowedRoles={["MANAGER"]}>
        <ManagerLayout />
      </RoleRoute>
    ),
    children: [{ path: "dashboard", element: <DashboardManager /> }],
  },
];

export default managerRoutes;
