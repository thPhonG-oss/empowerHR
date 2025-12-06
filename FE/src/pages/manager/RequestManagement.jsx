import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { RequestDetailPopup } from "./RequestDetailPopup"

// Mock data với nhiều dữ liệu hơn để test phân trang
const mockRequests = [
  {
    requestId: 1,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Nghỉ phép năm đi du lịch cùng gia đình",
    employeeName: "Nguyễn Văn An",
    employeeCode: "EMP001",
    handleAt: null,
    submitAt: "2024-02-01T08:00:00",
    responseReason: null,
    startDate: "2024-02-10",
    endDate: "2024-02-15",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: "https://res-console.cloudinary.com/ddjzlrbzz/thumbnails/v1/image/upload/v1752000810/aW5ndG11cmd2aGN0Z29va3NsNTk=/drilldown"
  },
  {
    requestId: 2,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Chăm người thân ốm ở bệnh viện",
    employeeName: "Đỗ Ngọc Cường",
    employeeCode: "EMP002",
    handleAt: null,
    submitAt: "2024-01-15T09:30:00",
    responseReason: null,
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: "GiayKhamBenh.png",
  },
  {
    requestId: 3,
    status: "Pending",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: null,
    submitAt: "2024-01-15T10:00:00",
    responseReason: null,
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 4,
    status: "Pending",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: null,
    submitAt: "2024-01-15T10:00:00",
    responseReason: null,
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 5,
    status: "Approved",
    requestType: "LEAVE",
    reason: "Nghỉ phép năm",
    employeeName: "Phạm Văn Hải",
    employeeCode: "EMP005",
    handleAt: "2024-01-10T14:00:00",
    submitAt: "2024-01-08T09:00:00",
    responseReason: "Đồng ý cho nghỉ",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
  {
    requestId: 6,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Nghỉ đám cưới em gái",
    employeeName: "Hoàng Thị Mai",
    employeeCode: "EMP006",
    handleAt: null,
    submitAt: "2024-02-05T11:00:00",
    responseReason: null,
    startDate: "2024-02-20",
    endDate: "2024-02-22",
    leaveTypeName: "Nghỉ việc riêng",
    proofDocument: "ThiepMoi.jpg",
  },
  {
    requestId: 7,
    status: "Pending",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: null,
    submitAt: "2024-01-15T10:00:00",
    responseReason: null,
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 8,
    status: "Rejected",
    requestType: "LEAVE",
    reason: "Nghỉ phép đi chơi",
    employeeName: "Ngô Thanh Tùng",
    employeeCode: "EMP008",
    handleAt: "2024-01-20T10:00:00",
    submitAt: "2024-01-18T09:00:00",
    responseReason: "Đợt này dự án bận, không duyệt nghỉ",
    startDate: "2024-01-25",
    endDate: "2024-01-30",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
  {
    requestId: 9,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Khám sức khỏe định kỳ",
    employeeName: "Bùi Văn Khoa",
    employeeCode: "EMP009",
    handleAt: null,
    submitAt: "2024-02-07T08:00:00",
    responseReason: null,
    startDate: "2024-02-12",
    endDate: "2024-02-12",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
  {
    requestId: 10,
    status: "Pending",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: null,
    submitAt: "2024-01-15T10:00:00",
    responseReason: null,
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 11,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Nghỉ tang ông nội",
    employeeName: "Trịnh Văn Long",
    employeeCode: "EMP011",
    handleAt: null,
    submitAt: "2024-02-09T06:00:00",
    responseReason: null,
    startDate: "2024-02-09",
    endDate: "2024-02-13",
    leaveTypeName: "Nghỉ việc riêng",
    proofDocument: "GiayBaoTu.pdf",
  },
  {
    requestId: 12,
    status: "Pending",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: null,
    submitAt: "2024-01-15T10:00:00",
    responseReason: null,
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 13,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Nghỉ phép đi họp lớp",
    employeeName: "Cao Minh Phú",
    employeeCode: "EMP013",
    handleAt: null,
    submitAt: "2024-02-11T10:00:00",
    responseReason: null,
    startDate: "2024-02-25",
    endDate: "2024-02-26",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
  {
    requestId: 14,
    status: "Pending",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: null,
    submitAt: "2024-01-15T10:00:00",
    responseReason: null,
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 15,
    status: "Pending",
    requestType: "LEAVE",
    reason: "Nghỉ sinh nhật con",
    employeeName: "Đinh Thị Sen",
    employeeCode: "EMP015",
    handleAt: null,
    submitAt: "2024-02-13T09:15:00",
    responseReason: null,
    startDate: "2024-02-28",
    endDate: "2024-02-28",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
]

const ITEMS_PER_PAGE = 4

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN")
}



function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function RequestManagement() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(mockRequests)
  const [activeTab, setActiveTab] = useState("all") 
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState(null)


  // Lọc theo trạng thái Pending
  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "Pending")
  }, [requests])

  // Lọc theo tab
  const filteredRequests = useMemo(() => {
    let filtered = pendingRequests

    // Lọc theo loại yêu cầu
    if (activeTab === "leave") {
      filtered = filtered.filter((r) => r.requestType === "LEAVE")
    } else if (activeTab === "timesheet") {
      filtered = filtered.filter((r) => r.requestType === "TIMESHEET_UPDATE")
    }
    // activeTab === "all" thì không lọc, giữ nguyên

    

    return filtered
  }, [pendingRequests, activeTab])

  // Phân trang
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredRequests, currentPage])

  // Reset trang khi filter thay đổi
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

 

  const clearFilters = () => {
    setStartDateFilter("")
    setEndDateFilter("")
    setCurrentPage(1)
  }

  // Xử lý phê duyệt
  const handleApprove = (requestId, note) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.requestId === requestId
          ? {
              ...r,
              status: "Approved",
              handleAt: new Date().toISOString(),
              responseReason: note || "Đã phê duyệt",
            }
          : r,
      ),
    )
    setSelectedRequest(null)
  }

  // Xử lý từ chối
  const handleReject = (requestId, reason) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.requestId === requestId
          ? {
              ...r,
              status: "Rejected",
              handleAt: new Date().toISOString(),
              responseReason: reason,
            }
          : r,
      ),
    )
    setSelectedRequest(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Danh sách yêu cầu</h1>
                <p className="text-sm text-gray-500">Cần xem chi tiết từng yêu cầu trước khi phê duyệt</p>
              </div>
              <button
                onClick={() => navigate("/manager/request-management-history")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Đã xử lý
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-gray-200">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "all" 
                    ? "border-black text-black" 
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTabChange("leave")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "leave" 
                    ? "border-black text-black" 
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Nghỉ phép
              </button>
              <button
                onClick={() => handleTabChange("timesheet")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === "timesheet" 
                    ? "border-black text-black" 
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Chấm công
              </button>
            </div>

          </div>

          {/* Date Filter - Removed from header, can be added back if needed */}
          
          {/* Request List */}
          <div className="mt-6 space-y-4">
            {paginatedRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
                Không có yêu cầu nào cần xử lý
              </div>
            ) : (
              paginatedRequests.map((request, index) => (
                <div 
                  key={`${request.requestId}-${index}`} 
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                        {getInitials(request.employeeName)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.requestType === "LEAVE" ? "Nghỉ phép" : request.requestType === "TIMESHEET_UPDATE" ? "Chấm công" : "Làm việc tại nhà"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {request.employeeName}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    >
                      Chi tiết
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="ml-13 mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Lý do:</span> {request.reason}
                    </p>
                  </div>

                  <div className="ml-13 flex items-center justify-between text-sm text-gray-500">
                    <span>Gửi lúc: {formatDate(request.submitAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} / {filteredRequests.length} yêu cầu
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                      currentPage === page 
                        ? "bg-black text-white" 
                        : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Popup */}
      {selectedRequest && (
        <RequestDetailPopup
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
