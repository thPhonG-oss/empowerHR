import { getNavByRole } from "../../utils/navigation";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import authApi from "../../api/authApi";

import { Link, useLocation } from "react-router-dom";

import { Users, CircleUser, LogOut } from "lucide-react";

function Sidebar() {
  const { role, logout } = useContext(AuthContext);
  const navItems = getNavByRole(role.toLowerCase());
  const [currentPath, setCurrentPath] = useState("");
  const [userName, setUserName] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname.split("/").pop());
    setUserName(localStorage.getItem("userName") || "");
  }, [location]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sticky top-0 w-full h-screen flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="max-h-20 flex p-4 items-center gap-3 border-b border-gray-300">
          <div className="text-white bg-black p-3 rounded-md">
            <Users />
          </div>
          <p className="font-extrabold">HRSYSTEM</p>
        </div>
        {/* Content */}
        {/* Nếu là manager */}
        {role.toLowerCase() === "manager" ? (
          <div className="flex flex-col px-2 py-4">
            {navItems.map((item) => {
              const sectionTitles = {
                profile: "Tác vụ cá nhân",
                "team-management": "Quản lý đội nhóm",
              };

              const sectionTitle = sectionTitles[item.path];

              return sectionTitle ? (
                <div key={item.title}>
                  <p className="p-2 font-bold text-[#595959] text-sm border-t border-gray-400 mt-1">
                    {sectionTitle}
                  </p>

                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 ${
                      currentPath === item.path ? "bg-gray-400" : ""
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-semibold">{item.title}</span>
                  </Link>
                </div>
              ) : (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 ${
                    currentPath === item.path ? "bg-gray-400" : ""
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="font-semibold">{item.title}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 ${
                  currentPath === item.path ? "bg-gray-400" : ""
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-semibold">{item.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* User - Logout */}
      <div className="flex justify-between p-4 items-center gap-3 border-t border-gray-300 ">
        <div className="flex items-center gap-3">
          <div>
            <CircleUser size={32} />
          </div>
          <div>
            <p className="font-bold">{userName}</p>
            <p>
              {role === "EMPLOYEE"
                ? "Nhân viên"
                : role === "MANAGER"
                ? "Quản lý"
                : role === "ADMIN"
                ? "Admin"
                : ""}
            </p>
          </div>
        </div>
        <div>
          <LogOut
            onClick={handleLogout}
            className="cursor-pointer hover:text-red-600"
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
