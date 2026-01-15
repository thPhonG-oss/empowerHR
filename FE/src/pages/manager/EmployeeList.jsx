import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Contact,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Gift,
} from "lucide-react";
import Header from "../../components/common/Header";
import GiveRewardsModal from "../../components/manager/GiveRewardsModal";
import { getMyId } from "../../utils/getMyId";

import departmentApi from "../../api/departmentApi";
import employeeApi from "../../api/employeeApi";

function ManagerEmployeeList() {
  const navigate = useNavigate();

  const [myDepartment, setMyDepartment] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);

  const [employeeList, setEmployeeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await employeeApi.getMyProfile();
        const myDeptName = profileRes.result.department;
        setMyDepartment(myDeptName);

        const depRes = await departmentApi.getAllDepartment();
        const deps = depRes.result || [];

        const dept = deps.find((d) => d.departmentName === myDeptName);
        if (!dept) return;

        setDepartmentId(dept.departmentId);

        const empRes = await departmentApi.getEmployeesInDepartment(
          dept.departmentId,
          currentPage,
          itemsPerPage
        );

        const data = empRes.result;

        const myId = await getMyId();

        const filteredEmployees = (data.employeeResponseDTOS || []).filter(
          (emp) => emp.employeeId !== myId
        );

        setEmployeeList(filteredEmployees);

        setTotalItems(data.totalElements || 0);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const filteredStaff = employeeList.filter((staff) => {
    const s = searchTerm.toLowerCase();
    return (
      staff.employeeName.toLowerCase().includes(s) ||
      staff.employeeCode.toLowerCase().includes(s) ||
      staff.email.toLowerCase().includes(s)
    );
  });

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
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleGiveReward = (e, employee) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setShowRewardsModal(true);
  };

  return (
    <>
      <main className="p-0 relative bg-gray-50 min-h-screen">
        <div className="mx-auto">
          <Header title="Quản lý nhóm" icon={Contact} />

          <div className="p-6 space-y-6 mx-auto">
            {/* Search Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Tìm kiếm nhân viên
                </h2>
                <div className="text-sm text-gray-500">
                  Phòng ban:{" "}
                  <span className="font-medium text-gray-700">
                    {myDepartment}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nhập tên, ID hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-gray-50 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Staff List Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Danh sách nhân viên
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalItems - 1} nhân viên thuộc {myDepartment}
                  </p>
                </div>
              </div>

              {/* Staff Cards */}
              <div className="space-y-3">
                {filteredStaff.map((staff) => (
                  <div
                    key={staff.employeeId}
                    className="group border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white cursor-pointer"
                    onClick={() =>
                      navigate(`/manager/team-management/${staff.employeeId}`)
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Avatar + Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="size-14 rounded-full bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center font-semibold text-gray-600 shrink-0 border-2 border-gray-100 text-lg">
                          {staff.employeeName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-base group-hover:text-gray-900 transition-colors">
                            {staff.employeeName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {staff.employeeCode} · {staff.gender}
                          </p>

                          <div className="flex items-center gap-5 mt-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="size-4 text-gray-400" />
                              <span className="truncate">{staff.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="size-4 text-gray-400" />
                              <span>{staff.phoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Give Reward Button */}
                        <button
                          onClick={(e) => handleGiveReward(e, staff)}
                          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white text-sm font-medium
                           rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-sm hover:-translate-y-0.5"
                          title="Trao thưởng"
                        >
                          <Gift className="size-4" />
                          <span>Thưởng</span>
                        </button>

                        {/* Status */}
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            staff.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {staff.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                    disabled={currentPage === 1}
                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
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
                          className={`min-w-10 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === currentPage
                              ? "bg-gray-800 text-white shadow-sm"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
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
                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Give Rewards Modal */}
      <GiveRewardsModal
        isOpen={showRewardsModal}
        onClose={() => {
          setShowRewardsModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </>
  );
}

export default ManagerEmployeeList;
