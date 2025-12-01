import EmployeeLayout from "../../components/layout/EmployeeLayout";
import DashboardEmployee from "../../pages/employee/Dashboard";
import DetailProfile from "../../pages/common/DetailProfile";
import EditProfile from "../../pages/common/EditProfile";
import Attendance from "../../pages/employee/Attendance";
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
      { path: "attendance", element: <Attendance /> },
    ],
  },
];

export default employeeRoutes;
