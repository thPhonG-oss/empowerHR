import { Home, Users, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import runningActivityApi from "../../api/runningActivityApi";
import transactionsApi from "../../api/transactionsApi";
import Header from "../../components/common/Header";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalActivities, setTotalActivities] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Lấy nhân viên
        const res = await adminApi.getAllUsers();
        setTotalUsers(res?.result?.length ?? 0);

        // Lấy hoạt động
        const activityRes = await runningActivityApi.adminGetAllActivity();
        setTotalActivities(activityRes?.result?.totalElements ?? 0);

        // Transactions - TOP 5 GẦN NHẤT
        const transactionRes = await transactionsApi.getAllTransactions();

        const top5Recent = (transactionRes?.result ?? [])
          .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
          .slice(0, 5);

        setRecentTransactions(top5Recent);
      } catch (error) {
        console.error("Lỗi lấy danh sách nhân viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="p-0">
      <div className="mx-auto">
        {/* Header */}
        <Header title="Tổng quan" icon={Home} />

        {/* Content */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 pt-6 px-6 gap-6">
            {/* THẺ ĐẦU TIÊN: SỐ LƯỢNG NHÂN VIÊN */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Users size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : totalUsers}
                </p>
              </div>
            </div>

            {/* THẺ THỨ 2: TỔNG HOẠT ĐỘNG */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <Activity size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : totalActivities}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 pt-6 px-6 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Giao dịch gần đây</h3>

              <ul className="space-y-3">
                {recentTransactions.map((tx) => (
                  <li
                    key={tx.transactionId}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {tx.employeeName}
                      </p>
                      <p className="text-gray-500">{tx.transactionType}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {tx.points} điểm
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
