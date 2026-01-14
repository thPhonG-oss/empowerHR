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
import toast from "react-hot-toast";

function AccountManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [idBlock, setIdBlock] = useState(null);

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchData = async () => {
    try {
      const res = await adminApi.getAllUsers();
      setAccountList(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    departmentApi
      .getAllDepartment()
      .then((res) => setDepartments(res.result))
      .catch(() => {});
  }, []);

  useEffect(() => {
    positionApi
      .getAllPosition()
      .then((res) => setPositions(res.result))
      .catch(() => {});
  }, []);

  const handleBlockAccount = async () => {
    try {
      await adminApi.setStateAccount(idBlock);
      toast.success("Khóa tài khoản thành công");
      fetchData();
    } catch {
      toast.error("Khóa tài khoản thất bại");
    }
    setIsConfirmPopupOpen(false);
  };

  const handleUnLockAccount = async (id) => {
    try {
      await adminApi.setStateAccount(id);
      toast.success("Mở khóa tài khoản thành công");
      fetchData();
    } catch {
      toast.error("Mở khóa tài khoản không thành công");
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
    <main className="relative bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <Header title="Quản lý tài khoản" icon={Contact} />

        <div className="p-6 space-y-6">
          {/* SEARCH */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Tìm kiếm tài khoản
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Nhập tên, mã NV hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>
          </div>

          {/* LIST */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">
              Danh sách tài khoản ({filtered.length})
            </h2>

            <div className="space-y-3">
              {paginatedEmployees.map((employee) => (
                <div
                  key={employee.employeeId}
                  className="border border-gray-200 rounded-xl p-5
                  bg-white hover:border-gray-300 hover:shadow-lg
                  transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="size-12 rounded-full bg-gray-100
                      flex items-center justify-center font-semibold
                      text-gray-700 border border-gray-200"
                      >
                        {employee.employeeName.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm tracking-wide">
                          {employee.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {employee.employeeCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          employee?.account?.accountStatus
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {employee?.account?.accountStatus
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </span>

                      {employee?.account?.accountStatus ? (
                        <button
                          title="khóa tài khoản"
                          onClick={() => {
                            setIdBlock(employee.employeeId);
                            setIsConfirmPopupOpen(true);
                          }}
                          className="p-2 rounded-lg cursor-pointer hover:-translate-y-0.5  hover:shadow-sm
                          text-gray-600  transition-all hover:bg-red-50"
                        >
                          <Unlock size={18} />
                        </button>
                      ) : (
                        <button
                          title="Mở khóa tài khoản"
                          onClick={() =>
                            handleUnLockAccount(employee.employeeId)
                          }
                          className="p-2 rounded-lg cursor-pointer hover:-translate-y-0.5  hover:shadow-sm
                          text-gray-600  transition-all hover:bg-green-50"
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
                className={`p-2 border border-gray-200 rounded-lg
                hover:bg-gray-100 disabled:opacity-40 transition-all ${
                  currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              {getPaginationButtons().map((page, idx) =>
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
                        ? "bg-gray-800 text-white border border-gray-800 shadow-sm "
                        : "border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`p-2 border border-gray-200 rounded-lg
                hover:bg-gray-100 disabled:opacity-40 transition-all ${
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
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
