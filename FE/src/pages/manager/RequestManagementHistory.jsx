import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { RequestDetailPopup } from "./RequestDetailPopup"

// Mock data với nhiều dữ liệu hơn để test phân trang
const mockRequests = [
  {
    requestId: 1,
    status: "Approve",
    requestType: "LEAVE",
    reason: "Nghỉ phép năm đi du lịch cùng gia đình",
    employeeName: "Nguyễn Văn An",
    employeeCode: "EMP001",
    handleAt: "2024-02-02T14:30:00",
    submitAt: "2024-02-01T08:00:00",
    responseReason: "Đã phê duyệt",
    startDate: "2024-02-10",
    endDate: "2024-02-15",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: "https://res-console.cloudinary.com/ddjzlrbzz/thumbnails/v1/image/upload/v1752000810/aW5ndG11cmd2aGN0Z29va3NsNTk=/drilldown"
  },
  {
    requestId: 2,
    status: "Approve",
    requestType: "LEAVE",
    reason: "Chăm người thân ốm ở bệnh viện",
    employeeName: "Đỗ Ngọc Cường",
    employeeCode: "EMP002",
    handleAt: "2024-01-16T10:15:00",
    submitAt: "2024-01-15T09:30:00",
    responseReason: "Đồng ý cho nghỉ",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: "GiayKhamBenh.png",
  },
  {
    requestId: 3,
    status: "Reject",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: "2024-01-16T11:20:00",
    submitAt: "2024-01-15T10:00:00",
    responseReason: "Không hợp lệ",
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 4,
    status: "Reject",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: "2024-01-17T09:00:00",
    submitAt: "2024-01-15T10:00:00",
    responseReason: "Thiếu minh chứng",
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 5,
    status: "Reject",
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
    status: "Approve",
    requestType: "LEAVE",
    reason: "Nghỉ đám cưới em gái",
    employeeName: "Hoàng Thị Mai",
    employeeCode: "EMP006",
    handleAt: "2024-02-06T15:45:00",
    submitAt: "2024-02-05T11:00:00",
    responseReason: "Đã phê duyệt",
    startDate: "2024-02-20",
    endDate: "2024-02-22",
    leaveTypeName: "Nghỉ việc riêng",
    proofDocument: "ThiepMoi.jpg",
  },
  {
    requestId: 7,
    status: "Reject",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: "2024-01-18T08:30:00",
    submitAt: "2024-01-15T10:00:00",
    responseReason: "Không đủ căn cứ",
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
    status: "Approve",
    requestType: "LEAVE",
    reason: "Khám sức khỏe định kỳ",
    employeeName: "Bùi Văn Khoa",
    employeeCode: "EMP009",
    handleAt: "2024-02-08T09:20:00",
    submitAt: "2024-02-07T08:00:00",
    responseReason: "Đã phê duyệt",
    startDate: "2024-02-12",
    endDate: "2024-02-12",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
  {
    requestId: 10,
    status: "Reject",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: "2024-01-19T13:15:00",
    submitAt: "2024-01-15T10:00:00",
    responseReason: "Không hợp lệ",
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 11,
    status: "Approve",
    requestType: "LEAVE",
    reason: "Nghỉ tang ông nội",
    employeeName: "Trịnh Văn Long",
    employeeCode: "EMP011",
    handleAt: "2024-02-10T11:00:00",
    submitAt: "2024-02-09T06:00:00",
    responseReason: "Đã phê duyệt",
    startDate: "2024-02-09",
    endDate: "2024-02-13",
    leaveTypeName: "Nghỉ việc riêng",
    proofDocument: "GiayBaoTu.pdf",
  },
  {
    requestId: 12,
    status: "Approve",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: "2024-01-20T16:00:00",
    submitAt: "2024-01-15T10:00:00",
    responseReason: "Đã phê duyệt",
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 13,
    status: "Approve",
    requestType: "LEAVE",
    reason: "Nghỉ phép đi họp lớp",
    employeeName: "Cao Minh Phú",
    employeeCode: "EMP013",
    handleAt: "2024-02-12T14:30:00",
    submitAt: "2024-02-11T10:00:00",
    responseReason: "Đã phê duyệt",
    startDate: "2024-02-25",
    endDate: "2024-02-26",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
  {
    requestId: 14,
    status: "Approve",
    requestType: "TIMESHEET_UPDATE",
    reason: "Nhà đi làm quá, ở nhà ngủ",
    employeeName: "Trần Minh Đức",
    employeeCode: "EMP003",
    handleAt: "2024-01-21T10:45:00",
    submitAt: "2024-01-15T10:00:00",
    responseReason: "Đã phê duyệt",
    attendanceDate: "2024-03-10",
    checkinTime: "09:00:00",
    checkoutTime: "19:00:00"
  },
  {
    requestId: 15,
    status: "Approve",
    requestType: "LEAVE",
    reason: "Nghỉ sinh nhật con",
    employeeName: "Đinh Thị Sen",
    employeeCode: "EMP015",
    handleAt: "2024-02-14T08:30:00",
    submitAt: "2024-02-13T09:15:00",
    responseReason: "Đã phê duyệt",
    startDate: "2024-02-28",
    endDate: "2024-02-28",
    leaveTypeName: "Nghỉ phép năm",
    proofDocument: null,
  },
]

const ITEMS_PER_PAGE = 4

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN")
}

function formatDateTime(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

// function calculateDays(startDate, endDate) {
//   const start = new Date(startDate)
//   const end = new Date(endDate)
//   const diffTime = Math.abs(end.getTime() - start.getTime())
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
//   return diffDays
// }

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function RequestManagementHistory() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(mockRequests)
  const [activeTab, setActiveTab] = useState("all") 
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [startDateFilter, setStartDateFilter] = useState("")
  const [endDateFilter, setEndDateFilter] = useState("")

  // Lọc các request đã được xử lý (không phải Pending)
  const processedRequests = useMemo(() => {
    return requests.filter((r) => r.status !== "Pending")
  }, [requests])

  // Lọc theo tab và ngày xử lý (handleAt)
  const filteredRequests = useMemo(() => {
    let filtered = processedRequests

    // Lọc theo loại yêu cầu
    if (activeTab === "leave") {
      filtered = filtered.filter((r) => r.requestType === "LEAVE")
    } else if (activeTab === "timesheet") {
      filtered = filtered.filter((r) => r.requestType === "TIMESHEET_UPDATE")
    }
    // activeTab === "all" thì không lọc, giữ nguyên

    // Lọc theo ngày xử lý bắt đầu (handleAt) - nếu không có handleAt thì dùng submitAt
    if (startDateFilter) {
      const filterDate = new Date(startDateFilter)
      filterDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((r) => {
        const dateToCompare = r.handleAt ? new Date(r.handleAt) : new Date(r.submitAt)
        dateToCompare.setHours(0, 0, 0, 0)
        return dateToCompare >= filterDate
      })
    }

    // Lọc theo ngày xử lý kết thúc (handleAt) - nếu không có handleAt thì dùng submitAt
    if (endDateFilter) {
      const filterDate = new Date(endDateFilter)
      filterDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((r) => {
        const dateToCompare = r.handleAt ? new Date(r.handleAt) : new Date(r.submitAt)
        return dateToCompare <= filterDate
      })
    }

    return filtered
  }, [processedRequests, activeTab, startDateFilter, endDateFilter])

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

  const handleDateFilterChange = (type, value) => {
    if (type === "start") {
      setStartDateFilter(value)
    } else {
      setEndDateFilter(value)
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setStartDateFilter("")
    setEndDateFilter("")
    setCurrentPage(1)
  }

  // Không cần handleApprove và handleReject vì đây là trang lịch sử (chỉ xem)
  const handleApprove = () => {}
  const handleReject = () => {}

  // Helper function để normalize status
  const normalizeStatus = (status) => {
    if (status === "Approve" || status === "Approved") return "Approved"
    if (status === "Reject" || status === "Rejected") return "Rejected"
    return status
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Danh sách yêu cầu đã xử lý</h1>
                <p className="text-sm text-gray-500">Xem lại các yêu cầu đã được phê duyệt hoặc từ chối</p>
              </div>
              <button
                onClick={() => navigate("/manager/request-management")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Yêu cầu chờ xử lý
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-gray-200 mb-4">
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

            {/* Date Filter - Filter by handleAt */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Từ ngày xử lý:</label>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => handleDateFilterChange("start", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Đến ngày xử lý:</label>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => handleDateFilterChange("end", e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              {(startDateFilter || endDateFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>
          
          {/* Request List */}
          <div className="mt-6 space-y-4">
            {paginatedRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
                Không có yêu cầu nào đã xử lý
              </div>
            ) : (
              paginatedRequests.map((request, index) => {
                const normalizedStatus = normalizeStatus(request.status)
                const isApproved = normalizedStatus === "Approved"
                
                return (
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
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {request.requestType === "LEAVE" ? "Nghỉ phép" : request.requestType === "TIMESHEET_UPDATE" ? "Chấm công" : "Làm việc tại nhà"}
                            </h3>
                            {/* Status Badge */}
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isApproved
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {isApproved ? "Đã phê duyệt" : "Đã từ chối"}
                            </span>
                          </div>
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
                      <span>Ngày gửi: {formatDateTime(request.submitAt)}</span>
                      <span className="text-gray-600 font-medium">
                        Đã duyệt: {request.handleAt ? formatDateTime(request.handleAt) : "Chưa xử lý"}
                      </span>
                    </div>
                  </div>
                )
              })
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
