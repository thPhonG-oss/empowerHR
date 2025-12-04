import { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import Header from "../../components/common/Header";

import { History } from "lucide-react";
const requests = [
  {
    id: 1,
    title: "Yêu cầu nghỉ phép",
    description: "Nghỉ phép từ 12/01/2025 đến 14/01/2025",
    dateRange: "12/01/2025 đến 14/01/2025",
    requestDate: "10/01/2025",
    requestTime: "08:20",
    status: "approved",
    person: "Nguyễn Văn Minh",
    deadline: "11/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 2,
    title: "Yêu cầu làm việc từ xa",
    description: "Làm việc từ xa ngày 20/01/2025",
    dateRange: "20/01/2025",
    requestDate: "18/01/2025",
    requestTime: "09:45",
    status: "pending",
    person: "Trần Thị Lan",
    deadline: "19/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 3,
    title: "Yêu cầu cập nhật giờ chấm công",
    description: "Điều chỉnh check-out ngày 09/01/2025 thành 17:45",
    dateRange: "09/01/2025",
    requestDate: "10/01/2025",
    requestTime: "14:10",
    status: "rejected",
    person: "Phạm Quốc Bảo",
    deadline: "11/01/2025",
    notes: "Lý do từ chối: Không khớp với dữ liệu máy chấm công",
    statusBadge: "Đã từ chối",
  },
  {
    id: 4,
    title: "Yêu cầu nghỉ ốm",
    description: "Nghỉ ốm ngày 22/01/2025",
    dateRange: "22/01/2025",
    requestDate: "21/01/2025",
    requestTime: "07:55",
    status: "approved",
    person: "Lê Hoàng Duy",
    deadline: "21/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 5,
    title: "Yêu cầu hỗ trợ thiết bị",
    description: "Thay bàn phím bị hỏng",
    dateRange: "15/01/2025",
    requestDate: "14/01/2025",
    requestTime: "15:40",
    status: "pending",
    person: "Võ Hải Yến",
    deadline: "16/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 6,
    title: "Yêu cầu đi công tác",
    description: "Công tác tại Đà Nẵng từ 18/01 đến 19/01",
    dateRange: "18/01/2025 đến 19/01/2025",
    requestDate: "13/01/2025",
    requestTime: "10:30",
    status: "approved",
    person: "Phan Anh Tú",
    deadline: "15/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 7,
    title: "Yêu cầu cập nhật giờ chấm công",
    description: "Điều chỉnh check-in ngày 11/01/2025 thành 08:20",
    dateRange: "11/01/2025",
    requestDate: "12/01/2025",
    requestTime: "09:20",
    status: "pending",
    person: "Đặng Thu Thảo",
    deadline: "13/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 8,
    title: "Yêu cầu nghỉ phép",
    description: "Nghỉ phép ngày 05/01/2025",
    dateRange: "05/01/2025",
    requestDate: "04/01/2025",
    requestTime: "16:15",
    status: "rejected",
    person: "Ngô Minh Khôi",
    deadline: "04/01/2025",
    notes: "Lý do từ chối: Gần deadline dự án",
    statusBadge: "Đã từ chối",
  },
  {
    id: 9,
    title: "Yêu cầu làm việc từ xa",
    description: "Làm việc từ xa ngày 23/01/2025",
    dateRange: "23/01/2025",
    requestDate: "22/01/2025",
    requestTime: "09:00",
    status: "approved",
    person: "Tạ Thanh Hà",
    deadline: "22/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 10,
    title: "Yêu cầu cấp tài khoản hệ thống",
    description: "Tạo tài khoản Jira cho nhân viên mới",
    dateRange: "16/01/2025",
    requestDate: "15/01/2025",
    requestTime: "08:50",
    status: "pending",
    person: "Mai Đức Huy",
    deadline: "17/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 11,
    title: "Yêu cầu thay đổi lịch làm việc",
    description: "Đổi ca làm từ ca sáng sang ca chiều",
    dateRange: "19/01/2025",
    requestDate: "17/01/2025",
    requestTime: "13:30",
    status: "pending",
    person: "Huỳnh Ngọc Bích",
    deadline: "18/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 12,
    title: "Yêu cầu nghỉ phép",
    description: "Nghỉ phép ngày 07/01/2025",
    dateRange: "07/01/2025",
    requestDate: "06/01/2025",
    requestTime: "07:40",
    status: "approved",
    person: "Nguyễn Kiều Anh",
    deadline: "06/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 13,
    title: "Yêu cầu cập nhật giờ chấm công",
    description: "Điều chỉnh check-out ngày 03/01/2025 thành 18:00",
    dateRange: "03/01/2025",
    requestDate: "04/01/2025",
    requestTime: "11:00",
    status: "rejected",
    person: "Bùi Nhật Tân",
    deadline: "05/01/2025",
    notes: "Lý do từ chối: Không có xác nhận từ quản lý",
    statusBadge: "Đã từ chối",
  },
  {
    id: 14,
    title: "Yêu cầu làm việc từ xa",
    description: "Làm việc tại nhà ngày 25/01/2025",
    dateRange: "25/01/2025",
    requestDate: "24/01/2025",
    requestTime: "09:10",
    status: "pending",
    person: "Hồ Thuận Phát",
    deadline: "24/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 15,
    title: "Yêu cầu nghỉ bù",
    description: "Nghỉ bù ngày 13/01/2025 sau OT cuối tuần",
    dateRange: "13/01/2025",
    requestDate: "12/01/2025",
    requestTime: "12:50",
    status: "approved",
    person: "Trương Mỹ Duyên",
    deadline: "12/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 16,
    title: "Yêu cầu cấp thiết bị",
    description: "Cấp chuột không dây cho nhân viên mới",
    dateRange: "14/01/2025",
    requestDate: "13/01/2025",
    requestTime: "14:30",
    status: "pending",
    person: "Đinh Tấn Lộc",
    deadline: "15/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 17,
    title: "Yêu cầu cập nhật giờ chấm công",
    description: "Điều chỉnh check-in ngày 02/01/2025 thành 08:10",
    dateRange: "02/01/2025",
    requestDate: "03/01/2025",
    requestTime: "10:15",
    status: "approved",
    person: "Lương Đức Thịnh",
    deadline: "03/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 18,
    title: "Yêu cầu nghỉ phép dài ngày",
    description: "Nghỉ phép từ 28/01/2025 đến 31/01/2025",
    dateRange: "28/01/2025 đến 31/01/2025",
    requestDate: "20/01/2025",
    requestTime: "08:00",
    status: "pending",
    person: "Tôn Nữ Khánh Linh",
    deadline: "22/01/2025",
    statusBadge: "Chờ phê duyệt",
  },
  {
    id: 19,
    title: "Yêu cầu thay đổi vị trí làm việc",
    description: "Chuyển sang desk 14 vì lý do sức khỏe",
    dateRange: "21/01/2025",
    requestDate: "19/01/2025",
    requestTime: "15:00",
    status: "approved",
    person: "Hoàng Ngọc Sơn",
    deadline: "20/01/2025",
    statusBadge: "Đã phê duyệt",
  },
  {
    id: 20,
    title: "Yêu cầu cập nhật giờ chấm công",
    description: "Điều chỉnh check-out ngày 06/01/2025 thành 17:30",
    dateRange: "06/01/2025",
    requestDate: "07/01/2025",
    requestTime: "09:55",
    status: "rejected",
    person: "Trần Nhật Vy",
    deadline: "08/01/2025",
    notes: "Lý do từ chối: Không có chứng minh OT",
    statusBadge: "Đã từ chối",
  },
];
export default function HistoryRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const tabs = [
    { id: "all", label: "Tất cả", count: requests.length },
    {
      id: "pending",
      label: "Chờ duyệt",
      count: requests.filter((r) => r.status === "pending").length,
    },
    {
      id: "approved",
      label: "Đã duyệt",
      count: requests.filter((r) => r.status === "approved").length,
    },
    {
      id: "rejected",
      label: "Từ chối",
      count: requests.filter((r) => r.status === "rejected").length,
    },
  ];

  // Filter theo tab
  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((req) => req.status === activeTab);

  // Total pages
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  // Reset trang khi đổi tab
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Lấy item theo trang
  const pageData = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "pending":
        return "bg-orange-50 border-orange-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50";
    }
  };

  const getButtonStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-0 relative">
      <div className=" mx-auto">
        <Header title="Lịch sử yêu cầu" icon={History} />

        <div className="px-4">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Request List */}
            <div className="space-y-4">
              {pageData.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-5 ${getStatusColor(
                    request.status
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(request.status)}

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {request.description}
                        </p>

                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="inline-block bg-gray-700 text-white px-2 py-1 text-xs rounded mb-1">
                              {request.statusBadge}
                            </span>

                            <p className="text-gray-700 font-medium">
                              {request.requestDate} {request.requestTime}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600">
                              Người phê duyệt:{" "}
                              <span className="font-medium">
                                {request.person}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Xử lý lúc:{" "}
                              <span className="font-medium">
                                {request.deadline}
                              </span>
                            </p>
                          </div>
                        </div>

                        {request.notes && (
                          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                            {request.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1 rounded text-sm font-medium border transition ${getButtonStyle(
                        request.status
                      )}`}
                    >
                      {request.statusBadge}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION NEW */}
            <div className="flex items-center justify-center gap-2 mt-6 select-none">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm
                    ${
                      currentPage === 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }
                    `}
              >
                ← Trước
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg border border-gray-300 text-sm font-medium transition
                        ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-100"
                        }
                    `}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm
                ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }
                `}
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
