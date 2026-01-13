import { useState } from "react";
import employeeApi from "../../api/employeeApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";

function UpdateTimeSheetCard({ data, onClose }) {
  const [newCheckIn, setNewCheckIn] = useState(
    data.checkIn !== "--:--" ? data.checkIn : ""
  );
  const [newCheckOut, setNewCheckOut] = useState(
    data.checkOut !== "--:--" ? data.checkOut : ""
  );
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do!");
      return;
    }

    const payload = {
      reason: reason.trim(),
      request_type: "TimeSheetUpdateRequest",
      attendanceDate: data.dateRaw,
      checkinTime: newCheckIn || null,
      checkoutTime: newCheckOut || null,
    };

    try {
      setLoading(true);
      const res = await employeeApi.makeUpdateTimeSheetRequest(payload);

      onClose();
      toast.success("Gửi yêu cầu thành công!");
    } catch (error) {
      console.error("❌ Lỗi gửi yêu cầu chỉnh sửa timesheet:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-[440px] rounded-2xl bg-white p-6 shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center px-4 py-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Yêu cầu chỉnh sửa chấm công
          </h2>
          <button
            className="p-2 rounded-lg hover:bg-red-100 transition cursor-pointer"
            aria-label="Đóng"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current info */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm space-y-1">
          <p>
            <span className="font-medium text-gray-600">Ngày:</span>{" "}
            <span className="text-gray-900">{data.date}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Check-in:</span>{" "}
            <span className="text-gray-900">{data.checkIn}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Check-out:</span>{" "}
            <span className="text-gray-900">{data.checkOut}</span>
          </p>
        </div>

        {/* Form */}
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">
            Thông tin mới
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Check-in
              </label>
              <input
                type="time"
                className="
              w-full rounded-lg border border-gray-300 px-3 py-2
              text-gray-900 outline-none
              focus:border-black focus:ring-1 focus:ring-black
            "
                value={newCheckIn}
                onChange={(e) => setNewCheckIn(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Check-out
              </label>
              <input
                type="time"
                className="
              w-full rounded-lg border border-gray-300 px-3 py-2
              text-gray-900 outline-none
              focus:border-black focus:ring-1 focus:ring-black
            "
                value={newCheckOut}
                onChange={(e) => setNewCheckOut(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Lý do
              </label>
              <textarea
                placeholder="Ví dụ: Quên chấm công, thiết bị lỗi..."
                className="
              h-20 w-full resize-none rounded-lg border border-gray-300 px-3 py-2
              text-gray-900 outline-none
              focus:border-black focus:ring-1 focus:ring-black
            "
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="
          rounded-lg border border-gray-300 px-4 py-2
          text-sm font-medium text-gray-700
          hover:bg-gray-100 transition cursor-pointer
        "
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
          rounded-lg bg-black px-4 py-2
          text-sm font-medium text-white
          hover:bg-gray-800 transition
          disabled:opacity-50 cursor-pointer
        "
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateTimeSheetCard;
