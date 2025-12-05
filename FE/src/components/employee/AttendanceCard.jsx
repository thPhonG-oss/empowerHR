import { CalendarClock, Clock, LogIn, LogOut } from "lucide-react";
import { getCurrentDateParts } from "../../utils/date";
import { useState } from "react";

// Mock time
const time = "hh:mm";

function AttendanceCard() {
  const [checkInTime, setCheckInTime] = useState("--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--");

  const [isIn, setIsIn] = useState(true); // true: checkin
  const [isOut, setIsOut] = useState(false); // true: checkout
  const { dayOfWeek, day, month, year } = getCurrentDateParts();

  const handleCheckIn = () => {
    setCheckInTime(time);
    setIsIn(false);
    setIsOut(true);
  };

  const handleCheckOut = () => {
    setCheckOutTime(time);
    setIsOut(false);
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
