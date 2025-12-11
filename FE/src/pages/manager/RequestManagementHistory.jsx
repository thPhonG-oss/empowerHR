import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RequestDetailPopup } from "../../components/manager/RequestDetailPopup";
import Header from "../../components/common/Header";
import { FileCheck } from "lucide-react";
import requestApi from "../../api/requestApi";

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
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // -------------------- API CALL (có filter) --------------------
  const fetchData = async () => {
    try {
      const res = await requestApi.getHandled(
        currentPage,
        ITEMS_PER_PAGE,
        activeTab !== "all" ? activeTab : null,
        startDateFilter || null,
        endDateFilter || null
      );

      const data = res.result;
      setRequests(data.requestResponseDTOS || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, activeTab, startDateFilter, endDateFilter]);

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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
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
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
              {requests.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
                  Không có yêu cầu nào đã xử lý
                </div>
              ) : (
                [...requests]
                  .sort((a, b) => new Date(b.submitAt) - new Date(a.submitAt))
                  .map((request) => {
                    const normalizedStatus = normalizeStatus(request.status);
                    const isApproved = normalizedStatus === "Approved";

                    return (
                      <div
                        key={request.requestId}
                        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
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
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    isApproved
                                      ? "bg-green-100 text-green-700 border border-green-200"
                                      : "bg-red-100 text-red-700 border border-red-200"
                                  }`}
                                >
                                  {isApproved ? "Đã phê duyệt" : "Đã từ chối"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
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
                            className="px-4 py-2 text-sm flex items-center gap-1 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-bold hover:underline cursor-pointer"
                          >
                            Chi tiết
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>

                        <p className="ml-13 text-sm text-gray-600 mb-2">
                          <span className="font-medium">Lý do:</span>{" "}
                          {request.reason}
                        </p>

                        <div className="ml-13 flex items-center justify-between text-sm text-gray-500">
                          <span>
                            Ngày gửi: {formatDateTime(request.submitAt)}
                          </span>
                          <span className="text-gray-600 font-medium">
                            Xử lý lúc:{" "}
                            {request.handleAt
                              ? formatDateTime(request.handleAt)
                              : "--"}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalElements)} /{" "}
                  {totalElements} yêu cầu
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm rounded-md ${
                          currentPage === page
                            ? "bg-black text-white"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailPopup
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}
    </div>
  );
}
