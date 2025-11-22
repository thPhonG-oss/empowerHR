import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const navSimple = [
  { title: "Empower HR", path: "" },
  { title: "Empower HR", path: "login" },
  { title: "Empower HR", path: "change-password" },

  { title: "Trang chủ", path: "dashboard" },

  // ADMIN ONLY
  { title: "Quản lý gian hàng", path: "store-management" },
  { title: "Điểm thưởng", path: "rewards" },
  { title: "Quản lý nhân viên", path: "employee-management" },
  { title: "Tài khoản nhân viên", path: "employee-accounts" },
  { title: "Quản lý hoạt động", path: "activity-management" },
  { title: "Chính sách công ty", path: "company-policy" },

  // EMPLOYEE & MANAGER
  { title: "Hồ sơ của tôi", path: "profile" },
  { title: "Nghỉ phép", path: "leave" },
  { title: "Chấm công", path: "attendance" },
  { title: "Hoạt động, chiến dịch", path: "campaigns" },
  { title: "Điểm thưởng", path: "rewards" },
  { title: "Lịch sử yêu cầu", path: "request-history" },

  // EMPLOYEE ONLY
  { title: "Lịch sử lương", path: "salary-history" },

  // MANAGER ONLY
  { title: "Quản lý nhóm", path: "team-management" },
  { title: "Quản lý yêu cầu", path: "request-management" },
  { title: "Tặng điểm nhân viên", path: "give-rewards" },
  // { title: "404 Not Found", path: "" },
];

export default function TitleManager() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const normalize = (p) => p.replace(/^\/+|\/+$/g, "");

    const current = normalize(pathname);

    const matched = navSimple.find((item) => {
      const itemPath = normalize(item.path || "");

      if (itemPath === "") return current === "";

      return current === itemPath || current.startsWith(itemPath + "/");
    });

    document.title = matched?.title ?? "404 Not Found";
  }, [pathname]);

  return null;
}
