import { CalendarClock, Clock, LogIn } from "lucide-react";
import Header from "../../components/common/Header";

import AttendanceCard from "../../components/employee/AttendanceCard";
import { getRecentYears } from "../../utils/years";

import { getMonths } from "../../utils/months";

const attendances = [
  {
    id: 1,
    date: "01/01/2025",
    dayOfWeek: "Thứ 4",
    checkIn: "08:00",
    checkOut: "17:00",
    workingHours: "8.0h",
    status: "on",
  },
  {
    id: 2,
    date: "02/01/2025",
    dayOfWeek: "Thứ 5",
    checkIn: "08:50",
    checkOut: "17:00",
    workingHours: "7.2h",
    status: "home",
  },
  {
    id: 3,
    date: "03/01/2025",
    dayOfWeek: "Thứ 6",
    checkIn: "08:00",
    checkOut: "17:00",
    workingHours: "8.0h",
    status: "on",
  },
  {
    id: 4,
    date: "04/01/2025",
    dayOfWeek: "Thứ 7",
    checkIn: "--:--",
    checkOut: "--:--",
    workingHours: "0h",
    status: "off",
  },
  {
    id: 5,
    date: "05/01/2025",
    dayOfWeek: "Chủ nhật",
    checkIn: "08:00",
    checkOut: "17:00",
    workingHours: "8.0h",
    status: "on",
  },
  {
    id: 6,
    date: "06/01/2025",
    dayOfWeek: "Thứ 2",
    checkIn: "--:--",
    checkOut: "--:--",
    workingHours: "0h",
    status: "off",
  },
  {
    id: 7,
    date: "07/01/2025",
    dayOfWeek: "Thứ 3",
    checkIn: "08:50",
    checkOut: "17:00",
    workingHours: "7.2h",
    status: "home",
  },
  {
    id: 8,
    date: "08/01/2025",
    dayOfWeek: "Thứ 4",
    checkIn: "08:00",
    checkOut: "17:00",
    workingHours: "8.0h",
    status: "on",
  },
  {
    id: 9,
    date: "09/01/2025",
    dayOfWeek: "Thứ 5",
    checkIn: "08:00",
    checkOut: "17:00",
    workingHours: "8.0h",
    status: "on",
  },
  {
    id: 10,
    date: "10/01/2025",
    dayOfWeek: "Thứ 6",
    checkIn: "--:--",
    checkOut: "--:--",
    workingHours: "0h",
    status: "off",
  },
];

const statusColor = {
  on: "text-green-700 bg-green-100 border-green-300",
  home: "text-yellow-700 bg-yellow-100 border-yellow-300",
  off: "text-red-700 bg-red-100 border-red-300",
};

const statusText = {
  on: "Đi làm",
  home: "WFH",
  off: "Nghỉ làm",
};

function Attendance() {
  const years = getRecentYears();
  const months = getMonths();
  console.log(years);
  console.log(months);
  return (
    <main className="p-0">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <Header title="Bảng chấm công" icon={CalendarClock} />

        {/* Content */}
        <div className="flex flex-col justify-start gap-6 p-4">
          {/* Chấm công */}
          <AttendanceCard />
          {/* Bảng chấm công */}
          <div className="rounded-lg bg-white shadow-sm">
            {/*  */}
            <div className="px-6 pt-6 flex justify-between shadow-lg">
              <div className="mb-4">
                <h1 className="font-bold text-lg">
                  Chi tiết lịch sử chấm công
                </h1>
                <p className="text-[#595959] text-sm">
                  Lịch sử check-in, check-out hằng ngày
                </p>
              </div>
              <div className="h-fit flex gap-4">
                <select className="border border-gray-300 rounded-md p-2">
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select className="border border-gray-300 rounded-md p-2">
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Danh sách */}
            <div className="w-full mt-4 px-6">
              {/* Header */}
              <div className="grid grid-cols-9 font-semibold border-b border-gray-300 py-3 text-sm">
                <div>STT</div>
                <div>Ngày</div>
                <div>Thứ</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>Giờ làm</div>
                <div>Trạng thái</div>
                <div className="text-start">Hành động</div>
              </div>

              {/* Body */}
              {attendances.map((att, index) => (
                <div
                  key={att.id}
                  className="grid grid-cols-9 py-3 border-t border-gray-300 text-sm items-center"
                >
                  <div>{index + 1}</div>
                  <div>{att.date}</div>
                  <div>{att.dayOfWeek}</div>
                  <div>{att.checkIn}</div>
                  <div>{att.checkOut}</div>
                  <div>{att.workingHours}</div>

                  {/* Status */}
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full border text-xs ${
                        statusColor[att.status]
                      }`}
                    >
                      {statusText[att.status]}
                    </span>
                  </div>

                  {/* Action */}
                  <div className=" w-fit text-blue-600 cursor-pointer hover:underline text-center">
                    Cập nhật
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Attendance;
