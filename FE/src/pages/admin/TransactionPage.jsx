import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar } from "lucide-react"

export default function TransactionPage() {
  const mockTransactions = [
    {
      transactionId: 19,
      transactionType: "CashOut",
      points: 500,
      pointAccountId: 5,
      employeeId: 5,
      employeeName: "Nguyễn Dev A",
      createAt: "2026-01-04T23:04:56",
    },
    {
      transactionId: 20,
      transactionType: "ActivityReward",
      points: 250,
      pointAccountId: 6,
      employeeId: 6,
      employeeName: "Trần Dev B",
      createAt: "2026-01-04T23:04:56",
    },
    {
      transactionId: 21,
      transactionType: "AdminGift",
      points: 500,
      pointAccountId: 13,
      employeeId: 13,
      employeeName: "Dương HR B",
      createAt: "2026-01-04T23:04:56",
    },
    {
      transactionId: 22,
      transactionType: "CashOut",
      points: 300,
      pointAccountId: 7,
      employeeId: 7,
      employeeName: "Lê Dev C",
      createAt: "2025-10-10T14:30:00",
    },
    {
      transactionId: 23,
      transactionType: "ActivityReward",
      points: 150,
      pointAccountId: 8,
      employeeId: 8,
      employeeName: "Phạm Dev D",
      createAt: "2025-10-10T14:30:00",
    },
    {
      transactionId: 24,
      transactionType: "AdminGift",
      points: 1000,
      pointAccountId: 9,
      employeeId: 9,
      employeeName: "Vũ HR A",
      createAt: "2025-09-10T14:30:00",
    },
    {
      transactionId: 25,
      transactionType: "CashOut",
      points: 700,
      pointAccountId: 10,
      employeeId: 10,
      employeeName: "Hoàng Dev E",
      createAt: "2025-09-10T14:30:00",
    },
  ]

  // State 
  const [filterType, setFilterType] = useState("Tất cả")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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

  // Lọc
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      // Lọc theo type
      if (filterType !== "Tất cả" && transaction.transactionType !== filterType) {
        return false
      }

      // Filter theo ngày
      if (startDate) {
        const transactionDate = new Date(transaction.createAt).toISOString().split("T")[0]
        if (transactionDate < startDate) return false
      }
      if (endDate) {
        const transactionDate = new Date(transaction.createAt).toISOString().split("T")[0]
        if (transactionDate > endDate) return false
      }

      // Filter tên nhân viên
      if (searchTerm && !transaction.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      return true
    })
  }, [filterType, startDate, endDate, searchTerm])

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
    setCurrentPage(1)
  }

  // Mock API call (commented out for demo)
  // const fetchTransactions = async () => {
  //   try {
  //     const response = await axios.get("/api/transactions", {
  //       params: {
  //         transactionType: filterType === "Tất cả" ? null : filterType,
  //         startDate,
  //         endDate,
  //         search: searchTerm,
  //         page: currentPage,
  //         limit: itemsPerPage,
  //       },
  //     })
  //     // Handle response: setTransactions(response.data.result.content)
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error)
  //   }
  // }

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
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div></div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <input
              type="text"
              placeholder="Nhập mô tả, chủ giao dịch"
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
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                      {getTransactionTypeName(transaction.transactionType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.transactionType === "CashOut" && "Dối tiền thưởng từ điểm tích lũy"}
                    {transaction.transactionType === "ActivityReward" && "Quy đổi điểm sang tiền thưởng"}
                    {transaction.transactionType === "AdminGift" && "Thưởng hoạt động chào bổ"}
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
