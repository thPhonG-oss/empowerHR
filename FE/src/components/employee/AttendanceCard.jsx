import { Clock, LogIn, LogOut, ArrowRight } from "lucide-react";
import { getCurrentDateParts } from "../../utils/date";
import { useState, useEffect } from "react";
import employeeApi from "../../api/employeeApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AttendanceCard({ isDashboard = false, onSuccess, className = "" }) {
  const [checkInTime, setCheckInTime] = useState("--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIn, setIsIn] = useState(true);
  const [isOut, setIsOut] = useState(false);

  const navigate = useNavigate();
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
      onSuccess();
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
      onSuccess();
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
        className={`relative rounded-3xl bg-white p-8 shadow-sm border border-gray-100 ${className}`}
      >
        {/* Header with Detail Button */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-semibold text-xl text-gray-900 tracking-tight">
              {isDashboard ? "Chấm công nhanh" : "Chấm công hôm nay"}
            </h1>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">
              {dayOfWeek}, {day} tháng {month}, {year}
            </p>
          </div>

          {isDashboard && (
            <button
              onClick={() => navigate("/employee/attendance")}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
            >
              Chi tiết chấm công
              <ArrowRight size={16} className="text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex justify-between items-center gap-8">
          {/* Time info */}
          <div className="flex gap-5">
            {/* Check-in */}
            <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-2xl px-5 py-4 min-w-[140px] shadow-sm">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Check-in
              </p>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <Clock size={16} className="text-gray-600" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  {checkInTime}
                </span>
              </div>
            </div>

            {/* Check-out */}
            <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-2xl px-5 py-4 min-w-[140px] shadow-sm">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Check-out
              </p>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <Clock size={16} className="text-gray-600" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
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
                  cursor-pointer
                  inline-flex items-center gap-2.5
                  px-6 py-3 rounded-xl font-medium text-sm
                  transition-all duration-200 shadow-sm
                  ${
                    isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  }
                `}
              >
                <LogIn size={18} />
                <span className="font-semibold">
                  {isSubmitting ? "Đang xử lý..." : "Bắt đầu làm việc"}
                </span>
              </button>
            )}

            {!isIn && isOut && (
              <button
                onClick={handleCheckOut}
                disabled={isSubmitting}
                className={`
                  cursor-pointer
                  inline-flex items-center gap-2.5
                  px-6 py-3 rounded-xl font-medium text-sm
                  transition-all duration-200 shadow-sm
                  ${
                    isSubmitting
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  }
                `}
              >
                <LogOut size={18} />
                <span className="font-semibold">
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
