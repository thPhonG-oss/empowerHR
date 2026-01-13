import { Users, Home, ClipboardList, Clock, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RequestDetailPopup } from "../../components/manager/RequestDetailPopup";
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

  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchData = async () => {
    await Promise.all([fetchEmployeeCount(), fetchPendingRequests()]);
  };

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
    setRecentRequests(requests.slice(0, 4));
    setLoadingRequests(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const handleClosePopup = () => {
    setSelectedRequest(null);
  };

  const handleReloadData = () => {
    fetchData();
  };

  return (
    <main className="p-0 bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      <div className="mx-auto">
        <Header title="Tổng quan" icon={Home} />

        <div className="flex flex-col">
          <div className="grid grid-cols-2 pt-8 px-8 gap-6">
            {/* ✅ SỐ LƯỢNG NHÂN VIÊN PHÒNG BAN */}
            <div className="group rounded-3xl bg-linear-to-br from-blue-50 to-white p-7 shadow-sm hover:shadow-xl border border-blue-100 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1">
              <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-200 transition-shadow duration-300">
                <Users className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Nhân viên phòng ban
                </p>

                {loadingEmployeeCount ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {employeeCount}
                  </p>
                )}
              </div>
            </div>

            {/* YÊU CẦU CHỜ DUYỆT */}
            <div className="group rounded-3xl bg-linear-to-br from-amber-50 to-white p-7 shadow-sm hover:shadow-xl border border-amber-100 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1">
              <div className="p-4 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-amber-200 transition-shadow duration-300">
                <ClipboardList className="size-7 text-white" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Yêu cầu chờ duyệt
                </p>

                {loadingRequests ? (
                  <p className="text-xl font-semibold text-gray-400">
                    Đang tải...
                  </p>
                ) : (
                  <p className="text-3xl font-bold bg-linear-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                    {pendingRequestCount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 pt-8 px-8 gap-6 pb-8">
            <div className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Yêu cầu gần đây
                </h3>

                <button
                  onClick={() => navigate("/manager/request-management")}
                  className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex justify-between items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <span>Xem tất cả</span> <MoveRight size={16} />
                </button>
              </div>

              {loadingRequests ? (
                <p className="text-gray-400 text-center py-8">Đang tải...</p>
              ) : recentRequests.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Không có yêu cầu chờ duyệt
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentRequests.map((req) => (
                    <li
                      key={req.requestId}
                      onClick={() => handleRequestClick(req)}
                      className="flex justify-between items-start p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-100 cursor-pointer group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 group-hover:text-gray-950">
                            {req.employeeName}
                          </p>
                          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md">
                            {req.employeeCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">
                            {req.requestType === "LEAVE"
                              ? "Nghỉ phép"
                              : "Cập nhật chấm công"}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="line-clamp-1">{req.reason}</span>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                        Chờ duyệt
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Popup */}
      {selectedRequest && (
        <RequestDetailPopup
          request={selectedRequest}
          onClose={handleClosePopup}
          reloadData={handleReloadData}
        />
      )}
    </main>
  );
}

export default Dashboard;
