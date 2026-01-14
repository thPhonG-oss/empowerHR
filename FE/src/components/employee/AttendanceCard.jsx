import { Clock, LogIn, LogOut } from "lucide-react";
import { getCurrentDateParts } from "../../utils/date";
import { useState, useEffect } from "react";
import employeeApi from "../../api/employeeApi";
import toast from "react-hot-toast";

function AttendanceCard({ isDashboard = false, className = "" }) {
  const [checkInTime, setCheckInTime] = useState("--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIn, setIsIn] = useState(true);
  const [isOut, setIsOut] = useState(false);

  const { dayOfWeek, day, month, year } = getCurrentDateParts();

  // --- Lấy IP ---
  const getPublicIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();

      return data.ip;
    } catch (err) {
      console.error("Error getting public IP:", err);
      return "0.0.0.0";
    }
  };

  // ---- Fetch dữ liệu hôm nay ----
  const loadAttendance = async () => {
    try {
      const res = await employeeApi.getAttendanceToday();
      const data = res.result;

      if (!data.checkinTime) {
        setCheckInTime("--:--");
        setCheckOutTime("--:--");
        setIsIn(true);
        setIsOut(false);
        return;
      }

      setCheckInTime(data.checkinTime);
      setIsIn(false);

      if (!data.checkoutTime) {
        setCheckOutTime("--:--");
        setIsOut(true);
      } else {
        setCheckOutTime(data.checkoutTime);
        setIsOut(false);
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  // ---- Check-in ----
  const handleCheckIn = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const ip = await getPublicIP();

      await employeeApi.checkIn({
        ipCheckin: ip,
        checkinLocationStatus: "OnSite",
      });

      toast.success("Check-in thành công");

      await loadAttendance();
    } catch (error) {
      toast.error("Check-in thất bại");
      console.error("Check-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Check-out ----
  const handleCheckOut = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const ip = await getPublicIP();

      await employeeApi.checkOut({
        ipCheckout: ip,
        checkoutLocationStatus: "OnSite",
      });

      toast.success("Check-out thành công");

      await loadAttendance();
    } catch (error) {
      toast.error("Check-out thất bại");
      console.error("Check-out error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`rounded-2xl bg-white p-6 shadow-lg border border-gray-100  ${className}`}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold text-xl text-gray-900">
            {isDashboard ? "Chấm công nhanh" : "Chấm công hôm nay"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {dayOfWeek}, {day} tháng {month}, {year}
          </p>
        </div>

        <div className="flex justify-between items-center gap-6">
          {/* Time info */}
          <div className="flex gap-4">
            {/* Check-in */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 min-w-[120px]">
              <p className="text-xs text-gray-500 mb-1">Check-in</p>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <span className="text-lg font-semibold text-gray-900">
                  {checkInTime}
                </span>
              </div>
            </div>

            {/* Check-out */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 min-w-[120px]">
              <p className="text-xs text-gray-500 mb-1">Check-out</p>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <span className="text-lg font-semibold text-gray-900">
                  {checkOutTime}
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div>
            {isIn && !isOut && (
              <button
                onClick={handleCheckIn}
                disabled={isSubmitting}
                className={`
                  hover:-translate-y-0.5
                  cursor-pointer
                  inline-flex items-center gap-2
                  px-4 py-2.5 rounded-xl font-medium
                  transition-all
                  ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800 active:scale-95"
                  }
                `}
              >
                <LogIn size={18} />
                <span>
                  {isSubmitting ? "Đang xử lý..." : "Bắt đầu làm việc"}
                </span>
              </button>
            )}

            {!isIn && isOut && (
              <button
                onClick={handleCheckOut}
                disabled={isSubmitting}
                className={`
                  hover:-translate-y-0.5
                  cursor-pointer
                  inline-flex items-center gap-2
                  px-4 py-2.5 rounded-xl font-medium
                  transition-all
                  ${
                    isSubmitting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 active:scale-95"
                  }
                `}
              >
                <LogOut size={18} />
                <span>
                  {isSubmitting ? "Đang xử lý..." : "Kết thúc làm việc"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AttendanceCard;
