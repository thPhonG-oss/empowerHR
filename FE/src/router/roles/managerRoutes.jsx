import ManagerLayout from "../../components/layout/ManagerLayout";
import DashboardManager from "../../pages/manager/Dashboard";
import ManagerEmployeeList from "../../pages/manager/EmployeeList";
import DetailProfile from "../../pages/common/DetailProfile";
import EditProfile from "../../pages/common/EditProfile";
import RoleRoute from "../RoleRoute";

const managerRoutes = [
  {
    path: "/manager",
    element: (
      <RoleRoute allowedRoles={["MANAGER"]}>
        <ManagerLayout />
      </RoleRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardManager /> },
      { path: "profile", element: <DetailProfile /> },
      { path: "profile/edit", element: <EditProfile /> },
      { path: "team-management", element: <ManagerEmployeeList /> },
      { path: "team-management/:employeeId", element: <DetailProfile /> },
    ],
  },
];

export default managerRoutes;
