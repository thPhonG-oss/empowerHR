import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";
import NotFoundPage from "../pages/auth/NotFoundPage";

import adminRoutes from "./roles/adminRoutes";
import managerRoutes from "./roles/managerRoutes";
import employeeRoutes from "./roles/employeeRoutes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Role cần token và phân quyền */}
      {adminRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element}>
          {route.children?.map((child, cidx) => (
            <Route key={cidx} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}

      {managerRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element}>
          {route.children?.map((child, cidx) => (
            <Route key={cidx} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}

      {employeeRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element}>
          {route.children?.map((child, cidx) => (
            <Route key={cidx} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
