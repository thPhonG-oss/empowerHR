import { Users, Home, ClipboardList, Clock, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/common/Header";
import { getMyDepartmentEmployeeIds } from "../../utils/getMyDepartmentEmployeeIds";
import requestApi from "../../api/requestApi";

function Dashboard() {
  const navigate = useNavigate();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [loadingEmployeeCount, setLoadingEmployeeCount] = useState(true);

  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    async function fetchEmployeeCount() {
      setLoadingEmployeeCount(true);
      const employeeIds = await getMyDepartmentEmployeeIds();
      setEmployeeCount(employeeIds.length);
      setLoadingEmployeeCount(false);
    }

    async function fetchPendingRequests() {
      setLoadingRequests(true);
      const res = await requestApi.getUnresolved();
      const requests = res?.result?.requestResponseDTOS || [];

      setPendingRequestCount(requests.length);
      setRecentRequests(requests.slice(0, 4)); // ✅ lấy 4 request gần nhất
      setLoadingRequests(false);
    }

    fetchEmployeeCount();
    fetchPendingRequests();
  }, []);

  return (
    <main className="p-0">
      <div className="mx-auto">
        <Header title="Tổng quan" icon={Home} />

        <div className="flex flex-col">
          <div className="grid grid-cols-2 pt-6 px-6 gap-6">
            {/* ✅ SỐ LƯỢNG NHÂN VIÊN PHÒNG BAN */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-4 bg-gray-900 rounded-xl">
                <Users className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Nhân viên phòng ban</p>

                {loadingEmployeeCount ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {employeeCount}
                  </p>
                )}
              </div>
            </div>

            {/* thẻ khác giữ nguyên */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-4 bg-black rounded-xl">
                <ClipboardList className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Yêu cầu chờ duyệt</p>

                {loadingRequests ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingRequestCount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 pt-6 px-6 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 col-span-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Yêu cầu gần đây
                </h3>

                <button
                  onClick={() => navigate("/manager/request-management")}
                  className="cursor-pointer text-md font-medium text-blue-600 hover:text-blue-700 hover:font-bold flex justify-between items-center gap-1 transition duration-200"
                >
                  <span>Xem tất cả</span> <MoveRight size={16} />
                </button>
              </div>

              {loadingRequests ? (
                <p className="text-gray-400">Đang tải...</p>
              ) : recentRequests.length === 0 ? (
                <p className="text-gray-400">Không có yêu cầu chờ duyệt</p>
              ) : (
                <ul className="space-y-3">
                  {recentRequests.map((req) => (
                    <li
                      key={req.requestId}
                      className="flex justify-between items-start border-b border-gray-200 last:border-b-0 pb-2"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {req.employeeName} ({req.employeeCode})
                        </p>
                        <p className="text-sm text-gray-500">
                          {req.requestType} • {req.reason}
                        </p>
                      </div>

                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        PENDING
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
