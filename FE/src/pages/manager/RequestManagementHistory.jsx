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
  const [allRequests, setAllRequests] = useState([]);
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
    <div className="p-0 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <Header title="Quản lý yêu cầu" icon={FileCheck} />

        <div className="bg-gray-50 py-6 px-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-lg font-semibold text-gray-800 mb-1.5">
                    Danh sách yêu cầu đã xử lý
                  </h1>
                  <p className="text-sm text-gray-500">
                    Xem lại các yêu cầu đã được phê duyệt hoặc từ chối
                  </p>
                </div>

                <Link
                  to={"/manager/request-management"}
                  className=" hover:-translate-y-0.5 flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gray-800 
                  text-white rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                >
                  Yêu cầu chờ xử lý
                </Link>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 border-b border-gray-100 mb-5">
                {[
                  { id: "all", name: "Tất cả" },
                  { id: "LEAVE", name: "Nghỉ phép" },
                  { id: "TIMESHEET_UPDATE", name: "Chấm công" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`pb-3.5 px-1 text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                      activeTab === tab.id
                        ? "text-gray-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.name}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Date filters */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <label className="text-sm font-medium text-gray-600">
                    Từ ngày xử lý:
                  </label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) =>
                      handleDateFilterChange("start", e.target.value)
                    }
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-gray-200 focus:border-gray-300 bg-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="text-sm font-medium text-gray-600">
                    Đến ngày xử lý:
                  </label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) =>
                      handleDateFilterChange("end", e.target.value)
                    }
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-gray-200 focus:border-gray-300 bg-white transition-all"
                  />
                </div>

                {(startDateFilter || endDateFilter) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 
                    rounded-lg cursor-pointer transition-all duration-200"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
            </div>

            {/* Request List */}
            <div className="mt-6 space-y-3">
              {paginatedRequests.length === 0 ? (
                <div className="p-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                  Không có yêu cầu nào đã xử lý
                </div>
              ) : (
                paginatedRequests.map((request) => {
                  const normalizedStatus = normalizeStatus(request.status);
                  const isApproved = normalizedStatus === "Approved";

                  return (
                    <div
                      key={request.requestId}
                      className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className="size-12 rounded-full bg-linear-to-br from-gray-50 to-gray-100 flex 
                          items-center justify-center text-sm font-semibold text-gray-600 border-2 border-gray-100"
                          >
                            {getInitials(request.employeeName)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2.5 mb-2">
                              <h3 className="font-semibold text-gray-800 text-base">
                                {request.requestType === "LEAVE"
                                  ? "Nghỉ phép"
                                  : request.requestType === "TIMESHEET_UPDATE"
                                  ? "Chấm công"
                                  : "Yêu cầu khác"}
                              </h3>

                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                  isApproved
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-rose-50 text-rose-700 border border-rose-100"
                                }`}
                              >
                                {isApproved ? "Đã phê duyệt" : "Đã từ chối"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{request.employeeName}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="cursor-pointer px-4 py-2.5 text-sm flex items-center gap-1.5 text-gray-700 font-medium 
                          hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
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
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-10 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    p === currentPage
                      ? "bg-gray-800 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
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
