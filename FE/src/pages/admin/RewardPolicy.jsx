import RatePage from "./RatePage";
import MonthlyPointPage from "./MonthlyPointPage";
import TransactionPage from "./TransactionPage";
import EmployeeRewardPage from "./EmployeeRewardPage";
import Header from "../../components/common/Header";


import {
    Contact,
} from "lucide-react";

import { useState } from "react";

const tabs = [
  { key: "rate", label: "Tỉ lệ quy đổi" },
  { key: "point_monthly", label: "Phân bổ hàng tháng" },
  { key: "transaction", label: "Giao dịch điểm" },
  { key: "employee_point", label: "Điểm thưởng nhân viên" },
];

export default function RewardPolicy() {
  const [activeTab, setActiveTab] = useState("rate");
  return (
    <main className="p-0 relative">
        <div className="mx-auto">
          <Header title={"Quản lý điểm thưởng"} icon={Contact} />
    
          {/* Content */}
          <div className="px-6 space-y-6">
            {/* {activeTab} */}
            <div className="border-b border-gray-200 flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-sm font-medium transition
                  ${
                    activeTab === tab.key
                      ? "text-black-600 border-b-2 border-black-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
            </div>

            {/* {content} */}
            {activeTab === "rate" && <RatePage />}
            {activeTab === "point_monthly" && <MonthlyPointPage />}
            {activeTab === "transaction" && <TransactionPage />}
            {activeTab === "employee_point" && <EmployeeRewardPage />}
          </div>
        </div>
    </main>
  );
}
