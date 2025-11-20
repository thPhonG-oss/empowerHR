import {
  Users,
  SquareActivity,
  ShoppingCart,
  ShieldCheck,
  Home,
} from "lucide-react";

import Header from "../../components/common/Header";

function Dashboard() {
  return (
    <main className="p-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header title="Tổng quan" icon={Home} />

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Tổng số nhân viên</h3>
                <Users className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">100</p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Hoạt động đang diễn ra</h3>
                <SquareActivity className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">5</p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">
                  Sản phẩm trong cửa hàng
                </h3>
                <ShoppingCart className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">15</p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium ">Đang truy cập</h3>
                <ShieldCheck className="w-5 h-5 " />
              </div>
              <p className="text-2xl font-bold ">80</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold  mb-4">Thống kê chung</h2>
            <p className="text-sm  mb-4">Dữ liệu quan trọng</p>

            <div className="space-y-3">
              {/* Request Card 1 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <p className="font-semibold">Tài khoảng đang hoạt động</p>
                <p className="text-2xl font-bold">90/100</p>
              </div>

              {/* Request Card 2 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <p className="font-semibold">Tỉ lệ phê duyệt yêu cầu</p>
                <p className="text-2xl font-bold">92%</p>
              </div>

              {/* Request Card 3 */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 hover:bg-muted/30 ">
                <p className="font-semibold">Tổng điểm thưởng phát hành</p>
                <p className="text-2xl font-bold">9,427</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
