import {
  Gift,
  Calendar,
  Target,
  ArrowLeftRight,
  MoreHorizontal,
} from "lucide-react";

export const transactionTypeConfig = {
  CashOut: {
    label: "Đổi quà",
    icon: ArrowLeftRight,
    color: "text-red-500",
    sign: "-",
  },
  ActivityReward: {
    label: "Thưởng hoạt động",
    icon: Target,
    color: "text-green-600",
    sign: "+",
  },
  PerformanceReward: {
    label: "Thưởng hiệu suất",
    icon: Gift,
    color: "text-green-600",
    sign: "+",
  },
  MonthlyReward: {
    label: "Thưởng hàng tháng",
    icon: Calendar,
    color: "text-green-600",
    sign: "+",
  },
  Other: {
    label: "Điều chỉnh điểm",
    icon: MoreHorizontal,
    color: "text-gray-500",
    sign: "",
  },
};
