import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Contact,
  Mail,
  Phone,
  Edit2,
  Trash2,
  View,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Header from "../../components/common/Header";

import AddEmployeeCard from "../../components/admin/AddEmployeeCard";
import ConfirmPopup from "../../components/common/ComfirmPopup";

import adminApi from "../../api/adminApi";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";

function StaffManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Thêm Staff vào danh sách cục bộ
  const [employeeList, setEmployeeList] = useState([]);

  const itemsPerPage = 10;

  const filteredEmployees = employeeList.filter((emp) => {
    // Search by name, employeeCode, or email
    const matchesSearch =
      searchTerm === "" ||
      emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by department
    const matchesDepartment = department == "" || emp.department == department;

    // Filter by position
    const matchesPosition = position === "" || emp.position == position;

    return matchesSearch && matchesDepartment && matchesPosition;
  });

  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStaff = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const generatePaginationPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  // const handleDeleteEmployee = () => {
  //   // Xóa giả
  //   setEmployeeList((prev) =>
  //     prev.filter((emp) => emp.employeeId !== employeeToDelete)
  //   );
  //   // Gọi API xóa ở đây
  //   setIsConfirmPopupOpen(false);
  // };

  // Load danh sách departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await departmentApi.getAllDepartment();
        setDepartments(res.result);
      } catch (err) {
        console.error("Lỗi khi load danh sách phòng ban");
      }
    };

    fetchData();
  }, []);

  // Load danh sách position
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await positionApi.getAllPosition();
        setPositions(res.result);
      } catch (err) {
        console.error("Lỗi khi load danh sách position");
      }
    };
    fetchData();
  }, []);

  // Load danh sách nhân viên từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getAllUsers();

        setEmployeeList(res.result);
        localStorage.setItem("employeeList", JSON.stringify(res.result));
      } catch (err) {
        console.error("Lỗi khi load danh sách nhân viên:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, department, position]);

  return (
    <main className="p-0 relative">
      <div className=" mx-auto">
        {/* Header */}
        <Header title="Quản lý nhân viên" icon={Contact} />

        {/* Content */}
        <div className="p-6 space-y-6 ">
          {/* Search Section */}
          <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tìm kiếm nhân viên
            </h2>

            <div className="flex flex-col md:flex-row gap-4 z-10">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên, ID hoặc email.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              {/* Department Dropdown */}
              <div className="relative w-full md:w-48">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentName}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>

                {/* Mũi tên */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 pointer-events-none" />
              </div>

              {/* Position Dropdown */}
              <div className="relative w-full md:w-48">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">Chọn chức vụ</option>

                  {positions.map((pos) => (
                    <option key={pos.positionId} value={pos.positionName}>
                      {pos.positionName}
                    </option>
                  ))}
                </select>
                {/* Mũi tên */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Staff List Section */}
          <div className="border border-gray-300 rounded-lg p-6 bg-[#F2F2F2]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Danh sách nhân viên ({totalItems})
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Cập nhật danh sách sinh viên
                </p>
              </div>
              <button
                onClick={() => setIsAddCardOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Thêm nhân viên
              </button>
            </div>

            {/* Staff Cards */}
            <div className="space-y-4">
              {currentStaff.map((staff) => (
                <div
                  key={staff.employeeId}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Avatar and Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="size-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                        {staff.employeeName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {staff.employeeName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {staff.employeeCode} -{" "}
                          {staff.gender === "Male"
                            ? "Nam"
                            : staff.gender === "Female"
                            ? "Nữ"
                            : "Khác"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="size-4" />
                            <span>{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <span>{staff.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Status and Actions */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          staff.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {staff.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                      </span>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/employee-management/${staff.employeeId}`
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit2 className="size-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/employee-management/${staff.employeeId}`
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                      >
                        <View className="size-4 text-gray-600" />
                      </button>
                      {/*<button
                        onClick={() => {
                          setEmployeeToDelete(staff.employeeId);
                          setIsConfirmPopupOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </button>
                      */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {/* Page Numbers */}
                {generatePaginationPages().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-600">...</span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < totalPages ? prev + 1 : prev
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Employee Card */}
      {isAddCardOpen && (
        <AddEmployeeCard
          positions={positions}
          departments={departments}
          isOpen={isAddCardOpen}
          onClose={() => setIsAddCardOpen(false)}
        />
      )}
      {/* {isConfirmPopupOpen && (
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={() => setIsConfirmPopupOpen(false)}
          message="Bạn có chắc chắn muốn xóa nhân viên này?"
          onConfirm={handleDeleteEmployee}
        />
      )} */}
    </main>
  );
}

export default StaffManagement;
