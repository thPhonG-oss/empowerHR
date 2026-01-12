import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar } from "lucide-react"

import pointApi from "../../api/pointApi"

export default function TransactionPage() {

  // State
  const [filterType, setFilterType] = useState("Tất cả")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState([])
  const [isDateError, setIsDateError] = useState(false);
  const itemsPerPage = 8

  // Format date ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", { month: "short", day: "2-digit", year: "numeric" })
  }

  // Format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  const getTransactionTypeName = (type) => {
    const typeMap = {
      CashOut: "Đổi tiền thưởng",
      ActivityReward: "Quản lý thưởng",
      AdminGift: "Thưởng hoạt động",
      Other: "Khác",
    }
    return typeMap[type] || type
  }

  // Format
  const getTransactionTypeColor = (type) => {
    const colorMap = {
      CashOut: " text-red-800",
      ActivityReward: "text-blue-800",
      AdminGift: "text-green-800",
    }
    return colorMap[type] || "text-gray-800"
  }

  // Format điểm cộng - trừ
  const getPointsColor = (points) => {
    return points > 0 ? "text-green-600" : "text-red-600"
  }


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
        const response = await pointApi.getAllTransactions()
        const data = response.result 
        setTransactions(data)
        console.log("trans:",transactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = useMemo(() => {
  return transactions.filter((transaction) => {
    if (filterType !== "Tất cả" && transaction.transactionType !== filterType) {
      return false
    }

    if (startDate) {
      const transactionDate = new Date(transaction.createAt)
        .toISOString()
        .split("T")[0]
      if (transactionDate < startDate) return false
    }

    if (endDate) {
      const transactionDate = new Date(transaction.createAt)
        .toISOString()
        .split("T")[0]
      if (transactionDate > endDate) return false
    }

    if (
      searchTerm &&
      !transaction.employeeName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })
}, [transactions, filterType, startDate, endDate, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Handle reset filters
  const handleReset = () => {
    setFilterType("Tất cả")
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
    setIsDateError(false);
    setCurrentPage(1)
  }

  return (
    <div className="p-6 bg-white">


      {/* Filter Section */}
      <div className="mb-6 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Loại giao dịch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giao dịch
            </label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả</option>
              <option>CashOut</option>
              <option>ActivityReward</option>
              <option>AdminGift</option>
              <option>Other</option>
            </select>
          </div>

          {/* Từ ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  validateDates(e.target.value, endDate);
                  setCurrentPage(1)
                }}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDateError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`}
              />
              <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div></div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ giao dịch
            </label>
            <input
              type="text"
              placeholder="Nhập tên người giao dịch"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Đến ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  validateDates(startDate, e.target.value);
                  setCurrentPage(1)
                }}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${isDateError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`}
              />
              <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-end justify-end gap-2">
            <button
              onClick={() => {}}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Lọc
            </button>

            <button
              onClick={handleReset}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>

        </div>
      </div>


      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thời gian</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Loại giao dịch</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mô tả</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Chủ giao dịch</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.transactionId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{formatDate(transaction.createAt)}</div>
                    <div className="text-xs text-gray-500">{formatTime(transaction.createAt)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTransactionTypeColor(transaction.transactionType)}`}
                    >
                      {getTransactionTypeName(transaction.transactionType
)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.transactionType === "CashOut" && "Đổi tiền thưởng từ điểm tích lũy"}
                    {transaction.transactionType === "ActivityReward" && "Điểm thưởng từ hoạt động"}
                    {transaction.transactionType === "AdminGift" && "Quản lý thưởng điểm cho nhân viên"}
                    {transaction.transactionType === "Other" && "Khác"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.employeeName}</td>
                  <td
                    className={`px-6 py-4 text-sm font-medium text-right ${getPointsColor(transaction.transactionType === "CashOut" ? -transaction.points : transaction.points)}`}
                  >
                    {transaction.transactionType === "CashOut" ? "-" : "+"}
                    {transaction.points}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Không có giao dịch phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md font-medium ${
              currentPage === page ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-900 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
