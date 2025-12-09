import { CalendarClock } from "lucide-react";
import Header from "../../components/common/Header";

import UpdateTimeSheetCard from "../../components/employee/UpdateTimeSheetCard";
import AttendanceCard from "../../components/employee/AttendanceCard";
import { getRecentYears } from "../../utils/years";
import { getMonths } from "../../utils/months";
import employeeApi from "../../api/employeeApi";
import formatDate from "../../utils/formatDate";
import getDayOfWeek from "../../utils/dayOfWeek";

import { useEffect, useState } from "react";

const statusColor = {
  on: "text-green-700 bg-green-100 border-green-300",
  home: "text-yellow-700 bg-yellow-100 border-yellow-300",
  off: "text-red-700 bg-red-100 border-red-300",
  checkinNull: "text-blue-700 bg-blue-100 border-blue-300",
  checkoutNull: "text-blue-700 bg-blue-100 border-blue-300",
};

const statusText = {
  on: "Đi làm",
  home: "WFH",
  off: "Nghỉ làm",
  checkinNull: "Chưa Check-in",
  checkoutNull: "Chưa Check-out",
};

function Attendance() {
  const years = getRecentYears();
  const months = getMonths();
  const [attendances, setAttendances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // state bộ lọc
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());

  function convertStatus(checkinLocationStatus, checkinTime, checkoutTime) {
    if (!checkinTime) return "checkinNull";
    if (!checkoutTime) return "checkoutNull";
    if (checkinLocationStatus === "OnSite") return "on";
    if (checkinLocationStatus === "Remote") return "home";
    return "off";
  }

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await employeeApi.getMyAttendances();
        const data = res.result || [];

        const formatted = data.map((item) => ({
          id: item.attendanceId,
          dateRaw: item.attendanceDate,
          date: formatDate(item.attendanceDate),
          dayOfWeek: getDayOfWeek(item.attendanceDate),
          checkIn: item.checkinTime ? item.checkinTime.slice(0, 5) : "--:--",
          checkOut: item.checkoutTime ? item.checkoutTime.slice(0, 5) : "--:--",
          workingHours: `${item.workingHours}h`,
          status: convertStatus(
            item.checkinLocationStatus,
            item.checkinTime,
            item.checkoutTime
          ),
        }));

        setAttendances(formatted);
      } catch (error) {
        console.error("Failed to get attendances", error);
      }
    }

    fetchAttendance();
  }, []);

  useEffect(() => {
    const m = Number(month);
    const y = Number(year);

    const result = attendances.filter((a) => {
      const d = new Date(a.dateRaw);
      return d.getMonth() + 1 === m && d.getFullYear() === y;
    });

    setFiltered(result);
  }, [month, year, attendances]);

  return (
    <main className="p-0">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Bảng chấm công" icon={CalendarClock} />

        <div className="flex flex-col justify-start gap-6 p-4">
          <AttendanceCard />

          <div className="rounded-lg bg-white shadow-sm">
            <div className="px-6 pt-6 flex justify-between shadow-lg">
              <div className="mb-4">
                <h1 className="font-bold text-lg">
                  Chi tiết lịch sử chấm công
                </h1>
                <p className="text-[#595959] text-sm">
                  Lịch sử check-in, check-out hằng ngày
                </p>
              </div>

              {/* FILTER */}
              <div className="h-fit flex gap-4">
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="w-full mt-4 px-6">
              {/* Header */}
              <div className="grid grid-cols-8 font-semibold border-b border-gray-300 py-3 text-sm">
                <div>STT</div>
                <div>Ngày</div>
                <div>Thứ</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>Giờ làm</div>
                <div>Trạng thái</div>
                <div className="text-start">Hành động</div>
              </div>

              {/* BODY */}
              {filtered.map((att, index) => (
                <div
                  key={att.id}
                  className="grid grid-cols-8 py-3 border-t border-gray-300 text-sm items-center"
                >
                  <div>{index + 1}</div>
                  <div>{att.date}</div>
                  <div>{att.dayOfWeek}</div>
                  <div>{att.checkIn}</div>
                  <div>{att.checkOut}</div>
                  <div>{att.workingHours}</div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full border text-xs ${
                        statusColor[att.status]
                      }`}
                    >
                      {statusText[att.status]}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAttendance(att);
                      setShowPopup(true);
                    }}
                    className="w-fit text-blue-600 cursor-pointer hover:underline text-center"
                  >
                    Cập nhật
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="text-center py-6 text-gray-500 text-sm">
                  Không có dữ liệu chấm công
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <UpdateTimeSheetCard
          data={selectedAttendance}
          onClose={() => setShowPopup(false)}
        />
      )}
    </main>
  );
}

export default Attendance;
