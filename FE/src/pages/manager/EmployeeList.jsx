import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Contact,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Header from "../../components/common/Header";

// =============== Mock dữ liệu ================
// Phòng ban cố định của manager (mock: Phòng Nhân Sự)
const MANAGER_DEPARTMENT = "Phòng Nhân Sự";

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

const mockStaff = Array.from({ length: 300 }, (_, i) => {
  const gender = i % 2 === 0 ? "Male" : "Female";
  const isActive = i % 3 !== 0; // 2/3 active
  // Gán phòng ban ngẫu nhiên, nhưng sẽ filter theo MANAGER_DEPARTMENT
  const departmentNames = [
    "Ban Giám Đốc",
    "Phòng Nhân Sự",
    "Phòng Kỹ Thuật",
    "Phòng Kinh Doanh",
    "Phòng Marketing",
    "Phòng Kế Toán",
    "Phòng Hành Chính",
  ];
  return {
    employeeId: i + 1,
    employeeCode: `EMP${String(i + 1).padStart(3, "0")}`,
    employeeName: `Nguyễn Văn ${
      ["An", "Bình", "Cường", "Dũng", "Hùng"][i % 5]
    }`,
    identityCard: `00${Math.floor(100000000 + Math.random() * 900000000)}`,
    address: `${100 + i} Nguyễn Huệ, Q1, TP.HCM`,
    dateOfBirth: `198${i % 10}-0${(i % 9) + 1}-15`,
    gender,
    email: `nv${i + 1}@company.com`,
    phoneNumber: `0901234${String(100 + i).slice(-3)}`,
    startingDate: `2020-0${(i % 9) + 1}-15`,
    isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    taxCode: `TAX${String(i + 1).padStart(3, "0")}`,
    pointBalance: Math.floor(Math.random() * 10000),
    departmentName: departmentNames[i % departmentNames.length],
    positionName: positions[i % positions.length].name,
  };
});

// ==========================================

function ManagerEmployeeList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [position, setPosition] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc nhân viên theo phòng ban cố định của manager
  const filteredStaff = mockStaff.filter(
    (staff) => staff.departmentName === MANAGER_DEPARTMENT
  );

  // Áp dụng filter theo position và search term
  let displayStaff = filteredStaff;
  if (position) {
    displayStaff = displayStaff.filter((staff) =>
      staff.positionName?.includes(position)
    );
  }
  if (searchTerm) {
    displayStaff = displayStaff.filter(
      (staff) =>
        staff.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const itemsPerPage = 10;
  const totalItems = displayStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStaff = displayStaff.slice(startIndex, startIndex + itemsPerPage);

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
                Phòng ban: <span className="font-semibold">{MANAGER_DEPARTMENT}</span>
              </div>
            </div>

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

              {/* Position Dropdown */}
              <div className="relative w-full md:w-48">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">Chọn chức vụ</option>

                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.name}>
                      {pos.name}
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
                  Danh sách nhân viên thuộc {MANAGER_DEPARTMENT}
                </p>
              </div>
            </div>

            {/* Staff Cards */}
            <div className="space-y-4">
              {currentStaff.map((staff) => (
                <div
                  key={staff.employeeId}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white cursor-pointer"
                  onClick={() => {
                    // Manager có thể xem chi tiết nhưng không chỉnh sửa
                    navigate(`/manager/team-management/${staff.employeeId}`);
                  }}
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
    </main>
  );
}

export default ManagerEmployeeList;

