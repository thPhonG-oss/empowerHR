import EmployeeLayout from "../../components/layout/EmployeeLayout";
import DashboardEmployee from "../../pages/employee/Dashboard";
import DetailProfile from "../../pages/common/DetailProfile";
import EditProfile from "../../pages/common/EditProfile";
import RoleRoute from "../RoleRoute";

const employeeRoutes = [
  {
    path: "/employee",
    element: (
      <RoleRoute allowedRoles={["EMPLOYEE"]}>
        <EmployeeLayout />
      </RoleRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardEmployee /> },
      { path: "profile", element: <DetailProfile /> },
      { path: "profile/edit", element: <EditProfile /> },
    ],
  },
];

export default employeeRoutes;
