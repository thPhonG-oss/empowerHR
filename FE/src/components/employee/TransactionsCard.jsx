import { useEffect, useState } from "react";
import transactionsApi from "../../api/transactionsApi";
import {
  Gift,
  Calendar,
  Target,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Gem,
} from "lucide-react";

/* =======================
   Transaction Type Mapper
======================= */
const transactionTypeConfig = {
  CashOut: {
    label: "Đổi tiền",
    icon: ArrowLeftRight,
    color: "text-red-500",
    bgColor: "bg-red-50",
    sign: "-",
  },
  ActivityReward: {
    label: "Thưởng hoạt động",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
    sign: "+",
  },
  PerformanceReward: {
    label: "Thưởng hiệu suất",
    icon: Gift,
    color: "text-green-600",
    bgColor: "bg-green-50",
    sign: "+",
  },
  MonthlyReward: {
    label: "Thưởng hàng tháng",
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-50",
    sign: "+",
  },
  Other: {
    label: "Khác",
    icon: MoreHorizontal,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    sign: "+",
  },
};

const PREVIEW_LIMIT = 2;

function TransactionsCard() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionsApi.getMyTransactions();

      const sorted = res.result.sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );

      setAllTransactions(sorted);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const displayedTransactions = showAll
    ? allTransactions
    : allTransactions.slice(0, PREVIEW_LIMIT);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-lg text-gray-800">
          Giao dịch gần đây
        </h3>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-sm mt-3">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && allTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <Gem className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Chưa có giao dịch nào</p>
        </div>
      )}

      {/* List */}
      {!loading && allTransactions.length > 0 && (
        <div className="space-y-1">
          {displayedTransactions.map((item) => {
            const config =
              transactionTypeConfig[item.transactionType] ||
              transactionTypeConfig.Other;

            const Icon = config.icon;

            return (
              <div
                key={item.transactionId}
                className="flex justify-between items-center py-3.5 px-3 hover:bg-gray-50 rounded-xl transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className={`${config.bgColor} p-2.5 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{config.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(item.createAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <p className={`font-semibold text-base ${config.color}`}>
                  {config.sign}
                  {item.points} pts
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Expand / Collapse */}
      {allTransactions.length > PREVIEW_LIMIT && (
        <div className="flex justify-center mt-4 pt-3 border-t border-gray-100">
          <button
            className="text-blue-600 font-medium flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors duration-150"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Thu gọn" : "Xem tất cả"}
            {showAll ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsCard;
