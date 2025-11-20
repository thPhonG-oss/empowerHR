import EmployeeLayout from "../../components/layout/EmployeeLayout";
import DashboardEmployee from "../../pages/employee/Dashboard";
import RoleRoute from "../RoleRoute";

const employeeRoutes = [
  {
    path: "/employee",
    element: (
      <RoleRoute allowedRoles={["EMPLOYEE"]}>
        <EmployeeLayout />
      </RoleRoute>
    ),
    children: [{ path: "dashboard", element: <DashboardEmployee /> }],
  },
];

export default employeeRoutes;
