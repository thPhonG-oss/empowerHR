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
        // 1️⃣ Lấy profile (để biết phòng ban của mình)
        const profileRes = await employeeApi.getMyProfile();
        const myDeptName = profileRes.result.department;
        setMyDepartment(myDeptName);

        // 2️⃣ Lấy danh sách phòng ban
        const depRes = await departmentApi.getAllDepartment();
        const deps = depRes.result || [];

        // Tìm departmentId tương ứng
        const dept = deps.find((d) => d.departmentName === myDeptName);
        if (!dept) return;

        setDepartmentId(dept.departmentId);

        // 3️⃣ Lấy danh sách employee trong department
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
  }, [currentPage]); // chỉ load lại khi đổi trang

  // =======================================
  // 3️⃣ CLIENT-SIDE SEARCH
  // =======================================
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
      <div className=" mx-auto">
        {/* Header */}
        <Header title="Quản lý nhóm" icon={Contact} />

        {/* Content */}
        <div className="p-6 space-y-6 ">
          {/* Search Section */}
          <div className="bg-[#F2F2F2] border border-gray-300 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Tìm kiếm nhân viên
              </h2>
              <div className="text-sm text-gray-600">
                Phòng ban: <span className="font-semibold">{myDepartment}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 z-10">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên, ID hoặc email.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
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
                  Danh sách nhân viên thuộc {myDepartment}
                </p>
              </div>
            </div>

            {/* Staff Cards */}
            <div className="space-y-4">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.employeeId}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white cursor-pointer"
                  onClick={() =>
                    navigate(`/manager/team-management/${staff.employeeId}`)
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="size-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                        {staff.employeeName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {staff.employeeName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {staff.employeeCode} - {staff.gender}
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

                    {/* Status */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          staff.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {generatePaginationPages().map((page, idx) => (
                  <div key={idx}>
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
    </main>
  );
}

export default ManagerEmployeeList;
