import { Users, UserRoundX, ClipboardList, Home, Clock } from "lucide-react";

import Header from "../../components/common/Header";

function Dashboard() {
  return (
    <main className="p-0">
      <div className="mx-auto">
        {/* Header */}
        <Header title="Tổng quan" icon={Home} />

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Nhân viên cấp dưới</h3>
                <Users className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">7</p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Nhân viên nghỉ phép</h3>
                <UserRoundX className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">5</p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Yêu cầu chờ duyệt</h3>
                <ClipboardList className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">15</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold  mb-4">Yêu cầu gần đây</h2>
            <p className="text-sm  mb-4">Các yêu cầu cần được xử lý</p>

            <div className="space-y-3">
              {/* Request Card 1 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Nghỉ phép
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm  mb-1">
                  <Clock className="w-4 h-4" />
                  <span>01/01/2025 - 01/01/2026</span>
                </div>
              </div>

              {/* Request Card 2 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-700 text-white dark:bg-slate-600">
                      WFH
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm  mb-1">
                  <Clock className="w-4 h-4" />
                  <span>01/01/2025 - 01/01/2026</span>
                </div>
              </div>

              {/* Request Card 1 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Nghỉ phép
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm  mb-1">
                  <Clock className="w-4 h-4" />
                  <span>01/01/2025 - 01/01/2026</span>
                </div>
              </div>

              {/* Request Card 2 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-700 text-white dark:bg-slate-600">
                      WFH
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm  mb-1">
                  <Clock className="w-4 h-4" />
                  <span>01/01/2025 - 01/01/2026</span>
                </div>
              </div>

              {/* Request Card 1 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Nghỉ phép
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm  mb-1">
                  <Clock className="w-4 h-4" />
                  <span>01/01/2025 - 01/01/2026</span>
                </div>
              </div>

              {/* Request Card 2 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-700 text-white dark:bg-slate-600">
                      WFH
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm  mb-1">
                  <Clock className="w-4 h-4" />
                  <span>01/01/2025 - 01/01/2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
