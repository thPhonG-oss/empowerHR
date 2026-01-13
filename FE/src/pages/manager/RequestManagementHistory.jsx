import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { RequestDetailPopup } from "../../components/manager/RequestDetailPopup";
import Header from "../../components/common/Header";
import { FileCheck } from "lucide-react";
import requestApi from "../../api/requestApi";
import { User } from "lucide-react";
const ITEMS_PER_PAGE = 10;

function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RequestManagementHistory() {
  const [allRequests, setAllRequests] = useState([]); // 🔥 dữ liệu gốc API
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // -------------------- API CALL 1 LẦN --------------------
  const fetchData = async () => {
    try {
      const res = await requestApi.getHandled(1, 9999); // lấy hết
      const data = res.result;

      setAllRequests(data.requestResponseDTOS || []);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------- FILTER HOÀN TOÀN TRÊN FE --------------------
  const filteredRequests = useMemo(() => {
    let result = [...allRequests];

    // Filter theo tab
    if (activeTab !== "all") {
      result = result.filter((r) => r.requestType === activeTab);
    }

    // Filter theo ngày xử lý
    if (startDateFilter) {
      result = result.filter((r) => {
        const h = new Date(r.handleAt || r.submitAt);
        return h >= new Date(startDateFilter + "T00:00:00");
      });
    }

    if (endDateFilter) {
      result = result.filter((r) => {
        const h = new Date(r.handleAt || r.submitAt);
        return h <= new Date(endDateFilter + "T23:59:59");
      });
    }

    // Sort theo thời gian xử lý
    result.sort(
      (a, b) =>
        new Date(b.handleAt || b.submitAt) - new Date(a.handleAt || a.submitAt)
    );

    return result;
  }, [allRequests, activeTab, startDateFilter, endDateFilter]);

  // -------------------- PHÂN TRANG FE --------------------
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (type, value) => {
    if (type === "start") setStartDateFilter(value);
    else setEndDateFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
    setCurrentPage(1);
  };

  const normalizeStatus = (status) => {
    if (status === "Approve" || status === "Approved") return "Approved";
    if (status === "Reject" || status === "Rejected") return "Rejected";
    return status;
  };

  // -------------------- RENDER --------------------
  return (
    <div className="p-0 bg-gray-50">
      <div className="mx-auto">
        <Header title="Quản lý yêu cầu" icon={FileCheck} />

        <div className="bg-gray-50 py-4 px-6">
          <div className="bg-white rounded-lg p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 mb-1">
                    Danh sách yêu cầu đã xử lý
                  </h1>
                  <p className="text-sm text-gray-500">
                    Xem lại các yêu cầu đã được phê duyệt hoặc từ chối
                  </p>
                </div>

                <Link
                  to={"/manager/request-management"}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Yêu cầu chờ xử lý
                </Link>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-3 border-b border-gray-200 mb-4">
                {[
                  { id: "all", name: "Tất cả" },
                  { id: "LEAVE", name: "Nghỉ phép" },
                  { id: "TIMESHEET_UPDATE", name: "Chấm công" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "border-black text-black"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Date filters */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Từ ngày xử lý:
                  </label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) =>
                      handleDateFilterChange("start", e.target.value)
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Đến ngày xử lý:
                  </label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) =>
                      handleDateFilterChange("end", e.target.value)
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  />
                </div>

                {(startDateFilter || endDateFilter) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
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
                paginatedRequests.map((request) => {
                  const normalizedStatus = normalizeStatus(request.status);
                  const isApproved = normalizedStatus === "Approved";

                  return (
                    <div
                      key={request.requestId}
                      className="bg-white border  border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                            {getInitials(request.employeeName)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {request.requestType === "LEAVE"
                                  ? "Nghỉ phép"
                                  : request.requestType === "TIMESHEET_UPDATE"
                                  ? "Chấm công"
                                  : "Yêu cầu khác"}
                              </h3>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                                  ${
                                    isApproved
                                      ? "bg-green-100 text-green-700 border-green-300"
                                      : "bg-red-100 text-red-700 border-red-300"
                                  }`}
                              >
                                {isApproved ? "Đã phê duyệt" : "Đã từ chối"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              {request.employeeName}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="cursor-pointer px-4 py-2 text-sm flex items-center gap-1 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1.5 rounded-md border border-gray-300 text-sm ${
                    p === currentPage
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailPopup
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
