import { X, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import runningActivityApi from "../../api/runningActivityApi";
import UpdateActivityOverlay from "./UpdateActivityOverlay";
import ConfirmPopup from "../common/ComfirmPopup";
import toast from "react-hot-toast";

const statusMap = {
  Draft: {
    label: "Chuẩn bị",
    color: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  },
  Active: {
    label: "Đang mở",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  Completed: {
    label: "Đã kết thúc",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  Cancelled: {
    label: "Đã hủy",
    color: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

export default function DetailActivityOverlay({
  open,
  onClose,
  activity,
  onSuccess,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  if (!open || !activity) return null;

  const status = statusMap[activity.status] || statusMap.Draft;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await runningActivityApi.deleteActivity(activity.runningActivityId);

      setOpenConfirm(false);
      onClose();
      onSuccess?.();
      toast.success("Xóa hoạt động thành công");
    } catch (err) {
      console.error("Lỗi xóa hoạt động:", err);
      toast.error("Xóa hoạt động không thành công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="sticky top-0  px-6 py-5 flex justify-between items-start gap-4 shadow-sm">
            <div className="flex-1">
              <h2 className="text-2xl font-bold  mb-2 leading-tight">
                {activity.title}
              </h2>
              <span
                className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}
              >
                {status.label}
              </span>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg  hover:bg-red-100 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] bg-linear-to-br from-gray-50 to-white">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg group">
              <img
                src={
                  activity.image ||
                  "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                }
                alt={activity.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Info Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Thông tin chi tiết
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-24">
                    Cự ly:
                  </span>
                  <span className="text-gray-600">
                    {activity.targetDistance} km
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-24">
                    Người tham gia:
                  </span>
                  <span className="text-gray-600">
                    {activity.minParticipant} – {activity.maxParticipant}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-24">
                    Diễn ra từ:
                  </span>
                  <span className="text-gray-600">{activity.startDate}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-24">
                    Diễn ra đến:
                  </span>
                  <span className="text-gray-600">{activity.endDate}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-24">
                    Đăng ký từ:
                  </span>
                  <span className="text-gray-600">
                    {activity.registrationStartDate}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-24">
                    Đăng ký đến:
                  </span>
                  <span className="text-gray-600">
                    {activity.registrationEndDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-md border border-amber-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-amber-200">
                Phần thưởng
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Hoàn thành</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {activity.completionBonus}
                  </p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Top 1</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {activity.top1Bonus}
                  </p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Top 2</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {activity.top2Bonus}
                  </p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Top 3</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {activity.top3Bonus}
                  </p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {activity.description}
              </p>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Luật lệ
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {activity.rules || "Không có"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              {activity.status !== "Cancelled" &&
                activity.status !== "Completed" && (
                  <button
                    onClick={() => setOpenEdit(true)}
                    className="cursor-pointer px-6 py-3 bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-600/30 transition-all hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Pencil size={18} />
                    Cập nhật
                  </button>
                )}
              {activity.status !== "Completed" && (
                <button
                  onClick={() => setOpenConfirm(true)}
                  className="cursor-pointer px-6 py-3 bg-linear-to-br from-red-600 to-red-700 text-white rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-red-600/30 transition-all hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Trash2 size={18} />
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete */}
      <ConfirmPopup
        isOpen={openConfirm}
        onClose={() => !loading && setOpenConfirm(false)}
        message="Bạn có chắc chắn muốn xóa hoạt động này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
      />

      {/* Update overlay */}
      <UpdateActivityOverlay
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => {
          setOpenEdit(false);
          onSuccess?.();
        }}
        activity={activity}
      />
    </>
  );
}
