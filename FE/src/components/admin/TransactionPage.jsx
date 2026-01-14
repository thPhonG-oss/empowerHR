import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Filter,
  X,
} from "lucide-react";

import pointApi from "../../api/pointApi";

export default function TransactionPage() {
  // State
  const [filterType, setFilterType] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [isDateError, setIsDateError] = useState(false);
  const itemsPerPage = 8;

  // Format date ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTypeName = (type) => {
    const typeMap = {
      CashOut: "Đổi tiền",
      ActivityReward: "Thưởng hoạt động",
      PerformanceReward: "Thưởng hiệu suất",
      MonthlyReward: "Thưởng hàng tháng",
      Other: "Khác",
    };
    return typeMap[type] || type;
  };

  // Format
  const getTransactionTypeColor = (type) => {
    const colorMap = {
      CashOut: "bg-red-50 text-red-800 border border-red-200",
      ActivityReward: "bg-blue-50 text-blue-800 border border-blue-200",
      PerformanceReward: "bg-green-50 text-green-800 border border-green-200",
      MonthlyReward: "bg-purple-50 text-purple-800 border border-purple-200",
      Other: "bg-gray-100 text-gray-800 border border-gray-300",
    };
    return colorMap[type] || "bg-gray-100 text-gray-800 border border-gray-300";
  };

  // Format điểm cộng - trừ
  const getPointsColor = (points) => {
    return points > 0 ? "text-green-600" : "text-red-600";
  };

  // Hàm kiểm tra tính hợp lệ của ngày
  const validateDates = (start, end) => {
    if (start && end && new Date(start) > new Date(end)) {
      setIsDateError(true);
      return false;
    }
    setIsDateError(false);
    return true;
  };

  // Fetch transactions
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await pointApi.getAllTransactions();
        const data = response.result;

        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    }
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (
        filterType !== "Tất cả" &&
        transaction.transactionType !== filterType
      ) {
        return false;
      }

      if (startDate) {
        const transactionDate = new Date(transaction.createAt)
          .toISOString()
          .split("T")[0];
        if (transactionDate < startDate) return false;
      }

      if (endDate) {
        const transactionDate = new Date(transaction.createAt)
          .toISOString()
          .split("T")[0];
        if (transactionDate > endDate) return false;
      }

      if (
        searchTerm &&
        !transaction.employeeName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, filterType, startDate, endDate, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle reset filters
  const handleReset = () => {
    setFilterType("Tất cả");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setIsDateError(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Lịch sử giao dịch
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi tất cả các giao dịch điểm thưởng
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Loại giao dịch */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Loại giao dịch
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-black focus:border-black transition-all font-medium"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="CashOut">Đổi tiền</option>
                <option value="ActivityReward">Thưởng hoạt động</option>
                <option value="PerformanceReward">Thưởng hiệu suất</option>
                <option value="MonthlyReward">Thưởng hàng tháng</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            {/* Từ ngày */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Từ ngày
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    validateDates(e.target.value, endDate);
                    setCurrentPage(1);
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all font-medium ${
                    isDateError
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div></div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Chủ giao dịch
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên người giao dịch"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Đến ngày */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Đến ngày
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    validateDates(startDate, e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all font-medium ${
                    isDateError
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-end justify-center">
              <button
                onClick={handleReset}
                className="hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 active:bg-gray-300 font-semibold border-2 border-gray-300 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Loại giao dịch
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Chủ giao dịch
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="font-semibold text-gray-900">
                          {formatDate(transaction.createAt)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {formatTime(transaction.createAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${getTransactionTypeColor(
                            transaction.transactionType
                          )}`}
                        >
                          {getTransactionTypeName(transaction.transactionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.transactionType === "CashOut" &&
                          "Đổi tiền thưởng từ điểm tích lũy"}
                        {transaction.transactionType === "ActivityReward" &&
                          "Điểm thưởng từ hoạt động"}
                        {transaction.transactionType === "PerformanceReward" &&
                          "Quản lý thưởng điểm cho nhân viên"}
                        {transaction.transactionType === "MonthlyReward" &&
                          "Phân bổ điểm thưởng hàng tháng"}
                        {transaction.transactionType === "Other" && "Khác"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {transaction.employeeName}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-bold text-right tabular-nums ${getPointsColor(
                          transaction.transactionType === "CashOut"
                            ? -transaction.points
                            : transaction.points
                        )}`}
                      >
                        {transaction.transactionType === "CashOut" ? "-" : "+"}
                        {transaction.points}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-12 h-12 mb-3" />
                        <p className="text-gray-500 font-medium">
                          Không có giao dịch phù hợp
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer  p-2.5 border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`cursor-pointer px-4 py-2.5 rounded-lg font-bold transition-all ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "border-2 border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer p-2.5 border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
