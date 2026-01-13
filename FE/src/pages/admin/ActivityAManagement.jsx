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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fuseOptions = {
    keys: [
      { name: "title", weight: 0.7 },
      { name: "description", weight: 0.3 },
    ],
    threshold: 0.2,
    ignoreLocation: true,
    minMatchCharLength: 2,
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await runningActivityApi.adminGetAllActivity(0, 9999);
      const list = res.result?.content || [];
      console.log(list);
      setActivities(list);
      setFilteredActivities(list);
    } catch (err) {
      console.error("❌ Lỗi tải hoạt động:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    let result = [...activities];

    if (searchTerm.trim()) {
      const fuse = new Fuse(result, fuseOptions);
      result = fuse.search(searchTerm).map((r) => r.item);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((a) => a.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredActivities(result);
    setCurrentPage(0); // Reset về trang đầu khi filter thay đổi
  }, [searchTerm, sortOrder, statusFilter, activities]);

  // Tính toán phân trang ở frontend
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredActivities.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <Header title="Quản lý hoạt động" icon={Activity} />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* FILTER */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề hoặc mô tả..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm transition-all focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Draft">Chuẩn bị</option>
                <option value="Open">Đang mở</option>
                <option value="Active">Đang diễn ra</option>
                <option value="Completed">Đã kết thúc</option>
                <option value="Cancelled">Đã hủy</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-br from-gray-800 to-gray-900 text-sm font-medium text-white shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowUpDown size={16} />
                {sortOrder === "desc" ? "Gần nhất" : "Xa nhất"}
              </button>

              <button
                onClick={() => setOpenCreate(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-br from-black to-gray-900 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle size={16} />
                Tạo hoạt động
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
              <span className="text-gray-600 font-medium">
                Đang tải dữ liệu...
              </span>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex flex-col items-center gap-4 px-8 py-10 bg-white rounded-2xl shadow-lg">
              <Activity size={48} className="text-gray-300" />
              <p className="text-gray-500 font-medium">
                Không có hoạt động nào
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((act) => (
                <div
                  key={act.runningActivityId}
                  onClick={() => {
                    setSelectedActivity(act);
                    setOpenDetail(true);
                  }}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md shadow-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        act.image ||
                        "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                      }
                      alt={act.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug flex-1">
                        {act.title}
                      </h3>

                      <span
                        className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide ${
                          act.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : act.status === "Open"
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            : act.status === "Completed"
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                            : act.status === "Cancelled"
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : act.status === "Draft"
                            ? "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                            : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                        }`}
                      >
                        {act.status === "Draft"
                          ? "Chuẩn bị"
                          : act.status === "Open"
                          ? "Đang mở"
                          : act.status === "Active"
                          ? "Đang diễn ra"
                          : act.status === "Completed"
                          ? "Đã kết thúc"
                          : act.status === "Cancelled"
                          ? "Đã hủy"
                          : "Không xác định"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="text-xs text-gray-500 space-y-2 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium">Bắt đầu:</span>
                        <span>{act.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GripHorizontal size={14} className="text-gray-400" />
                        <span className="font-medium">Kết thúc:</span>
                        <span>{act.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-4">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-6 py-3 rounded-xl bg-linear-to-br from-gray-800 to-gray-900 text-white text-sm font-medium shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  ← Trước
                </button>

                <div className="px-6 py-3 bg-white rounded-xl shadow-md border border-gray-100">
                  <span className="text-sm text-gray-700 font-semibold">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({filteredActivities.length} kết quả)
                  </span>
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage + 1 >= totalPages}
                  className="px-6 py-3 rounded-xl bg-linear-to-br from-gray-800 to-gray-900 text-white text-sm font-medium shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateActivityOverlay
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => fetchActivities()}
      />

      <DetailActivityOverlay
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        activity={selectedActivity}
        onSuccess={() => fetchActivities()}
      />
    </main>
  );
}
