import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  History,
  RefreshCw,
  Calendar,
  ClockIcon,
} from "lucide-react";

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
            type: item.requestType,
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

            submitAt: item.submitAt,

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
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    if (type === "LEAVE") {
      return <Calendar className="w-4 h-4 text-blue-600" />;
    }
    return <ClockIcon className="w-4 h-4 text-purple-600" />;
  };

  const getTypeColor = (type) => {
    if (type === "LEAVE") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-purple-50 text-purple-700 border-purple-200";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md";
      case "pending":
        return "bg-amber-50/30 border-amber-200 hover:border-amber-400 hover:shadow-md";
      case "rejected":
        return "bg-white border-rose-200 hover:border-rose-400 hover:shadow-md";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getButtonStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTabColor = (tabId) => {
    switch (tabId) {
      case "approved":
        return activeTab === tabId
          ? "bg-emerald-600 text-white"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
      case "pending":
        return activeTab === tabId
          ? "bg-amber-600 text-white"
          : "bg-amber-50 text-amber-700 hover:bg-amber-100";
      case "rejected":
        return activeTab === tabId
          ? "bg-rose-600 text-white"
          : "bg-rose-50 text-rose-700 hover:bg-rose-100";
      default:
        return activeTab === tabId
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const getTabBorderColor = (tabId) => {
    switch (tabId) {
      case "approved":
        return "border-emerald-600";
      case "pending":
        return "border-amber-600";
      case "rejected":
        return "border-rose-600";
      default:
        return "border-gray-900";
    }
  };

  return (
    <div className="p-0 relative">
      <div className="mx-auto">
        <Header title="Lịch sử yêu cầu" icon={History} />

        <div className="px-4 mt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* TABS */}
            <div className="flex gap-3 border-b border-gray-200 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-3 text-sm font-medium transition-all relative cursor-pointer ${
                    activeTab === tab.id
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${getTabColor(
                      tab.id
                    )}`}
                  >
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${getTabBorderColor(
                        tab.id
                      )}`}
                    ></div>
                  )}
                </button>
              ))}
            </div>

            {/* DATE FILTERS */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg border border-gray-200 mb-5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">
                  Từ ngày:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">
                  Đến ngày:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-white hover:border-gray-900 flex items-center gap-2 transition-all"
              >
                <RefreshCw size={16} className="text-gray-600" />
                <span className="text-gray-700 font-medium">Thiết lập lại</span>
              </button>
            </div>

            {/* REQUEST CARDS */}
            <div className="space-y-3">
              {pageData.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-5 transition-all duration-200 ${getStatusColor(
                    request.status
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        {getStatusIcon(request.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {request.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${getTypeColor(
                              request.type
                            )}`}
                          >
                            {getTypeIcon(request.type)}
                            {request.type === "LEAVE"
                              ? "Nghỉ phép"
                              : "Chấm công"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {request.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${
                                request.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : request.status === "pending"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-rose-100 text-rose-800 border-rose-300"
                              }`}
                            >
                              {request.statusBadge}
                            </span>
                            <p className="text-gray-600">
                              {request.requestDate}{" "}
                              <span className="text-gray-500">
                                {request.requestTime}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center">
                            <p className="text-gray-500">
                              Xử lý lúc:{" "}
                              <span className="font-medium text-gray-700">
                                {request.deadline}
                              </span>
                            </p>
                          </div>
                        </div>

                        {request.notes && (
                          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs leading-relaxed">
                            <span className="font-semibold">⚠️ </span>
                            {request.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${getButtonStyle(
                        request.status
                      )}`}
                    >
                      {request.statusBadge}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 mt-6 select-none">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:border-gray-900"
                }`}
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:border-gray-900"
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
