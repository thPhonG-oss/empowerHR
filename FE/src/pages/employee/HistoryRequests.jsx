import { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, History, RefreshCw } from "lucide-react";

import Header from "../../components/common/Header";
import employeeApi from "../../api/employeeApi";

export default function HistoryRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await employeeApi.getMyRequest({ page: 1, size: 100 });

        if (res?.result?.requestResponseDTOS) {
          const mapped = res.result.requestResponseDTOS.map((item) => ({
            id: item.requestId,
            title:
              item.requestType === "LEAVE"
                ? "Yêu cầu nghỉ phép"
                : "Yêu cầu cập nhật giờ chấm công",

            description:
              item.requestType === "LEAVE"
                ? `Nghỉ từ ${item.startDate} đến ${item.endDate}`
                : `Điều chỉnh ngày ${item.attendanceDate}: ${item.checkinTime} → ${item.checkoutTime}`,

            dateRange:
              item.requestType === "LEAVE"
                ? `${item.startDate} đến ${item.endDate}`
                : item.attendanceDate,

            requestDate: item.submitAt?.split("T")[0] || "",
            requestTime: item.submitAt?.split("T")[1]?.substring(0, 5) || "",

            submitAt: item.submitAt, // ⭐ THÊM ĐỂ SORT

            status: item.status.toLowerCase(),
            statusBadge:
              item.status === "Approved"
                ? "Đã phê duyệt"
                : item.status === "Rejected"
                ? "Đã từ chối"
                : "Chờ phê duyệt",

            person: item.employeeName,
            deadline: item.handleAt || "—",

            notes:
              item.status === "Rejected" && item.responseReason
                ? `Lý do từ chối: ${item.responseReason}`
                : null,
          }));

          // ⭐ SORT SUBMIT MỚI NHẤT
          mapped.sort((a, b) => new Date(b.submitAt) - new Date(a.submitAt));

          setRequests(mapped);
        }
      } catch (e) {
        console.error("Lỗi gọi API:", e);
      }
    };

    fetchData();
  }, []);

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

  // ⭐ LỌC THEO TAB + NGÀY
  const filteredRequests = requests
    .filter((req) => (activeTab === "all" ? true : req.status === activeTab))
    .filter((req) => {
      const date = new Date(req.requestDate);

      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;

      return true;
    });

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, startDate, endDate]);

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
      <div className="mx-auto">
        <Header title="Lịch sử yêu cầu" icon={History} />

        <div className="px-4">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex gap-8 border-b border-gray-200 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 font-semibold transition-colors cursor-pointer hover:border-b-2 border-gray-300 ${
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
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 my-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Từ ngày:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Đến ngày:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-200 flex justify-center items-center gap-2 cursor-pointer "
              >
                <RefreshCw size={18} />
                <span>Thiết lại lại</span>
              </button>
            </div>
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

            <div className="flex items-center justify-center gap-2 mt-6 select-none">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg border border-gray-300 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
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
