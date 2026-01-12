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
          workingHours:
            item.workingHours === null ? "--" : `${item.workingHours}h`,
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

    setFiltered(
      attendances.filter((a) => {
        const d = new Date(a.dateRaw);
        return d.getMonth() + 1 === m && d.getFullYear() === y;
      })
    );
  }, [month, year, attendances]);

  return (
    <main>
      <div className="min-h-screen bg-gray-50">
        <Header title="Bảng chấm công" icon={CalendarClock} />

        <div className="flex flex-col gap-6 p-4">
          <AttendanceCard />

          <div className="rounded-2xl bg-white shadow-sm border border-gray-100">
            {/* Header + Filter */}
            <div className="flex justify-between items-center px-6 pt-6">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Chi tiết lịch sử chấm công
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Lịch sử check-in, check-out hằng ngày
                </p>
              </div>

              <div className="flex gap-3">
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                             focus:border-black focus:ring-1 focus:ring-black"
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
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                             focus:border-black focus:ring-1 focus:ring-black"
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

            {/* Table */}
            <div className="mt-4 px-6">
              <div
                className="grid grid-cols-8 border-b border-gray-200 py-3
                              text-sm font-semibold text-gray-700"
              >
                <div>STT</div>
                <div>Ngày</div>
                <div>Thứ</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>Giờ làm</div>
                <div>Trạng thái</div>
                <div className="text-center">Thao tác</div>
              </div>

              {filtered.map((att, index) => (
                <div
                  key={att.id}
                  className="grid grid-cols-8 items-center py-3 text-sm
                             border-t border-gray-100 hover:bg-gray-50"
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
                    className="text-sm font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    Cập nhật
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
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
