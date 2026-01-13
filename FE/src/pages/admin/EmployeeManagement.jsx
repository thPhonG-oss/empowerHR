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

  const itemsPerPage = 6;

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

  const fetchDataUser = async () => {
    try {
      const res = await adminApi.getAllUsers();

      setEmployeeList(res.result);
      localStorage.setItem("employeeList", JSON.stringify(res.result));
    } catch (err) {
      console.error("Lỗi khi load danh sách nhân viên:", err);
    }
  };
  // Load danh sách nhân viên từ API
  useEffect(() => {
    fetchDataUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, department, position]);

  return (
    <main className="p-0 relative">
      <div className="mx-auto">
        <Header title="Quản lý nhân viên" icon={Contact} />

        <div className="p-6 space-y-5">
          {/* SEARCH */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Tìm kiếm nhân viên
            </h2>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Nhập tên, ID hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg
              focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-colors"
              />

              <div className="relative md:w-48">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg
                bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 appearance-none"
                >
                  <option value="">Phòng ban</option>
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentName}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>

              <div className="relative md:w-48">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg
                bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 appearance-none"
                >
                  <option value="">Chức vụ</option>
                  {positions.map((p) => (
                    <option key={p.positionId} value={p.positionName}>
                      {p.positionName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Danh sách nhân viên ({totalItems})
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Cập nhật danh sách nhân viên
                </p>
              </div>

              <button
                onClick={() => setIsAddCardOpen(true)}
                className="px-5 py-2.5 text-sm font-medium rounded-lg
              bg-blue-600 text-white hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Thêm nhân viên
              </button>
            </div>

            {/* STAFF CARD */}
            <div className="space-y-3">
              {currentStaff.map((staff) => (
                <div
                  key={staff.employeeId}
                  onClick={() =>
                    navigate(`/admin/employee-management/${staff.employeeId}`)
                  }
                  className="cursor-pointer group border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="size-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200
                      flex items-center justify-center font-semibold text-gray-700 border border-gray-200"
                      >
                        {staff.employeeName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {staff.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {staff.employeeCode}
                        </p>

                        <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="size-3.5 text-gray-400" />
                            <span className="truncate">{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="size-3.5 text-gray-400" />
                            <span>{staff.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="size-4 text-gray-600" />
                </button>

                {generatePaginationPages().map((page, idx) => (
                  <div key={idx}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-sm text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-gray-900 text-white border border-gray-900"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < totalPages ? prev + 1 : prev
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="size-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Employee Card */}{" "}
      {isAddCardOpen && (
        <AddEmployeeCard
          isOpen={isAddCardOpen}
          onClose={() => setIsAddCardOpen(false)}
          onAddSuccess={fetchDataUser}
        />
      )}
    </main>
  );
}

export default StaffManagement;
