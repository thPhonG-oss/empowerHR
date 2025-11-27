import { BarChart3, Clock, AlertCircle, Calendar, Home } from "lucide-react";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Điểm thưởng hiện tại</h3>
                <BarChart3 className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">2,450</p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">
                  Số ngày đi làm tháng này
                </h3>
                <Clock className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">15</p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Ngày nghỉ phép còn lại</h3>
                <Calendar className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">15</p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Yêu cầu chờ duyệt</h3>
                <AlertCircle className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">2</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - My Requests */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <h2 className="text-lg font-semibold  mb-4">Yêu cầu của tôi</h2>
              <p className="text-sm  mb-4">Các yêu cầu gần đây</p>

              <div className="space-y-3">
                {/* Request Card 1 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Nghỉ phép
                      </span>
                      <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Chờ phê duyệt
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm  mb-1">
                    <Clock className="w-4 h-4" />
                    <span>01/01/2025 - 01/01/2026</span>
                  </div>
                  <p className="text-sm ">Nghỉ phép năm</p>
                </div>

                {/* Request Card 2 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-700 text-white dark:bg-slate-600">
                        WFH
                      </span>
                      <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Đã phê duyệt
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm  mb-1">
                    <Clock className="w-4 h-4" />
                    <span>01/01/2025 - 01/01/2026</span>
                  </div>
                  <p className="text-sm ">Nghỉ phép năm</p>
                </div>
              </div>
            </div>

            {/* Right Column - My Activities */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <h2 className="text-lg font-semibold  mb-4">Hoạt động của tôi</h2>
              <p className="text-sm  mb-4">Các hoạt động gần đây</p>

              <div className="space-y-3">
                {/* Activity Card 1 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium  mb-1">
                        FC Online Champions Cup
                      </h3>
                      <div className="flex items-center gap-2 text-sm ">
                        <Calendar className="w-4 h-4" />
                        <span>Đến 01/01/2025</span>
                      </div>
                    </div>
                    <button className="text-xs font-medium px-3 py-1 rounded  bg-slate-700 text-white dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500">
                      Đã đăng ký
                    </button>
                  </div>
                </div>

                {/* Activity Card 2 */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium  mb-1">
                        FC Online Champions Cup
                      </h3>
                      <div className="flex items-center gap-2 text-sm ">
                        <Calendar className="w-4 h-4" />
                        <span>Đến 01/01/2025</span>
                      </div>
                    </div>
                    <button className="text-xs font-medium px-3 py-1 rounded  border  hover:bg-muted">
                      Đăng điền ra
                    </button>
                  </div>
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
