import { useState } from "react";
import employeeApi from "../../api/employeeApi";
import toast from "react-hot-toast";

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
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* popup */}
      <div className="relative bg-white rounded-xl p-6 w-[430px] shadow-lg animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">Yêu cầu chỉnh sửa chấm công</h2>

        {/* Thông tin hiện tại */}
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-400 text-sm">
          <p>
            <strong>Ngày:</strong> {data.date}
          </p>
          <p>
            <strong>Check-in:</strong> {data.checkIn}
          </p>
          <p>
            <strong>Check-out:</strong> {data.checkOut}
          </p>
        </div>

        {/* Form chỉnh sửa */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-sm">Thông tin mới</h3>

          <div className="flex flex-col gap-3 text-sm">
            <div>
              <label className="font-medium">Check-in</label>
              <input
                type="time"
                className="border w-full p-2 rounded-md border-gray-400"
                value={newCheckIn}
                onChange={(e) => setNewCheckIn(e.target.value)}
              />
            </div>

            <div>
              <label className="font-medium">Check-out</label>
              <input
                type="time"
                className="border w-full p-2 rounded-md border-gray-400"
                value={newCheckOut}
                onChange={(e) => setNewCheckOut(e.target.value)}
              />
            </div>

            <div>
              <label className="font-medium">Lý do</label>
              <textarea
                placeholder="Ví dụ: Quên chấm công, thiết bị lỗi..."
                className="border w-full p-2 rounded-md h-20 border-gray-400"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateTimeSheetCard;
