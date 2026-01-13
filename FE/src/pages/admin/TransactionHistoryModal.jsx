import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, TrendingDown, History } from 'lucide-react';
import pointApi from '../../api/pointApi';

const TransactionHistoryModal = ({onClose, employee }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      fetchTransactions();
    }
  }, [employee]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      const response = await pointApi.getAllTranSactionsEmployee(employee.employeeId);
      if (response.code === '1000') {
      setTransactions(response.result || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString('vi-VN') || '0';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'N';
    const parts = name.split(' ');
    return parts[parts.length - 1][0].toUpperCase();
  };

  // Get transaction type label and color
  const getTransactionTypeInfo = (type) => {
    const typeMap = {
      'CashOut': { label: 'Đổi tiền', color: 'text-red-600 bg-red-50' },
      'ActivityReward': { label: 'Thưởng hoạt động', color: 'text-green-600 bg-green-50' },
      'PerformanceReward': { label: 'Quản lý thưởng hiệu suất', color: 'text-blue-600 bg-blue-50' },
      'MonthlyReward': { label: 'Thưởng hàng tháng', color: 'text-orange-600 bg-orange-50' },
      'Other': { label: 'Khác', color: 'text-gray-600 bg-gray-50' }
    };
    
    return typeMap[type] || { label: type, color: 'text-gray-600 bg-gray-50' };
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {getInitials(employee?.employeeName)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Lịch sử giao dịch
              </h2>
              <p className="text-sm text-gray-600">
                {employee?.employeeName} - {employee?.positionName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Điểm hiện tại</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(employee?.currentPoints)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Tổng điểm giao dịch</p>
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(employee?.totalEarns)}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Điểm đã dùng</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatNumber(employee?.totalTransferred)}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh sách giao dịch ({transactions.length})
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có giao dịch nào</p>
              </div>
            ) : (
              transactions.map((transaction) => {
                const typeInfo = getTransactionTypeInfo(transaction.transactionType);
                // CashOut always negative, others positive
                const isPositive = transaction.transactionType !== 'CashOut';
                const pointValue = transaction.transactionType === 'CashOut' 
                  ? -Math.abs(transaction.points)
                  : Math.abs(transaction.points);

                return (
                  <div
                    key={transaction.transactionId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                          {isPositive ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>

                        {/* Transaction Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium px-2 py-1 rounded ${typeInfo.color}`}>
                              {typeInfo.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{transaction.transactionId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(transaction.createAt)}</span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isPositive ? '+' : ''}{formatNumber(pointValue)}
                          </p>
                          <p className="text-xs text-gray-500">điểm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;