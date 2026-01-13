// import RatePage from "./RatePage";
// import MonthlyPointPage from "./MonthlyPointPage";
// import TransactionPage from "./TransactionPage";
// import EmployeeRewardPage from "./EmployeeRewardPage";
// import Header from "../../components/common/Header";


// import {
//     Contact,
// } from "lucide-react";

// import { useState } from "react";

// const tabs = [
//   { key: "rate", label: "Tỉ lệ quy đổi" },
//   { key: "point_monthly", label: "Phân bổ hàng tháng" },
//   { key: "transaction", label: "Giao dịch điểm" },
//   { key: "employee_point", label: "Điểm thưởng nhân viên" },
// ];

// export default function RewardPolicy() {
//   const [activeTab, setActiveTab] = useState("rate");
//   return (
//     <main className="p-0 relative">
//         <div className="mx-auto">
//           <Header title={"Quản lý điểm thưởng"} icon={Contact} />
//           {/* Content */}
//           <div className="px-6 space-y-6">
//             {/* {activeTab} */}
//             <div className="py-6 border-gray-200 flex gap-6">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`pb-2 text-sm font-medium transition
//                   ${
//                     activeTab === tab.key
//                       ? "text-black-600 border-b-2 border-black-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//             </div>

//             {/* {content} */}
//             {activeTab === "rate" && <RatePage />}
//             {activeTab === "point_monthly" && <MonthlyPointPage />}
//             {activeTab === "transaction" && <TransactionPage />}
//             {activeTab === "employee_point" && <EmployeeRewardPage />}
//           </div>
//         </div>
//     </main>
//   );
// }
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
    Award
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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <Header title={"Quản lý điểm thưởng"} icon={Contact} />
        
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-6">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all whitespace-nowrap relative
                      ${
                        activeTab === tab.key
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
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