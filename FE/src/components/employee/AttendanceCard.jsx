import { CalendarClock, Clock, LogIn, LogOut } from "lucide-react";
import { getCurrentDateParts } from "../../utils/date";
import { useState, useEffect } from "react";
import employeeApi from "../../api/employeeApi";
import toast from "react-hot-toast";

function AttendanceCard() {
  const [checkInTime, setCheckInTime] = useState("--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--");

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
    try {
      const ip = await getPublicIP();

      await employeeApi.checkIn({
        ipCheckin: ip,
        checkinLocationStatus: "OnSite",
      });

      toast.success("Check-in thành công");
      await new Promise((r) => setTimeout(r, 1000));
      window.location.reload();
      await loadAttendance();
    } catch (error) {
      toast.error("Check-in thất bại");
      console.error("Check-in error:", error);
    }
  };

  // ---- Check-out ----
  const handleCheckOut = async () => {
    try {
      const ip = await getPublicIP();

      await employeeApi.checkOut({
        ipCheckout: ip,
        checkoutLocationStatus: "OnSite",
      });
      toast.success("Check-out thành công");
      await new Promise((r) => setTimeout(r, 1000));
      window.location.reload();
      await loadAttendance();
    } catch (error) {
      toast.error("Check-out thất bại");

      console.error("Check-out error:", error);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h1 className="font-bold text-lg">Chấm công hôm nay</h1>
          <p className="text-[#595959] text-sm">
            {dayOfWeek}, {day} tháng {month}, {year}
          </p>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-4">
            <div>
              <p>Check-in</p>
              <p className="inline-flex items-center gap-2">
                <span>
                  <Clock size={20} className="text-[#595959]" />
                </span>
                <span className="font-extrabold">{checkInTime}</span>
              </p>
            </div>
            <div>
              <p>Check-out</p>
              <p className="inline-flex items-center gap-2">
                <span>
                  <Clock size={20} className="text-[#595959]" />
                </span>
                <span className="font-extrabold">{checkOutTime}</span>
              </p>
            </div>
          </div>

          <div>
            {isIn && !isOut && (
              <button
                onClick={handleCheckIn}
                className="inline-flex justify-center items-center gap-2 text-white bg-black p-2 rounded-lg cursor-pointer hover:opacity-80"
              >
                <LogIn />
                <span>Check-in</span>
              </button>
            )}

            {!isIn && isOut && (
              <button
                onClick={handleCheckOut}
                className="inline-flex justify-center items-center gap-2 border text-black bg-white p-2 rounded-lg cursor-pointer hover:opacity-80"
              >
                <LogOut />
                <span>Check-out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AttendanceCard;
