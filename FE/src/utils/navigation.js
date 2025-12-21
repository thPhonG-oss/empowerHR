// src/utils/navigation.js

import {
  LayoutDashboard,
  ShoppingCart,
  Gift,
  Users,
  IdCard,
  Activity,
  Wrench,
  CalendarX,
  CalendarClock,
  Target,
  History,
  DollarSign,
  UserCog,
  FileCheck,
  PartyPopper,
} from "lucide-react";

const navConfig = [
  // ──────────────────────────────── COMMON FOR ALL ────────────────────────────────
  {
    title: "Trang chủ",
    path: "dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "employee", "manager"],
  },

  // ──────────────────────────────── ADMIN ONLY ────────────────────────────────
  {
    title: "Quản lý gian hàng",
    path: "store-management",
    icon: ShoppingCart,
    roles: ["admin"],
  },
  {
    title: "Điểm thưởng",
    path: "rewards",
    icon: Gift,
    roles: ["admin"],
  },
  {
    title: "Quản lý nhân viên",
    path: "employee-management",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Tài khoản nhân viên",
    path: "employee-accounts",
    icon: IdCard,
    roles: ["admin"],
  },
  {
    title: "Quản lý hoạt động",
    path: "activity-management",
    icon: Activity,
    roles: ["admin"],
  },
  {
    title: "Chính sách công ty",
    path: "company-policy",
    icon: Wrench,
    roles: ["admin"],
  },

  // ──────────────────────────────── EMPLOYEE COMMON ────────────────────────────────
  {
    title: "Hồ sơ của tôi",
    path: "profile",
    icon: IdCard,
    roles: ["employee", "manager"],
  },
  {
    title: "Nghỉ phép",
    path: "leave",
    icon: CalendarX,
    roles: ["employee", "manager"],
  },
  {
    title: "Chấm công",
    path: "attendance",
    icon: CalendarClock,
    roles: ["employee", "manager"],
  },
  {
    title: "Hoạt động, chiến dịch",
    path: "campaigns",
    icon: Target,
    roles: ["employee", "manager"],
  },
  {
    title: "Điểm thưởng",
    path: "rewards",
    icon: Gift,
    roles: ["employee", "manager"],
  },
  {
    title: "Lịch sử yêu cầu",
    path: "request-history",
    icon: History,
    roles: ["employee", "manager"],
  },

  // ──────────────────────────────── EMPLOYEE ONLY ────────────────────────────────
  {
    title: "Lịch sử lương",
    path: "salary-history",
    icon: DollarSign,
    roles: ["employee"],
  },

  // ──────────────────────────────── MANAGER ONLY ────────────────────────────────
  {
    title: "Quản lý nhóm",
    path: "team-management",
    icon: UserCog,
    roles: ["manager"],
  },
  {
    title: "Quản lý yêu cầu",
    path: "request-management",
    icon: FileCheck,
    roles: ["manager"],
  },
  {
    title: "Tặng điểm nhân viên",
    path: "give-rewards",
    icon: PartyPopper,
    roles: ["manager"],
  },
];

export const getNavByRole = (role) => {
  // ép role thành chữ thường

  const prefix = `/${role.toLowerCase()}/`;

  return navConfig
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      link: prefix + item.path,
    }));
};
