import { getNavByRole } from "../../utils/navigation";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState, useRef } from "react";
import authApi from "../../api/authApi";
import { getMyName } from "../../utils/employeeUtils";

import { Link, useLocation } from "react-router-dom";

import { Users, CircleUser, LogOut, KeyRound, ChevronUp } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

function Sidebar() {
  const { role, logout } = useContext(AuthContext);
  const navItems = getNavByRole(role.toLowerCase());
  const [currentPath, setCurrentPath] = useState("");
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    setCurrentPath(location.pathname);

    const fetchUserName = async () => {
      const name = await getMyName();
      if (name) {
        setUserName(name);
      }
    };

    fetchUserName();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="sticky top-0 w-full h-screen flex flex-col justify-between bg-white shadow-2xl border-r border-gray-200">
        {/* Header */}
        <div
          onClick={handleReload}
          className="h-20 flex p-6 items-center gap-3 border-b border-gray-200 cursor-pointer shrink-0"
        >
          <div className="bg-black p-2.5 rounded-xl shadow-lg transition-transform hover:scale-105">
            <Users className="text-white" size={24} />
          </div>
          <p className="font-bold text-xl tracking-wide text-gray-900">
            HRSYSTEM
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {role.toLowerCase() === "manager" ? (
            <div className="flex flex-col px-3 py-6 gap-1">
              {navItems.map((item) => {
                const sectionTitles = {
                  profile: "Tác vụ cá nhân",
                  "team-management": "Quản lý đội nhóm",
                };

                const sectionTitle = sectionTitles[item.path];

                return sectionTitle ? (
                  <div key={item.title} className="mt-2">
                    <p className="px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider border-t border-gray-200 mt-3 pt-4">
                      {sectionTitle}
                    </p>

                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        currentPath.includes(item.path)
                          ? "bg-black text-white shadow-lg font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-1"
                      }`}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      currentPath.includes(item.path)
                        ? "bg-black text-white shadow-lg font-semibold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-1"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col px-3 py-6 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentPath.includes(item.path)
                      ? "bg-black text-white shadow-lg font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-1"
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User - Actions */}
        <div
          ref={userMenuRef}
          className="border-t border-gray-200 bg-gray-50 relative shrink-0"
        >
          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-3 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => {
                  setShowModal(true);
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <KeyRound size={18} className="text-gray-500" />
                <span className="text-sm font-medium">Đổi mật khẩu</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 cursor-pointer"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>
          )}

          {/* User Info - Clickable */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex justify-between p-5 items-center gap-3 hover:bg-gray-100 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-gray-800 to-black p-2 rounded-full shadow-md">
                <CircleUser size={28} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">
                  {role === "employee"
                    ? "Nhân viên"
                    : role === "manager"
                    ? "Quản lý"
                    : role === "admin"
                    ? "Admin"
                    : ""}
                </p>
              </div>
            </div>
            <ChevronUp
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userName={userName}
      />
    </>
  );
}

export default Sidebar;
