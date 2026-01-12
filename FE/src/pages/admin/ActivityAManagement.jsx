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
  }, [searchTerm, sortOrder, statusFilter, activities]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header title="Quản lý hoạt động" icon={Activity} />

      <div className="p-6 space-y-6">
        {/* FILTER */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-full lg:w-1/2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề hoặc mô tả..."
              className="w-full bg-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
              className="flex items-center gap-2 px-4 rounded-lg bg-gray-900 text-sm text-white h-10"
            >
              <ArrowUpDown size={16} />
              {sortOrder === "desc" ? "Gần nhất" : "Xa nhất"}
            </button>

            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 px-4 rounded-lg bg-gray-900 text-sm text-white h-10"
            >
              <PlusCircle size={16} />
              Tạo hoạt động
            </button>
          </div>
        </div>

        {/* CONTENT */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => (
                <div
                  key={act.runningActivityId}
                  onClick={() => {
                    setSelectedActivity(act);
                    setOpenDetail(true);
                  }}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={
                      act.image ||
                      "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                    }
                    alt={act.title}
                    className="w-full h-44 object-cover rounded-t-lg"
                  />

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {act.title}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
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

                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                      <p className="flex gap-2">
                        <Clock size={14} /> Bắt đầu: {act.startDate}
                      </p>
                      <p className="flex gap-2">
                        <GripHorizontal size={14} /> Kết thúc: {act.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => fetchActivities(pageNumber - 1)}
                disabled={pageNumber === 0}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-40"
              >
                ← Trước
              </button>

              <span className="text-sm text-gray-700 font-medium">
                Trang {pageNumber + 1} / {totalPages}
              </span>

              <button
                onClick={() => fetchActivities(pageNumber + 1)}
                disabled={pageNumber + 1 >= totalPages}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </>
        )}
      </div>

      <CreateActivityOverlay
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => fetchActivities(0)}
      />

      <DetailActivityOverlay
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        activity={selectedActivity}
        onSuccess={() => fetchActivities(0)}
      />
    </main>
  );
}
