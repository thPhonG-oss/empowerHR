
import { useState } from "react"
import { Clock, User, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom";

const mockData= [
  {
    id_request: "REQ001",
    employee: "Đỗ Ngọc Cường",
    request_type: "Leave",
    reason_req: "Có việc gia đình đột xuất",
    submit_at: "15/01/2025",
  },
  {
    id_request: "REQ002",
    employee: "Đỗ Ngọc Cường",
    request_type: "Leave",
    reason_req: "Ốm quá, phải nghỉ",
    submit_at: "15/01/2025",
  },
  {
    id_request: "REQ003",
    employee: "Phan Công Châu",
    request_type: "TimesheetUpdate",
    reason_req: "Hệ thống bị lỗi",
    submit_at: "15/01/2025",
  },
  {
    id_request: "REQ004",
    employee: "Phan Công Châu",
    request_type: "TimesheetUpdate",
    reason_req: "Hệ thống bị lỗi",
    submit_at: "15/01/2025",
  },
  {
    id_request: "REQ005",
    employee: "Phan Công Châu",
    request_type: "TimesheetUpdate",
    reason_req: "Hệ thống bị lỗi",
    submit_at: "15/01/2025",
  }
 
]

// Tự tạo chứ DB k lưu
const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "Leave", label: "Nghỉ phép" },
  { id: "TimesheetUpdate", label: "Chấm công" },
]

export default function RequestList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = mockData.filter((req) => {
    if (activeTab === "all") return true
    return req.request_type === activeTab
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-foreground mb-6">Các yêu cầu chờ duyệt</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Danh sách yêu cầu</h2>
          <p className="text-sm text-muted-foreground mt-1">Cần xem chi tiết từng yêu cầu trước khi phê duyệt</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/manager/request-management/history")}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-foreground text-background hover:bg-gray-200"
          >
            Các yêu cầu đã xử lý
          </button>

        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id_request} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-foreground">
                   {request.employee.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tabs[request.request_type].label}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="w-3 h-3" />
                      {request.employee}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/manager/request-management/${request.id_request}`)}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-foreground text-background hover:bg-gray-200"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-foreground">Lý do:</p>
                <p className="text-sm text-muted-foreground mt-1">{request.reason_req}</p>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>Gửi lúc: {request.submit_at}</span>
                <span>
                  Chưa xử lý
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
