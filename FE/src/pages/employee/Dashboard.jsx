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

function Dashboard() {
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [currentRequest, setCurrentRequest] = useState([]);
  const [currentActivities, setCurrentActivities] = useState([]);
  const navigate = useNavigate();
  const { month, year } = getCurrentDateParts();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 🔥 lấy myId trước
      const myId = await getMyId();

      const [pointRes, resAttendances, requests, activitiesRes] =
        await Promise.all([
          pointAccountApi.getMyPoint(),
          employeeApi.getMyAttendances(),
          employeeApi.getMyRequest(1, 10000),
          runningActivityApi.employeeGetAllRegisteredActivity(myId),
        ]);

      /* ================== ĐIỂM THƯỞNG ================== */
      setPointData(pointRes.data);

      /* ================== CHẤM CÔNG THÁNG HIỆN TẠI ================== */
      const attendances = resAttendances.result || [];

      const attendanceCountInMonth = new Set(
        attendances
          .filter((item) => {
            const d = new Date(item.attendanceDate);
            return d.getMonth() === month - 1 && d.getFullYear() === year;
          })
          .map((item) => item.attendanceDate)
      ).size;

      setAttendanceCount(attendanceCountInMonth);

      /* ================== 4 REQUEST GẦN NHẤT ================== */
      const rawRequests = requests?.result?.requestResponseDTOS || [];

      const latestRequests = rawRequests
        .slice()
        .sort((a, b) => new Date(b.submitAt) - new Date(a.submitAt))
        .slice(0, 4);

      setCurrentRequest(latestRequests);

      /* ================== 4 HOẠT ĐỘNG ĐÃ ĐĂNG KÝ GẦN NHẤT (SORT THEO START DATE) ================== */
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
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-0">
      <div className="mx-auto">
        {/* ================== HEADER ================== */}
        <Header title="Tổng quan" icon={Home} />

        {/* ================== CONTENT ================== */}
        <div className="flex flex-col">
          {/* ===== TOP CARDS ===== */}
          <div className="grid grid-cols-4 pt-6 px-6 gap-6">
            {/* ===== POINT CARD ===== */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-4 bg-gray-900 rounded-xl">
                <Gem className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Điểm thưởng hiện tại</p>

                {loading ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {pointData?.currentPoints?.toLocaleString() ?? 0} pts
                  </p>
                )}
              </div>
            </div>

            {/* ===== ATTENDANCE COUNT CARD ===== */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-4 bg-gray-900 rounded-xl">
                <Calendar className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Ngày đi làm trong tháng</p>

                {loading ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
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
          <div className="grid grid-cols-2 p-6 gap-6">
            {/* ===== RECENT REQUESTS ===== */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Yêu cầu gần đây
                </h3>

                <button
                  onClick={() => navigate("/employee/request-history")}
                  className="cursor-pointer text-md font-medium text-blue-600 hover:text-blue-700 hover:font-bold flex justify-between items-center gap-1 transition duration-200"
                >
                  <span>Xem tất cả</span> <MoveRight size={16} />
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400">Đang tải...</p>
              ) : currentRequest.length === 0 ? (
                <p className="text-gray-400">Chưa có yêu cầu nào</p>
              ) : (
                <ul className="space-y-3">
                  {currentRequest.map((req) => (
                    <li
                      key={req.requestId}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {req.requestType === "LEAVE"
                            ? "Nghỉ phép"
                            : "Cập nhật chấm công"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(req.submitAt).toLocaleString("vi-VN")}
                        </p>
                      </div>

                      <span
                        className={`text-sm font-medium ${
                          req.status === "Approved"
                            ? "text-green-600"
                            : req.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
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

            {/* ===== PLACEHOLDER: HOẠT ĐỘNG GẦN ĐÂY ===== */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hoạt động sắp diễn ra
                </h3>

                <button
                  onClick={() => navigate("/employee/activities")}
                  className="cursor-pointer text-md font-medium text-blue-600 hover:text-blue-700 
                  hover:font-bold flex justify-between items-center gap-1 transition duration-200"
                >
                  <span>Xem tất cả</span> <MoveRight size={16} />
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400">Đang tải...</p>
              ) : currentActivities.length === 0 ? (
                <p className="text-gray-400">Chưa đăng ký hoạt động nào</p>
              ) : (
                <ul className="space-y-3">
                  {currentActivities.map((act) => (
                    <li
                      key={act.participateInId}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {act.activityTitle || act.runningActivity?.title}
                        </p>

                        <p className="text-sm text-gray-500">
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
                        className={`text-sm font-medium ${
                          act.isCompleted
                            ? "text-green-600"
                            : act.isCancelled
                            ? "text-red-600"
                            : "text-blue-600"
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
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
