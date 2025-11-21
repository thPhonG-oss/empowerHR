import { useState } from "react";
import {
  Contact,
  Mail,
  Phone,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Header from "../../components/common/Header";

// Mock data for staff members
const mockStaff = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  name: "Nguyễn Văn Nam",
  position: "Senior Developer",
  department: "Engineering",
  email: "nvnam@gmail.com",
  phone: "024543222",
  avatar: "N",
  status: "Hoạt động",
}));

function StaffManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;
  const totalItems = mockStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStaff = mockStaff.slice(startIndex, startIndex + itemsPerPage);

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
    <main className="p-0">
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
                  <option value="">Phòng Ban</option>
                  <option value="engineering">Engineering</option>
                  <option value="sales">Sales</option>
                  <option value="hr">HR</option>
                  <option value="marketing">Marketing</option>
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
                  <option value="">Chức vụ</option>
                  <option value="senior">Senior Developer</option>
                  <option value="junior">Junior Developer</option>
                  <option value="manager">Manager</option>
                  <option value="lead">Team Lead</option>
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
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Thêm nhân viên
              </button>
            </div>

            {/* Staff Cards */}
            <div className="space-y-4">
              {currentStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Avatar and Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="size-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                        {staff.avatar}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {staff.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {staff.position} - {staff.department}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="size-4" />
                            <span>{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <span>{staff.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {staff.status}
                      </span>
                      <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <Edit2 className="size-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <Trash2 className="size-4 text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreVertical className="size-4 text-gray-600" />
                      </button>
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

export default StaffManagement;
