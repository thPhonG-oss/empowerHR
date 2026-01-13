import RatePage from "./RatePage";
import MonthlyPointPage from "./MonthlyPointPage";
import TransactionPage from "./TransactionPage";
import EmployeeRewardPage from "./EmployeeRewardPage";
import Header from "../../components/common/Header";

import {
  Contact,
  Percent,
  Calendar,
  ArrowLeftRight,
  Award,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { key: "rate", label: "Tỉ lệ quy đổi", icon: Percent },
  { key: "point_monthly", label: "Phân bổ hàng tháng", icon: Calendar },
  { key: "transaction", label: "Giao dịch điểm", icon: ArrowLeftRight },
  { key: "employee_point", label: "Điểm thưởng nhân viên", icon: Award },
];

export default function RewardPolicy() {
  const [activeTab, setActiveTab] = useState("rate");

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto">
        <Header title={"Quản lý điểm thưởng"} icon={Contact} />

        {/* Content */}
        <div className="px-6 space-y-6 mt-6">
          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`cursor-pointer shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-linear-to-br from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/30"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 min-h-[400px]">
            {activeTab === "rate" && <RatePage />}
            {activeTab === "point_monthly" && <MonthlyPointPage />}
            {activeTab === "transaction" && <TransactionPage />}
            {activeTab === "employee_point" && <EmployeeRewardPage />}
          </div>
        </div>
      </div>
    </main>
  );
}
