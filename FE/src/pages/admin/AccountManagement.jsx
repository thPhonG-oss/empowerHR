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

import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";

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

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getAllUsers();
        setAccountList(res.result);
        localStorage.setItem("employeeList", JSON.stringify(res.result));
      } catch (err) {
        console.error("Lỗi khi load danh sách nhân viên:", err);
      }
    };
    fetchData();
  }, []);

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

  const handleBlockAccount = async () => {
    try {
      await adminApi.setStateAccount(idBlock);
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filtered.slice(startIdx, startIdx + itemsPerPage);

  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
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
        <Header title="Quản lý tài khoản" icon={Contact} />

        <div className="p-6 space-y-5">
          {/* SEARCH */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Tìm kiếm tài khoản
            </h2>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Nhập tên, mã NV hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />

              <div className="relative md:w-48">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 appearance-none"
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
            </div>
          </div>

          {/* LIST */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                Danh sách tài khoản ({filtered.length})
              </h2>
            </div>

            <div className="space-y-3">
              {paginatedEmployees.map((employee) => (
                <div
                  key={employee.employeeId}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                        {employee.employeeName.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {employee.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {employee.employeeCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          employee.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {employee.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>

                      {employee.isActive ? (
                        <button
                          onClick={() => {
                            setIdBlock(employee.employeeId);
                            setIsConfirmPopupOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 text-green-500 cursor-pointer"
                        >
                          <Unlock size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleUnLockAccount(employee.employeeId)
                          }
                          className="p-2 rounded-lg hover:bg-gray-100 text-orange-500 cursor-pointer"
                        >
                          <Lock size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              {getPaginationButtons().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={page === "..."}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    page === currentPage
                      ? "bg-gray-900 text-white"
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
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-40"
              >
                <ChevronRight size={18} />
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
