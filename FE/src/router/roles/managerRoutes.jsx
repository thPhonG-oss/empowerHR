import ManagerLayout from "../../components/layout/ManagerLayout";
import DashboardManager from "../../pages/manager/Dashboard";
import ManagerEmployeeList from "../../pages/manager/EmployeeList";
import DetailProfile from "../../pages/common/DetailProfile";
import EditProfile from "../../pages/common/EditProfile";
import Attendance from "../../pages/employee/Attendance";
import LeaveRequest from "../../pages/employee/LeaveRequest";
import HistoryRequests from "../../pages/employee/HistoryRequests";

import RoleRoute from "../RoleRoute";
import RequestManagement from "../../pages/manager/RequestManagement";
//import RequestManagementDetail from "../../pages/manager/RequestManagementDetail";
//import RequestManagementHistory from "../../pages/manager/RequestManagementHistory";

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
      { path: "attendance", element: <Attendance /> },
      { path: "leave", element: <LeaveRequest /> },
      { path: "request-history", element: <HistoryRequests /> },
      { path: "request-management", element: <RequestManagement /> },
    ],
  },
];

export default managerRoutes;
