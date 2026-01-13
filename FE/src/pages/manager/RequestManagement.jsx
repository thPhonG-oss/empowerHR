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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestApi.getUnresolved();
        console.log(res.result.requestResponseDTOS);
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

  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "Pending");
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let filtered = pendingRequests;

    if (activeTab === "leave") {
      filtered = filtered.filter((r) => r.requestType === "LEAVE");
    } else if (activeTab === "timesheet") {
      filtered = filtered.filter((r) => r.requestType === "TIMESHEET_UPDATE");
    }

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

    return [...filtered].sort(
      (a, b) => new Date(b.submitAt) - new Date(a.submitAt)
    );
  }, [pendingRequests, activeTab, startDate, endDate]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // const handleApprove = (requestId, note) => {
  //   setRequests((prev) =>
  //     prev.map((r) =>
  //       r.requestId === requestId
  //         ? {
  //             ...r,
  //             status: "Approved",
  //             handleAt: new Date().toISOString(),
  //             responseReason: note || "Đã phê duyệt",
  //           }
  //         : r
  //     )
  //   );

  //   setSelectedRequest(null);
  // };

  // const handleReject = (requestId, reason) => {
  //   setRequests((prev) =>
  //     prev.map((r) =>
  //       r.requestId === requestId
  //         ? {
  //             ...r,
  //             status: "Rejected",
  //             handleAt: new Date().toISOString(),
  //             responseReason: reason,
  //           }
  //         : r
  //     )
  //   );

  //   setSelectedRequest(null);
  // };

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

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-gray-600 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-0 bg-gray-50">
      <div className="mx-auto">
        <Header title="Quản lý yêu cầu" icon={FileCheck} />

        <div className="py-4 px-6">
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 mb-1">
                    Danh sách yêu cầu
                  </h1>
                  <p className="text-xs text-gray-500">
                    Cần xem chi tiết từng yêu cầu trước khi phê duyệt
                  </p>
                </div>

                <Link
                  to="/manager/request-management/history"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Đã xử lý
                </Link>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-gray-200 cursor-pointer">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`pb-3 px-1 text-sm font-medium transition-all relative cursor-pointer ${
                    activeTab === "all"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Tất cả
                  {activeTab === "all" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>

                <button
                  onClick={() => handleTabChange("leave")}
                  className={`pb-3 px-1 text-sm font-medium transition-all relative cursor-pointer ${
                    activeTab === "leave"
                      ? "text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Nghỉ phép
                  {activeTab === "leave" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>

                <button
                  onClick={() => handleTabChange("timesheet")}
                  className={`pb-3 px-1 text-sm font-medium transition-all relative cursor-pointer ${
                    activeTab === "timesheet"
                      ? "text-amber-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Chấm công
                  {activeTab === "timesheet" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
                  )}
                </button>
              </div>

              {/* Filter by date */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="cursor-pointer px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw size={16} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    Thiết lập lại
                  </span>
                </button>
              </div>
            </div>

            {/* Request list */}
            <div className="mt-6 space-y-3">
              {paginatedRequests.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-gray-200">
                  Không có yêu cầu nào cần xử lý
                </div>
              ) : (
                paginatedRequests.map((request) => (
                  <div
                    key={request.requestId}
                    className={`border rounded-lg p-5 hover:shadow-md transition-all duration-200 ${
                      request.requestType === "LEAVE"
                        ? "bg-blue-50/30 border-blue-200"
                        : request.requestType === "TIMESHEET_UPDATE"
                        ? "bg-amber-50/30 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`mt-0.5 p-2 rounded-lg ${
                            request.requestType === "LEAVE"
                              ? "bg-blue-50"
                              : request.requestType === "TIMESHEET_UPDATE"
                              ? "bg-amber-50"
                              : "bg-gray-100"
                          }`}
                        >
                          <Clock
                            className={`w-4 h-4 ${
                              request.requestType === "LEAVE"
                                ? "text-blue-600"
                                : request.requestType === "TIMESHEET_UPDATE"
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold mb-1.5 text-sm ${
                              request.requestType === "LEAVE"
                                ? "text-blue-900"
                                : request.requestType === "TIMESHEET_UPDATE"
                                ? "text-amber-900"
                                : "text-gray-900"
                            }`}
                          >
                            {request.requestType === "LEAVE"
                              ? "Yêu cầu nghỉ phép"
                              : request.requestType === "TIMESHEET_UPDATE"
                              ? "Yêu cầu cập nhật giờ chấm công"
                              : "Yêu cầu khác"}
                          </h3>

                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            <span className="font-medium text-gray-700">
                              Người gửi:
                            </span>{" "}
                            {request.employeeName}
                            <br />
                            {request.requestType === "TIMESHEET_UPDATE" &&
                              request.attendanceDate && (
                                <>
                                  <span className="font-medium text-gray-700">
                                    Ngày chấm công:
                                  </span>{" "}
                                  {formatDate(request.attendanceDate)}
                                  <br />
                                </>
                              )}
                            <span className="font-medium text-gray-700">
                              Lý do:
                            </span>{" "}
                            {request.reason}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block px-2.5 py-1 text-xs font-medium rounded ${
                                  request.requestType === "LEAVE"
                                    ? "bg-blue-100 text-blue-700"
                                    : request.requestType === "TIMESHEET_UPDATE"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                Chờ phê duyệt
                              </span>
                              <p className="text-gray-600">
                                Gửi lúc:{" "}
                                <span className="font-medium text-gray-700">
                                  {formatDate(request.submitAt)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="cursor-pointer px-3 py-1.5 rounded-md text-xs font-medium border bg-gray-900 text-white 
                        border-gray-900 hover:bg-gray-800 transition-colors shrink-0"
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
                <p className="text-xs text-gray-500">
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
                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-gray-900 text-white border border-gray-900"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
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
                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors"
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
