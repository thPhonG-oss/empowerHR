import { useState, useEffect } from "react";
import {
  History,
  Award,
  Calendar,
  User,
  TrendingUp,
  Search,
} from "lucide-react";
import Fuse from "fuse.js";
import Header from "../../components/common/Header";
import transactionsApi from "../../api/transactionsApi";
import GiveRewardsModal from "../../components/manager/GiveRewardsModal";
import { Gift } from "lucide-react";

function PerformancePoints() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsApi.getAllTransactions();

      // Lọc chỉ lấy transactions có type là PerformanceReward
      const performanceRewards = (response.result || []).filter(
        (transaction) => transaction.transactionType === "PerformanceReward"
      );

      // Sắp xếp theo thời gian mới nhất
      const sortedTransactions = performanceRewards.sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );

      console.log(sortedTransactions);

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm với Fuse.js
  const fuse = new Fuse(transactions, {
    keys: ["employeeName"],
    threshold: 0.2,
  });

  const filteredTransactions = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : transactions;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Tính tổng điểm đã trao
  const totalPoints = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.points,
    0
  );

  return (
    <main className="p-0 relative">
      <div className="mx-auto">
        <Header title="Lịch sử trao thưởng" icon={History} />

        <div className="p-6 space-y-5">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-900 rounded-lg">
                  <Award className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tổng điểm đã trao</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-900 rounded-lg">
                  <TrendingUp className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số lần trao thưởng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredTransactions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Tìm kiếm lịch sử
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên nhân viên ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-colors"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Danh sách giao dịch
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Lịch sử trao thưởng điểm hiệu suất
                </p>
              </div>
              <div>
                <button
                  onClick={() => setIsOpenModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white font-medium
                           rounded-lg hover:bg-gray-800 transition-colors cursor-pointer hover:opacity-80 text-md"
                  title="Trao thưởng"
                >
                  <Gift className="size-4" />
                  <span className="">Thưởng</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block size-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 mt-3">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.transactionId}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Employee Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="size-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center font-semibold text-gray-700 shrink-0 border border-gray-200">
                          {transaction.employeeName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {transaction.employeeName}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="size-3.5 text-gray-400" />
                              <span>{formatDate(transaction.createAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Award className="size-3.5 text-gray-400" />
                              <span>Thưởng hiệu suất</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="shrink-0 text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-500 rounded-lg">
                          <Award className="size-4" />
                          <span className="font-bold text-md">
                            +{transaction.points.toLocaleString()} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 mb-4">
                  <History className="size-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy giao dịch nào"
                    : "Chưa có lịch sử trao thưởng"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <GiveRewardsModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        employee={null}
        onSuccess={fetchTransactions}
      />
    </main>
  );
}

export default PerformancePoints;
