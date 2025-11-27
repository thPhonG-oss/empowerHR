import Header from "../../components/common/Header";
import ConfirmPopup from "../../components/common/ComfirmPopup";
import adminApi from "../../api/adminApi";
import { useState, useEffect } from "react";
import {
  Contact,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const departments = [
  { id: 1, name: "Ban Giám Đốc" },
  { id: 2, name: "Phòng Nhân Sự" },
  { id: 3, name: "Phòng Kỹ Thuật" },
  { id: 4, name: "Phòng Kinh Doanh" },
  { id: 5, name: "Phòng Marketing" },
  { id: 6, name: "Phòng Kế Toán" },
  { id: 7, name: "Phòng Hành Chính" },
];

const positions = [
  { id: 1, name: "CEO" },
  { id: 2, name: "CTO" },
  { id: 3, name: "CFO" },
  { id: 4, name: "HR Manager" },
  { id: 5, name: "Department Manager" },
  { id: 6, name: "Team Leader" },
  { id: 7, name: "Senior Software Engineer" },
  { id: 8, name: "Software Engineer" },
  { id: 9, name: "Junior Software Engineer" },
  { id: 10, name: "Senior Business Analyst" },
  { id: 11, name: "Business Analyst" },
  { id: 12, name: "Junior Business Analyst" },
  { id: 13, name: "Senior QA Engineer" },
  { id: 14, name: "QA Engineer" },
  { id: 15, name: "Junior QA Engineer" },
  { id: 16, name: "Senior Designer" },
  { id: 17, name: "Designer" },
  { id: 18, name: "Junior Designer" },
  { id: 19, name: "DevOps Engineer" },
  { id: 20, name: "Data Analyst" },
  { id: 21, name: "Product Manager" },
  { id: 22, name: "Project Manager" },
  { id: 23, name: "Marketing Manager" },
  { id: 24, name: "Sales Manager" },
  { id: 25, name: "Accountant" },
  { id: 26, name: "HR Specialist" },
  { id: 27, name: "Receptionist" },
  { id: 28, name: "Intern" },
];

function AccountManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [idBlock, setIdBlock] = useState(null);
  const [isBlocking, setIsBlocking] = useState(false);

  // gọi axios api để lấy danh sách tài khoản nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getAllUsers();

        setAccountList(res.result);
        console.log(res.result);
        localStorage.setItem("employeeList", JSON.stringify(res.result));
      } catch (err) {
        console.error("Lỗi khi load danh sách nhân viên:", err);
      }
    };

    fetchData();
  }, []);

  // Khóa tài khoản
  const handleBlockAccount = async () => {
    try {
      await adminApi.setStateAccount(idBlock);

      // Update UI tại chỗ
      setAccountList((prev) =>
        prev.map((emp) =>
          emp.employeeId === idBlock ? { ...emp, isActive: false } : emp
        )
      );
    } catch (err) {
      console.error("Không thể khóa tài khoản", err);
    }

    setIsConfirmPopupOpen(false);
  };

  // Mở khóa tài khoản
  const handleUnLockAccount = async (id) => {
    try {
      await adminApi.setStateAccount(id);

      setAccountList((prev) =>
        prev.map((emp) =>
          emp.employeeId === id ? { ...emp, isActive: true } : emp
        )
      );
    } catch (err) {
      console.error("Không thể mở khóa tài khoản", err);
    }
  };

  // Filter employees
  const filtered = accountList.filter((emp) => {
    const text = searchQuery.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      emp.employeeName?.toLowerCase().includes(text) ||
      emp.employeeCode?.toLowerCase().includes(text) ||
      emp.email?.toLowerCase().includes(text) ||
      emp.phoneNumber?.includes(searchQuery);

    const matchesDept = department === "" || emp.department === department;

    const matchesRole = role === "" || emp.position === role;

    return matchesSearch && matchesDept && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Get unique departments and roles for dropdowns

  const roles = ["chủ tích", "nhân viên", "quản lý"];

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!buttons.includes(i)) buttons.push(i);
      }
      if (currentPage < totalPages - 2) buttons.push("...");
      buttons.push(totalPages);
    }
    return buttons;
  };

  return (
    <main className="p-0 relative">
      <div className="mx-auto">
        {/* Header */}
        <Header title={"Quản lý tài khoản"} icon={Contact} />
        {/* Search and Filter Section */}
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 z-10">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên, mã nhân viên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none 
             focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                {/* Mũi tên */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Employee List Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Danh sách nhân viên ({filtered?.length || 0})
              </h2>
              <p className="text-sm text-gray-500">
                Cập nhật danh sách sinh viên
              </p>
            </div>

            {/* Employee Cards */}
            <div className="space-y-4 mb-8">
              {paginatedEmployees?.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <div
                    key={employee.employeeId}
                    className="border border-gray-300 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    {/* Employee Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                        <span className="text-xl font-bold text-gray-600">
                          {employee.employeeName.charAt(0)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">
                          {employee.employeeName}
                        </h3>

                        <div className="flex gap-4 text-sm">
                          <div className="flex flex-col space-y-1">
                            <p className="text-gray-600">
                              Mã NV:{" "}
                              <span className="font-semibold">
                                {employee.employeeCode}
                              </span>
                            </p>

                            <p className="text-gray-600">
                              Mật khẩu:{" "}
                              <span className="font-semibold">●●●●●●●●</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 ml-4">
                      {/* Status Button */}
                      <div
                        className={`px-4 py-1 rounded-full text-white font-medium transition-colors ${
                          employee.isActive
                            ? "bg-green-400 hover:bg-green-500"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                      >
                        {employee.isActive ? "Hoạt động" : "Không hoạt động"}
                      </div>

                      {/* Lock Icon */}
                      {employee.isActive ? (
                        // Bấm để khóa → hiện popup
                        <button
                          onClick={() => {
                            setIdBlock(employee.employeeId);
                            setIsConfirmPopupOpen(true);
                          }}
                          className="p-2 text-green-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Unlock size={20} />
                        </button>
                      ) : (
                        // Bấm để mở khóa → gọi API trực tiếp
                        <button
                          onClick={() =>
                            handleUnLockAccount(employee.employeeId)
                          }
                          className="p-2 text-orange-500 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Lock size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Không tìm thấy nhân viên nào
                </p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>

              {getPaginationButtons().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={page === "..."}
                  className={`min-w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : page === "..."
                      ? "cursor-default"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isConfirmPopupOpen && (
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={() => setIsConfirmPopupOpen(false)}
          message="Bạn có chắc chắn muốn khóa tài khoản này?"
          onConfirm={handleBlockAccount}
        />
      )}
    </main>
  );
}

export default AccountManagement;
