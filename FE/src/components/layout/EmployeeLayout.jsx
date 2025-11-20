import Sidebar from "../common/Sidebar";
import { Outlet } from "react-router-dom";

export default function EmployeeLayout() {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Sidebar chiếm 3/12 cột */}
      <aside className="col-span-3 lg:col-span-2 bg-gray-100">
        <Sidebar role="EMPLOYEE" />
      </aside>

      {/* Content chiếm 9/12 cột */}
      <main className="col-span-9 lg:col-span-10 bg-white">
        <Outlet />
      </main>
    </div>
  );
}
