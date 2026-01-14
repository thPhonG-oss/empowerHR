import { useState } from "react";
import requestApi from "../../api/requestApi";
import toast from "react-hot-toast";
import { X, Calendar, Clock, User, FileText, ImageIcon } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function formatTimeOnly(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${parseInt(hours)}h${minutes}`;
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export function RequestDetailPopup({ request, onClose, reloadData }) {
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [error, setError] = useState("");

  const isProcessed = request.status !== "Pending";
  const isLeave = request.requestType === "LEAVE";
  const isTimesheet = request.requestType === "TIMESHEET_UPDATE";

  const approveRequest = async () => {
    try {
      await requestApi.approve(request.requestId, note);
      if (reloadData) reloadData();
      toast.success("Phê duyệt yêu cầu thành công");
    } catch (err) {
      toast.error("Phê duyệt yêu cầu thất bại");
      console.error(err);
    }
  };

  const rejectRequest = async () => {
    try {
      await requestApi.reject(request.requestId, note);
      if (reloadData) reloadData();
      toast.success("Từ chối yêu cầu thành công");
    } catch (err) {
      toast.error("Từ chối yêu cầu thất bại");
      console.error(err);
    }
  };

  const handleApproveClick = () => {
    setShowConfirm("approve");
    setError("");
  };

  const handleRejectClick = () => {
    if (!note.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }
    setShowConfirm("reject");
    setError("");
  };

  const confirmAction = () => {
    if (showConfirm === "approve") approveRequest();
    else rejectRequest();
    setShowConfirm(null);
    onClose();
  };

  const days =
    isLeave && request.startDate && request.endDate
      ? calculateDays(request.startDate, request.endDate)
      : 0;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 " onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isLeave
                  ? "Xin nghỉ phép"
                  : isTimesheet
                  ? "Cập nhật chấm công"
                  : "Yêu cầu"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Chi tiết yêu cầu từ nhân viên
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:bg-red-100 p-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Employee Info Card */}
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-5 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <User size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Người yêu cầu
                    </p>
                    <p className="font-semibold text-gray-900">
                      {request.employeeName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FileText size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Bộ phận</p>
                    <p className="font-semibold text-gray-900">Developer</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Calendar size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Ngày yêu cầu</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(request.submitAt)}
                    </p>
                  </div>
                </div>
                {request.requestType === "TIMESHEET_UPDATE" &&
                  request.attendanceDate && (
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Calendar size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Ngày chấm công
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(request.attendanceDate)}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Time Details for Leave */}
            {isLeave && (
              <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-gray-600" />
                  Thời gian nghỉ phép
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                    <p className="font-semibold text-gray-900">
                      08h00 - {formatDate(request.startDate)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Kết thúc</p>
                    <p className="font-semibold text-gray-900">
                      17h00 - {formatDate(request.endDate)}
                    </p>
                  </div>
                </div>

                {days > 0 && (
                  <div className="mt-4 bg-linear-to-r from-black to-gray-800 text-white rounded-lg p-4 text-center">
                    <p className="text-sm opacity-90 mb-1">Tổng ngày nghỉ</p>
                    <p className="text-2xl font-bold">{days} ngày</p>
                  </div>
                )}
              </div>
            )}

            {/* Time Details for Timesheet */}
            {isTimesheet && (
              <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-gray-600" />
                  Thời gian chấm công
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Check-in</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {formatTimeOnly(request.checkinTime)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Check-out</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {formatTimeOnly(request.checkoutTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Lý do
              </h3>
              <p className="text-gray-700 leading-relaxed">{request.reason}</p>
            </div>

            {/* Proof Document */}
            {request.proofDocument && (
              <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon size={16} className="text-gray-600" />
                  Tài liệu minh chứng
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <img
                    src={request.proofDocument}
                    alt=""
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            {/* Manager Note */}
            {!isProcessed && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Ghi chú quản lý
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                  placeholder="Nhập ghi chú của bạn..."
                  rows="3"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="font-medium">⚠</span> {error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!isProcessed && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleRejectClick}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg 
                hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
              >
                Từ chối
              </button>
              <button
                onClick={handleApproveClick}
                className="px-5 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-black/20 cursor-pointer"
              >
                Phê duyệt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowConfirm(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  showConfirm === "approve" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <span className="text-3xl">
                  {showConfirm === "approve" ? "✓" : "✕"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Xác nhận hành động
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn{" "}
                {showConfirm === "approve" ? "phê duyệt" : "từ chối"} yêu cầu
                này không?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all duration-200 shadow-lg cursor-pointer ${
                  showConfirm === "approve"
                    ? "bg-green-600 hover:bg-green-700 shadow-green-600/30"
                    : "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
