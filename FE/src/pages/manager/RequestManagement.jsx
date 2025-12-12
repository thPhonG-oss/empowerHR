import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RequestDetailPopup } from "../../components/manager/RequestDetailPopup";
import Header from "../../components/common/Header";
import { FileCheck, RefreshCw, Clock } from "lucide-react";
import requestApi from "../../api/requestApi";

const ITEMS_PER_PAGE = 4;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RequestManagement() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ================================
  // 🔥 CALL API GET DATA
  // ================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestApi.getUnresolved();
        setRequests(res.result.requestResponseDTOS || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================================
  // 🔎 FILTER STATUS = PENDING
  // ================================
  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "Pending");
  }, [requests]);

  // ================================
  // 🔎 FILTER + SORT
  // ================================
  // 🔎 FILTER + SORT
  const filteredRequests = useMemo(() => {
    let filtered = pendingRequests;

    // Tab filter
    if (activeTab === "leave") {
      filtered = filtered.filter((r) => r.requestType === "LEAVE");
    } else if (activeTab === "timesheet") {
      filtered = filtered.filter((r) => r.requestType === "TIMESHEET_UPDATE");
    }

    // Date filter
    if (startDate) {
      filtered = filtered.filter(
        (r) => new Date(r.submitAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (r) => new Date(r.submitAt) <= new Date(endDate + "T23:59:59")
      );
    }

    // Sort by newest
    return [...filtered].sort(
      (a, b) => new Date(b.submitAt) - new Date(a.submitAt)
    );
  }, [pendingRequests, activeTab, startDate, endDate]);

  // ================================
  // 📄 PAGINATION
  // ================================
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // ================================
  // ✔ APPROVE
  // ================================
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
          : r
      )
    );

    setSelectedRequest(null);
  };

  // ================================
  // ❌ REJECT
  // ================================
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
          : r
      )
    );

    setSelectedRequest(null);
  };

  // Reload
  const reloadData = async () => {
    try {
      setLoading(true);
      const res = await requestApi.getUnresolved();
      setRequests(res.result.requestResponseDTOS || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // UI
  // ================================
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">Đang tải dữ liệu...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="p-0 bg-gray-50">
      <div className="mx-auto">
        <Header title="Quản lý yêu cầu" icon={FileCheck} />

        <div className="py-4 px-6">
          <div className="rounded-lg p-6 bg-white shadow-2xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 mb-1">
                    Danh sách yêu cầu
                  </h1>
                  <p className="text-sm text-gray-500">
                    Cần xem chi tiết từng yêu cầu trước khi phê duyệt
                  </p>
                </div>

                <Link
                  to={"/manager/request-management/history"}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800"
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Đã xử lý
                </Link>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-3 border-b border-gray-200">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "all"
                      ? "border-black text-black"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Tất cả
                </button>

                <button
                  onClick={() => handleTabChange("leave")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "leave"
                      ? "border-black text-black"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Nghỉ phép
                </button>

                <button
                  onClick={() => handleTabChange("timesheet")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "timesheet"
                      ? "border-black text-black"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Chấm công
                </button>
              </div>
              {/* Filter by date */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Từ ngày</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Đến ngày</label>
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
            </div>

            {/* Request list */}
            <div className="mt-6 space-y-4">
              {paginatedRequests.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg">
                  Không có yêu cầu nào cần xử lý
                </div>
              ) : (
                paginatedRequests.map((request) => (
                  <div
                    key={request.requestId}
                    className="border rounded-lg p-5 bg-orange-50 border-orange-200" // pending style
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* ICON giống history */}
                        <Clock className="w-5 h-5 text-orange-600" />

                        <div className="flex-1">
                          {/* Tiêu đề */}
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {request.requestType === "LEAVE"
                              ? "Yêu cầu nghỉ phép"
                              : request.requestType === "TIMESHEET_UPDATE"
                              ? "Yêu cầu cập nhật giờ chấm công"
                              : "Yêu cầu khác"}
                          </h3>

                          {/* Mô tả */}
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Người gửi:</span>{" "}
                            {request.employeeName}
                            <br />
                            <span className="font-medium">Lý do:</span>{" "}
                            {request.reason}
                          </p>

                          {/* Thời gian */}
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="inline-block bg-gray-700 text-white px-2 py-1 text-xs rounded mb-1">
                                Chờ phê duyệt
                              </span>

                              <p className="text-gray-700 font-medium">
                                Gửi lúc: {formatDate(request.submitAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nút chi tiết giống bên HistoryRequests */}
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-3 py-1 rounded text-sm font-medium border
                       bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer"
                      >
                        Chi tiết →
                      </button>
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
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredRequests.length
                  )}{" "}
                  / {filteredRequests.length} yêu cầu
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50"
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
                            : "border border-gray-300"
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
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Popup */}
      {selectedRequest && (
        <RequestDetailPopup
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          reloadData={reloadData}
        />
      )}
    </div>
  );
}
