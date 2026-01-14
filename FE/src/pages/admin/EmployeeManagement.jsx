import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Contact,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
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

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const itemsPerPage = 6;

  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      searchTerm === "" ||
      emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      department === "" || emp.department === department;

    const matchesPosition = position === "" || emp.position === position;

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
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentApi.getAllDepartment();
        setDepartments(res.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await positionApi.getAllPosition();
        setPositions(res.result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPositions();
  }, []);

  const fetchDataUser = async () => {
    try {
      const res = await adminApi.getAllUsers();
      setEmployeeList(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, department, position]);

  return (
    <main className="relative bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <Header title="Quản lý nhân viên" icon={Contact} />

        <div className="p-6 space-y-6">
          {/* SEARCH */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Tìm kiếm nhân viên
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Nhập tên, ID hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl
                bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200
                focus:border-gray-400 transition-all"
              />

              <div className="relative md:w-52">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl
                  bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200
                  focus:border-gray-400 appearance-none transition-all"
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

              <div className="relative md:w-52">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl
                  bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200
                  focus:border-gray-400 appearance-none transition-all"
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
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Danh sách nhân viên ({totalItems})
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Cập nhật danh sách nhân viên
                </p>
              </div>

              <button
                onClick={() => setIsAddCardOpen(true)}
                className="px-5 py-3 text-sm font-medium rounded-xl cursor-pointer
                bg-gray-900 text-white hover:bg-gray-800 transition-all hover:shadow-md flex justify-center items-center hover:-translate-y-0.5 "
              >
                <Plus size={18} />
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
                  className="cursor-pointer border border-gray-200 rounded-xl p-5
                  bg-white hover:border-gray-300 hover:shadow-lg
                  transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="size-12 rounded-full bg-gray-100
                    flex items-center justify-center font-semibold text-gray-700
                    border border-gray-200"
                    >
                      {staff.employeeName?.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm tracking-wide">
                        {staff.employeeName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {staff.employeeCode}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-600">
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
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg
                hover:bg-gray-100 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="size-4 text-gray-600" />
              </button>

              {generatePaginationPages().map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-3 py-2 text-sm text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      page === currentPage
                        ? "bg-gray-800 text-white border border-gray-800 shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg
                hover:bg-gray-100 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="size-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
