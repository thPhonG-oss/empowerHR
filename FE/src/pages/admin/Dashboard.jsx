import { Home, Users, Activity, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import runningActivityApi from "../../api/runningActivityApi";
import transactionsApi from "../../api/transactionsApi";
import Header from "../../components/common/Header";

function Dashboard() {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // Fetch users riêng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await adminApi.getAllUsers();
        setTotalUsers(res?.result?.length ?? 0);
      } catch (error) {
        console.error("Lỗi lấy danh sách nhân viên:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch activities riêng
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const activityRes = await runningActivityApi.adminGetAllActivity();
        setTotalActivities(activityRes?.result?.totalElements ?? 0);
      } catch (error) {
        console.error("Lỗi lấy danh sách hoạt động:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, []);

  // Fetch transactions riêng
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);
        const transactionRes = await transactionsApi.getAllTransactions();

        const top5Recent = (transactionRes?.result ?? [])
          .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
          .slice(0, 5);

        setRecentTransactions(top5Recent);
      } catch (error) {
        console.error("Lỗi lấy danh sách giao dịch:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="p-0 bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <Header title="Tổng quan" icon={Home} />

        {/* Content */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 pt-8 px-8 gap-6">
            {/* THẺ ĐẦU TIÊN: SỐ LƯỢNG NHÂN VIÊN - CLICKABLE */}
            <div
              onClick={() => navigate("/admin/employee-management")}
              className="group rounded-3xl bg-linear-to-br from-blue-50 to-white p-7 shadow-sm hover:shadow-xl border border-blue-100 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
              <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-200 transition-shadow duration-300">
                <Users className="size-7 text-white" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Tổng nhân viên
                </p>
                <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {loadingUsers ? "..." : totalUsers}
                </p>
              </div>

              <ArrowRight className="size-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* THẺ THỨ 2: TỔNG HOẠT ĐỘNG - CLICKABLE */}
            <div
              onClick={() => navigate("/admin/activity-management")}
              className="group rounded-3xl bg-linear-to-br from-emerald-50 to-white p-7 shadow-sm hover:shadow-xl border border-emerald-100 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
              <div className="p-4 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-emerald-200 transition-shadow duration-300">
                <Activity className="size-7 text-white" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Tổng hoạt động
                </p>
                <p className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  {loadingActivities ? "..." : totalActivities}
                </p>
              </div>

              <ArrowRight className="size-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 pt-8 px-8 gap-6 pb-8">
            <div className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Giao dịch gần đây
                </h3>
                <button
                  onClick={() => navigate("/admin/rewards")}
                  className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex justify-between items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <span>Xem tất cả</span> <ArrowRight size={16} />
                </button>
              </div>

              {loadingTransactions ? (
                <p className="text-gray-400 text-center py-8">Đang tải...</p>
              ) : recentTransactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Chưa có giao dịch nào
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <li
                      key={tx.transactionId}
                      className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-100"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {tx.employeeName}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {tx.transactionType === "REWARD"
                            ? "Nhận thưởng"
                            : tx.transactionType === "REDEEM"
                            ? "Đổi quà"
                            : tx.transactionType}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-bold text-lg mb-1 ${
                            tx.transactionType === "REWARD"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.transactionType === "REWARD" ? "+" : "-"}
                          {tx.points} điểm
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(tx.createAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
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
