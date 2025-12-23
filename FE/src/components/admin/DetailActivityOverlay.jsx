import { X, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import runningActivityApi from "../../api/runningActivityApi";
import UpdateActivityOverlay from "./UpdateActivityOverlay";
import ConfirmPopup from "../common/ComfirmPopup";
import toast from "react-hot-toast";
const statusMap = {
  Draft: { label: "Chuẩn bị", color: "text-gray-600" },
  Active: { label: "Đang mở", color: "text-green-600" },
  Completed: { label: "Đã kết thúc", color: "text-blue-600" },
  Cancelled: { label: "Đã hủy", color: "text-red-600" },
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
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-[95%] max-w-3xl rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white shadow px-6 py-4 flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{activity.title}</h2>
              <p className={`font-medium ${status.color}`}>{status.label}</p>
            </div>

            <button
              onClick={onClose}
              className="h-fit w-fit p-2 rounded hover:bg-red-100 cursor-pointer hover:opacity-80"
            >
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-56 object-cover rounded mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <b>Cự ly:</b> {activity.targetDistance} km
              </p>
              <p></p>
              <p>
                <b>Bắt đầu:</b> {activity.startDate}
              </p>
              <p>
                <b>Kết thúc:</b> {activity.endDate}
              </p>
              <p>
                <b>ĐK từ:</b> {activity.registrationStartDate}
              </p>
              <p>
                <b>ĐK đến:</b> {activity.registrationEndDate}
              </p>
              <p>
                <b>Người tham gia:</b> {activity.minParticipant} –{" "}
                {activity.maxParticipant}
              </p>
              <p>
                <b>Thưởng hoàn thành:</b> {activity.completionBonus} điểm
              </p>
              <p>
                <b>Top 1:</b> {activity.top1Bonus} điểm
              </p>
              <p></p>
              <p>
                <b>Top 2:</b> {activity.top2Bonus} điểm
              </p>
              <p></p>
              <p>
                <b>Top 3:</b> {activity.top3Bonus} điểm
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <p className="font-semibold">Mô tả</p>
              <p className="bg-gray-100 p-3 rounded">{activity.description}</p>

              <p className="font-semibold">Luật lệ</p>
              <p className="bg-gray-100 p-3 rounded">
                {activity.rules || "Không có"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              {activity.status != "Cancelled" &&
                activity.status != "Completed" && (
                  <button
                    onClick={() => setOpenEdit(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 cursor-pointer hover:opacity-80"
                  >
                    <Pencil size={16} />
                    Cập nhật
                  </button>
                )}
              {activity.status != "Completed" && (
                <button
                  onClick={() => setOpenConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                  <Trash2 size={16} />
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
