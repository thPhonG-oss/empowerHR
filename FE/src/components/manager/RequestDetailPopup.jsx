import { useState } from "react";
import requestApi from "../../api/requestApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";

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
    }
  };

  const rejectRequest = async () => {
    try {
      await requestApi.reject(request.requestId, note);
      if (reloadData) reloadData();
      toast.success("Từ chối yêu cầu thành công");
    } catch (err) {
      toast.error("Từ chối yêu cầu thất bại");
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
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b bg-gray-100 border-gray-300">
            <h2 className="text-lg font-semibold text-gray-900">
              {isLeave
                ? "Xin nghỉ phép"
                : isTimesheet
                ? "Cập nhật chấm công"
                : "Yêu cầu"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:bg-red-100 p-1 rounded-md "
            >
              <X />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-900">
              <div>
                Người yêu cầu: <b>{request.employeeName}</b>
              </div>
              <div>Bộ phận: Developer</div>
              <div>Ngày yêu cầu: {formatDate(request.submitAt)}</div>

              {isLeave && (
                <>
                  <div>Bắt đầu: 08h00 - {formatDate(request.startDate)}</div>
                  <div>Kết thúc: 17h00 - {formatDate(request.endDate)}</div>
                </>
              )}

              {isTimesheet && (
                <>
                  <div>Checkin: {formatTimeOnly(request.checkinTime)}</div>
                  <div>Checkout: {formatTimeOnly(request.checkoutTime)}</div>
                </>
              )}
            </div>

            {isLeave && days > 0 && (
              <div className="mt-3 p-3 bg-gray-100 border border-gray-300 rounded">
                Tổng ngày nghỉ: <b>{days} ngày</b>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
              <p className="text-gray-500 mb-1">Lý do:</p>
              <p>{request.reason}</p>
            </div>

            <div className="mt-4 border border-gray-300 bg-gray-100 p-2 rounded">
              <img
                src={request.proofDocument}
                alt=""
                className="mx-auto max-h-64"
              />
            </div>

            {!isProcessed && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full mt-4 p-2 border border-gray-400 rounded focus:ring-gray-600"
                placeholder="Ghi chú quản lý..."
              />
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {!isProcessed && (
            <div className="flex justify-end gap-2 p-4 border-t border-gray-300">
              <button
                onClick={handleRejectClick}
                className="px-4 py-2 bg-red-500 hover:bg-red-700 cursor-pointer text-white rounded"
              >
                Từ chối
              </button>
              <button
                onClick={handleApproveClick}
                className="px-4 py-2 bg-black text-white cursor-pointer hover:opacity-85 rounded"
              >
                Phê duyệt
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-xl border border-gray-300">
            <p>
              Xác nhận {showConfirm === "approve" ? "phê duyệt" : "từ chối"} yêu
              cầu?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowConfirm(null)}>Hủy</button>
              <button
                onClick={confirmAction}
                className="bg-black text-white px-4 py-1 rounded"
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
