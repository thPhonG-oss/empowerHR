import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Edit2, Eye, History } from "lucide-react";
import Fuse from "fuse.js";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";
import pointApi from "../../api/pointApi";
import TransactionHistoryModal from "./TransactionHistoryModal";

const EmployeeRewardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const itemsPerPage = 6;

  // Fetch data
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await pointApi.getPointAllEmployees();
      const employeesData = response.data;
      setEmployees(employeesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const departmentsResponse = await departmentApi.getAllDepartment();
      const Departments = departmentsResponse.result;
      setDepartments(Departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const positionsResponse = await positionApi.getAllPosition();
      setPositions(positionsResponse.result);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(employees, {
      keys: ["employeeName"],
      threshold: 0.1,
      ignoreLocation: true,
    });
  }, [employees]);

  // Filter and search logic
  const filteredEmployees = useMemo(() => {
    let result = employees;

    // Apply search
    if (searchTerm.trim()) {
      const fuseResults = fuse.search(searchTerm);
      result = fuseResults.map((item) => item.item);
    }

    // Apply department filter
    if (selectedDepartment) {
      result = result.filter(
        (emp) => emp.departmentName === selectedDepartment
      );
    }

    // Apply position filter
    if (selectedPosition) {
      result = result.filter((emp) => emp.positionName === selectedPosition);
    }

    return result;
  }, [employees, searchTerm, selectedDepartment, selectedPosition, fuse]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedPosition]);

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString("vi-VN") || "0";
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "N";
    const parts = name.split(" ");
    return parts[parts.length - 1][0].toUpperCase();
  };

  const handleViewHistory = (employee) => {
    setShowHistoryModal(true);
    setSelectedEmployee(employee);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Xem điểm nhân viên
          </h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nhập tên nhân viên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <div className="relative w-full md:w-64">
              <button
                onClick={() =>
                  setShowDepartmentDropdown(!showDepartmentDropdown)
                }
                className="cursor-pointer w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="text-gray-700">
                  {selectedDepartment || "Chọn phòng ban"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {showDepartmentDropdown && (
                <div className="cursor-pointer absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedDepartment("");
                      setShowDepartmentDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    Tất cả phòng ban
                  </div>
                  {departments.map((dept) => (
                    <div
                      key={dept.departmentId}
                      onClick={() => {
                        setSelectedDepartment(dept.departmentName);
                        setShowDepartmentDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      {dept.departmentName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Position Filter */}
            <div className="relative w-full md:w-64">
              <button
                onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                className="cursor-pointer w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="text-gray-700">
                  {selectedPosition || "Chọn chức vụ"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {showPositionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedPosition("");
                      setShowPositionDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    Tất cả chức vụ
                  </div>
                  {positions.map((pos) => (
                    <div
                      key={pos.positionId}
                      onClick={() => {
                        setSelectedPosition(pos.positionName);
                        setShowPositionDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      {pos.positionName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách nhân viên ({filteredEmployees.length})
            </h2>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paginatedEmployees.map((employee) => (
              <div
                key={employee.pointAccountId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center 
                    text-white font-semibold text-lg shrink-0"
                    >
                      {getInitials(employee.employeeName)}
                    </div>

                    {/* Employee Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {employee.employeeName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {employee.departmentName} - {employee.positionName}
                      </p>

                      {/* Points Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Điểm hiện tại:</span>
                          <span className="font-semibold text-blue-600">
                            {formatNumber(employee.currentPoints)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Điểm đã dùng:</span>
                          <span className="text-gray-700">
                            {formatNumber(employee.totalEarns)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewHistory(employee)}
                    className="hover:-translate-y-0.5 duration-300 cursor-pointer ml-3 px-4 py-2 bg-gray-200 text-black rounded-lg hover:shadow-md hover:bg-gray-300 
                    transition-all text-sm font-medium flex items-center gap-2 shrink-0"
                  >
                    <History className="w-4 h-4" />
                    Lịch sử
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy nhân viên nào</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`cursor-pointer px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 py-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {showHistoryModal && (
        <TransactionHistoryModal
          onClose={() => setShowHistoryModal(false)}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeRewardPage;
