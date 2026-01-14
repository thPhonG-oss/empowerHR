import { Home, Gem, Calendar, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/common/Header";
import AttendanceCard from "../../components/employee/AttendanceCard";
import pointAccountApi from "../../api/pointAccountApi";
import runningActivityApi from "../../api/runningActivityApi";
import employeeApi from "../../api/employeeApi";
import { getCurrentDateParts } from "../../utils/date";
import { getMyId } from "../../utils/getMyId";
import { getLeaveTypes } from "../../utils/leaveType";

function Dashboard() {
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [currentRequest, setCurrentRequest] = useState([]);
  const [currentActivities, setCurrentActivities] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const navigate = useNavigate();
  const { month, year } = getCurrentDateParts();

  // ================== FETCH ĐIỂM THƯỞNG ==================
  const fetchPointData = async () => {
    try {
      const pointRes = await pointAccountApi.getMyPoint();
      setPointData(pointRes.data);
    } catch (error) {
      console.error("❌ Failed to fetch point data:", error);
    }
  };

  // ================== FETCH CHẤM CÔNG ==================
  const fetchAttendanceData = async () => {
    try {
      const resAttendances = await employeeApi.getMyAttendances();
      const attendances = resAttendances.result || [];

      const attendanceCountInMonth = attendances.filter((item) => {
        const d = new Date(item.attendanceDate);
        const itemMonth = d.getMonth() + 1;
        const itemYear = d.getFullYear();

        return itemMonth === month && itemYear === year;
      }).length;

      setAttendanceCount(attendanceCountInMonth);
    } catch (error) {
      console.error("❌ Failed to fetch attendance data:", error);
    }
  };

  // ================== FETCH YÊU CẦU ==================
  const fetchRequestData = async () => {
    try {
      const requests = await employeeApi.getMyRequest(1, 10000);
      const rawRequests = requests?.result?.requestResponseDTOS || [];

      const latestRequests = rawRequests
        .slice()
        .sort((a, b) => new Date(b.submitAt) - new Date(a.submitAt))
        .slice(0, 4);

      setCurrentRequest(latestRequests);
    } catch (error) {
      console.error("❌ Failed to fetch request data:", error);
    }
  };

  // ================== FETCH HOẠT ĐỘNG ==================
  const fetchActivitiesData = async (myId) => {
    try {
      const activitiesRes =
        await runningActivityApi.employeeGetAllRegisteredActivity(myId);
      const rawActivities = activitiesRes?.result || [];

      const latestActivities = rawActivities
        .slice()
        .sort(
          (a, b) =>
            new Date(b.runningActivity?.startDate) -
            new Date(a.runningActivity?.startDate)
        )
        .slice(0, 4);

      setCurrentActivities(latestActivities);
    } catch (error) {
      console.error("❌ Failed to fetch activities data:", error);
    }
  };

  // ================== FETCH NGHỈ PHÉP ==================
  const fetchLeaveBalances = async () => {
    try {
      const leaveTypes = await getLeaveTypes();

      const balances = await Promise.all(
        leaveTypes.map(async (type) => {
          const res = await employeeApi.filterLeaveType(type.id);

          return {
            leaveTypeId: type.id,
            leaveTypeName: type.name,
            remainingLeave: res.result?.remainingLeave ?? 0,
            usedLeave: res.result?.usedLeave ?? 0,
          };
        })
      );

      setLeaveBalances(balances);
    } catch (error) {
      console.error("❌ Failed to fetch leave balance data:", error);
    }
  };

  // ================== FETCH TẤT CẢ DỮ LIỆU ==================
  const fetchAllData = async () => {
    setLoading(true);

    // Lấy myId trước
    let myId = null;
    try {
      myId = await getMyId();
    } catch (error) {
      console.error("❌ Failed to get myId:", error);
    }

    // Gọi tất cả các hàm fetch độc lập
    await Promise.allSettled([
      fetchPointData(),
      fetchAttendanceData(),
      fetchRequestData(),
      myId ? fetchActivitiesData(myId) : Promise.resolve(),
      fetchLeaveBalances(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <main className="p-0 bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      <div className="mx-auto">
        {/* ================== HEADER ================== */}
        <Header title="Tổng quan" icon={Home} />

        {/* ================== CONTENT ================== */}
        <div className="flex flex-col">
          {/* ===== TOP CARDS ===== */}
          <div className="grid grid-cols-4 pt-8 px-8 gap-6">
            {/* ===== POINT CARD ===== */}
            <div
              onClick={() => navigate("/employee/rewards")}
              className="group rounded-3xl bg-linear-to-br from-amber-50 to-white p-7 shadow-sm hover:shadow-xl border border-amber-100 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="p-4 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-amber-200 transition-shadow duration-300">
                <Gem className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Điểm thưởng hiện tại
                </p>

                {loading ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold bg-linear-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                    {pointData?.currentPoints?.toLocaleString() ?? 0} pts
                  </p>
                )}
              </div>
            </div>

            {/* ===== ATTENDANCE COUNT CARD ===== */}
            <div
              onClick={() => navigate("/employee/attendance")}
              className="group rounded-3xl bg-linear-to-br from-blue-50 to-white p-7 shadow-sm hover:shadow-xl border border-blue-100 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-200 transition-shadow duration-300">
                <Calendar className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Ngày đi làm trong tháng
                </p>

                {loading ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {attendanceCount} ngày
                  </p>
                )}
              </div>
            </div>

            {/* ===== ATTENDANCE CARD ===== */}
            <AttendanceCard
              isDashboard={true}
              className="col-start-3 col-span-2"
            />
          </div>

          {/* ===== BOTTOM CARDS ===== */}
          <div className="grid grid-cols-3 p-8 gap-6">
            {/* ===== RECENT REQUESTS ===== */}
            <div className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Yêu cầu gần đây
                </h3>

                <button
                  onClick={() => navigate("/employee/request-history")}
                  className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex justify-between items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <span>Xem tất cả</span> <MoveRight size={16} />
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400 text-center py-8">Đang tải...</p>
              ) : currentRequest.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Chưa có yêu cầu nào
                </p>
              ) : (
                <ul className="space-y-3">
                  {currentRequest.map((req) => (
                    <li
                      key={req.requestId}
                      onClick={() => navigate("/employee/request-history")}
                      className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-100 cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {req.requestType === "LEAVE"
                            ? "Nghỉ phép"
                            : "Cập nhật chấm công"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(req.submitAt).toLocaleString("vi-VN")}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          req.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status === "Approved"
                          ? "Chấp nhận"
                          : req.status === "Rejected"
                          ? "Từ chối"
                          : "Chờ xử lý"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== HOẠT ĐỘNG SẮP DIỄN RA ===== */}
            <div className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Hoạt động sắp diễn ra
                </h3>

                <button
                  onClick={() => navigate("/employee/activities")}
                  className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex justify-between items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <span>Xem tất cả</span> <MoveRight size={16} />
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400 text-center py-8">Đang tải...</p>
              ) : currentActivities.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Chưa đăng ký hoạt động nào
                </p>
              ) : (
                <ul className="space-y-3">
                  {currentActivities.map((act) => (
                    <li
                      key={act.participateInId}
                      onClick={() => navigate("/employee/activities")}
                      className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-100 cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {act.activityTitle || act.runningActivity?.title}
                        </p>

                        <p className="text-xs text-gray-500 font-medium">
                          {act.completedDate
                            ? `Hoàn thành: ${new Date(
                                act.completedDate
                              ).toLocaleDateString("vi-VN")}`
                            : `Bắt đầu: ${new Date(
                                act.runningActivity?.startDate
                              ).toLocaleDateString("vi-VN")}`}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          act.isCompleted
                            ? "bg-green-100 text-green-700"
                            : act.isCancelled
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {act.isCompleted
                          ? "Hoàn thành"
                          : act.isCancelled
                          ? "Đã huỷ"
                          : "Đang tham gia"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== SỐ DƯ NGHỈ PHÉP ===== */}
            <div
              onClick={() => navigate("/employee/leave-balance")}
              className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                Số dư nghỉ phép
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide border-b-2 border-gray-200">
                      <th className="pb-3">Loại nghỉ</th>
                      <th className="pb-3 text-center">Còn lại</th>
                      <th className="pb-3 text-center">Đã dùng</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaveBalances.map((item) => (
                      <tr
                        key={item.leaveTypeId}
                        className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 font-semibold text-gray-900">
                          {item.leaveTypeName}
                        </td>

                        <td className="py-4 text-center">
                          <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                            {item.remainingLeave}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ngày
                          </span>
                        </td>

                        <td className="py-4 text-center">
                          <span className="font-semibold text-gray-600">
                            {item.usedLeave}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ngày
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leaveBalances.length === 0 && (
                <p className="text-gray-400 text-sm text-center mt-6 py-4">
                  Chưa có dữ liệu nghỉ phép
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
