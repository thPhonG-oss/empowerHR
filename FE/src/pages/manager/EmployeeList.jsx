import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Contact, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../../components/common/Header";

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

        setEmployeeList(data.employeeResponseDTOS || []);
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

  return (
    <main className="p-0 relative">
      <div className="mx-auto">
        <Header title="Quản lý nhóm" icon={Contact} />

        <div className="p-6 space-y-5">
          {/* Search Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Tìm kiếm nhân viên
              </h2>
              <div className="text-xs text-gray-500">
                Phòng ban:{" "}
                <span className="font-semibold text-gray-900">
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
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Staff List Section */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Danh sách nhân viên ({totalItems})
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Danh sách nhân viên thuộc {myDepartment}
                </p>
              </div>
            </div>

            {/* Staff Cards */}
            <div className="space-y-3">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.employeeId}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition-all duration-200 bg-white cursor-pointer"
                  onClick={() =>
                    navigate(`/manager/team-management/${staff.employeeId}`)
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="size-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-semibold text-gray-700 flex-shrink-0 border border-gray-200">
                        {staff.employeeName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-gray-900">
                          {staff.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {staff.employeeCode} · {staff.gender}
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

                    {/* Status */}
                    <div className="flex-shrink-0">
                      <span
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                          staff.isActive
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-gray-100 text-gray-600 border-gray-300"
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
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="size-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ManagerEmployeeList;
