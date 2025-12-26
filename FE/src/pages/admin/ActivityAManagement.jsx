import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import runningActivityApi from "../../api/runningActivityApi";
import Header from "../../components/common/Header";
import {
  Activity,
  Search,
  ArrowUpDown,
  PlusCircle,
  Clock,
  GripHorizontal,
} from "lucide-react";
import CreateActivityOverlay from "../../components/admin/CreateActivityOverlay";
import DetailActivityOverlay from "../../components/admin/DetailActivityOverlay";

export default function RunningActivityManagement() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  // 🔥 overlay detail
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Search + sort + status
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🔍 Fuse config (KHÔNG ảnh hưởng logic khác)
  const fuseOptions = {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "description", weight: 0.3 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  };

  const fetchActivities = async (page = 0) => {
    setLoading(true);
    try {
      const res = await runningActivityApi.adminGetAllActivity(page, pageSize);
      const list = res.result?.content || [];
      setActivities(list);
      setFilteredActivities(list);
      setTotalPages(res.result?.totalPages || 1);
      setPageNumber(page);
    } catch (err) {
      console.error("❌ Lỗi tải hoạt động:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(0);
  }, []);

  // 🔍 Search (Fuse) + Filter + Sort
  useEffect(() => {
    let result = [...activities];

    // 👉 FUZZY SEARCH
    if (searchTerm.trim()) {
      const fuse = new Fuse(result, fuseOptions);
      result = fuse.search(searchTerm).map((r) => r.item);
    }

    // 👉 FILTER STATUS
    if (statusFilter !== "ALL") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // 👉 SORT DATE
    result.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredActivities(result);
  }, [searchTerm, sortOrder, statusFilter, activities]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header title="Quản lý hoạt động" icon={Activity} />

      <div className="p-6 space-y-6">
        {/* Bộ lọc */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 bg-gwhite focus-within:ring-2 focus-within:ring-blue-500 transition w-full lg:w-1/2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
              className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm h-9 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ALL">Tất cả</option>
              <option value="Draft">Chuẩn bị</option>
              <option value="Active">Đang mở</option>
              <option value="Completed">Đã kết thúc</option>
              <option value="Cancelled">Đã hủy</option>
            </select>

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="w-32 flex items-center gap-2 px-4 rounded-md bg-black text-sm text-white hover:bg-gray-800 transition h-9 cursor-pointer"
            >
              <ArrowUpDown size={16} />
              {sortOrder === "desc" ? "Gần nhất" : "Xa nhất"}
            </button>

            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 px-4 rounded-md bg-black text-sm text-white hover:bg-gray-800 transition h-9 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Tạo hoạt động</span>
            </button>
          </div>
        </div>

        {/* Nội dung */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : filteredActivities.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            Không có hoạt động nào.
          </p>
        ) : (
          <>
            {/* Danh sách */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => (
                <div
                  key={act.runningActivityId}
                  onClick={() => {
                    setSelectedActivity(act);
                    setOpenDetail(true);
                  }}
                  className="group bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-xl transition overflow-hidden cursor-pointer"
                >
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
                        {act.title}
                      </h2>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                          act.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : act.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : act.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {act.status === "Active"
                          ? "Đang mở"
                          : act.status === "Completed"
                          ? "Đã kết thúc"
                          : act.status === "Cancelled"
                          ? "Đã hủy"
                          : "Chuẩn bị"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {act.description}
                    </p>

                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-300">
                      <p className="flex gap-2">
                        <Clock size={14} /> <strong>Bắt đầu:</strong>{" "}
                        {act.startDate}
                      </p>
                      <p className="flex gap-2">
                        <GripHorizontal size={14} /> <strong>Kết thúc:</strong>{" "}
                        {act.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-600/80 transition cursor-pointer disabled:bg-blue-600/50 disabled:cursor-not-allowed"
                onClick={() => fetchActivities(pageNumber - 1)}
                disabled={pageNumber === 0}
              >
                ← Trước
              </button>

              <span className="text-sm font-medium text-gray-700">
                Trang {pageNumber + 1} / {totalPages}
              </span>

              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-600/80 transition cursor-pointer disabled:bg-blue-600/50 disabled:cursor-not-allowed"
                onClick={() => fetchActivities(pageNumber + 1)}
                disabled={pageNumber + 1 >= totalPages}
              >
                Sau →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Overlay Create */}
      <CreateActivityOverlay
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => fetchActivities(0)}
      />

      {/* Overlay Detail */}
      <DetailActivityOverlay
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        activity={selectedActivity}
        onSuccess={() => fetchActivities(0)}
      />
    </div>
  );
}
