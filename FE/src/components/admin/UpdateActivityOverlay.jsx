// UpdateActivityOverlay.jsx
import { X, SquareActivity, Upload, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import runningActivityApi from "../../api/runningActivityApi";
import toast from "react-hot-toast";

const today = new Date().toISOString().split("T")[0];

export default function UpdateActivityOverlay({
  open,
  onClose,
  activity,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    title: "",
    image: "",
    description: "",
    registrationStartDate: "",
    registrationEndDate: "",
    startDate: "",
    endDate: "",
    minParticipant: "",
    maxParticipant: "",
    targetDistance: "",
    rules: "",
    completionBonus: "",
    top1Bonus: "",
    top2Bonus: "",
    top3Bonus: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (open && activity) {
      setForm({
        title: activity.title || "",
        image: activity.image || "",
        description: activity.description || "",
        registrationStartDate:
          activity.registrationStartDate?.split("T")[0] || "",
        registrationEndDate: activity.registrationEndDate?.split("T")[0] || "",
        startDate: activity.startDate?.split("T")[0] || "",
        endDate: activity.endDate?.split("T")[0] || "",
        minParticipant: activity.minParticipant ?? "",
        maxParticipant: activity.maxParticipant ?? "",
        targetDistance: activity.targetDistance ?? "",
        rules: activity.rules || "",
        completionBonus: activity.completionBonus ?? "",
        top1Bonus: activity.top1Bonus ?? "",
        top2Bonus: activity.top2Bonus ?? "",
        top3Bonus: activity.top3Bonus ?? "",
      });
    }
  }, [open, activity]);

  if (!open || !activity) return null;

  const baseInput =
    "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all hover:border-gray-300";

  const baseLabel = "block text-sm font-semibold text-gray-700 mb-2";

  /* ================= UPLOAD IMAGE ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("folder", import.meta.env.VITE_CLOUD_FOLDER);

    try {
      setUploading(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.secure_url }));

      toast.success("Upload ảnh thành công 📸");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại ❌");
    } finally {
      setUploading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      image: form.image,
      description: form.description,
      rules: form.rules,

      registrationStartDate: new Date(form.registrationStartDate).toISOString(),
      registrationEndDate: new Date(form.registrationEndDate).toISOString(),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),

      minParticipant:
        form.minParticipant === "" ? null : Number(form.minParticipant),
      maxParticipant:
        form.maxParticipant === "" ? null : Number(form.maxParticipant),
      targetDistance:
        form.targetDistance === "" ? null : Number(form.targetDistance),

      completionBonus:
        form.completionBonus === "" ? 0 : Number(form.completionBonus),
      top1Bonus: form.top1Bonus === "" ? 0 : Number(form.top1Bonus),
      top2Bonus: form.top2Bonus === "" ? 0 : Number(form.top2Bonus),
      top3Bonus: form.top3Bonus === "" ? 0 : Number(form.top3Bonus),
    };

    try {
      await runningActivityApi.updateActivity(
        activity.runningActivityId,
        payload
      );

      toast.success("Cập nhật hoạt động thành công ✨");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shadow-md">
          <h2 className="inline-flex items-center gap-2.5 text-xl font-bold ">
            <SquareActivity size={24} /> Cập nhật hoạt động
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg  hover:bg-red-100 "
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto bg-linear-to-br from-gray-50 to-white">
          {/* Title */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <label className={baseLabel}>Tiêu đề hoạt động</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={baseInput}
              placeholder="Nhập tiêu đề hoạt động..."
              required
            />
          </div>

          {/* Upload Image */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <label className={baseLabel}>Hình ảnh hoạt động</label>

            <label className="relative group flex items-center justify-center w-full h-52 rounded-xl cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-900 transition-all bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    Đang tải lên...
                  </span>
                </div>
              ) : form.image ? (
                <>
                  <img
                    src={form.image}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Upload size={32} />
                      <span className="text-sm font-medium">Thay đổi ảnh</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <ImageIcon size={40} strokeWidth={1.5} />
                  <span className="text-sm font-medium">
                    Click để tải ảnh lên
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <label className={baseLabel}>Mô tả hoạt động</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${baseInput} h-28 resize-none`}
              placeholder="Nhập mô tả chi tiết về hoạt động..."
            />
          </div>

          {/* Registration & Activity Dates */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-5">
            <h3 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-200">
              Thời gian
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={baseLabel}>Bắt đầu đăng ký</label>
                <input
                  type="date"
                  name="registrationStartDate"
                  value={form.registrationStartDate}
                  onChange={handleChange}
                  min={today}
                  className={baseInput}
                  required
                />
              </div>
              <div>
                <label className={baseLabel}>Kết thúc đăng ký</label>
                <input
                  type="date"
                  name="registrationEndDate"
                  value={form.registrationEndDate}
                  onChange={handleChange}
                  min={form.registrationStartDate || today}
                  className={baseInput}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={baseLabel}>Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={baseInput}
                  required
                />
              </div>
              <div>
                <label className={baseLabel}>Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={baseInput}
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants & Distance */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-5">
            <h3 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-200">
              Thông tin tham gia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={baseLabel}>Số người tối thiểu</label>
                <input
                  type="number"
                  name="minParticipant"
                  value={form.minParticipant}
                  onChange={handleChange}
                  className={baseInput}
                  placeholder="Ví dụ: 10"
                />
              </div>
              <div>
                <label className={baseLabel}>Số người tối đa</label>
                <input
                  type="number"
                  name="maxParticipant"
                  value={form.maxParticipant}
                  onChange={handleChange}
                  className={baseInput}
                  placeholder="Ví dụ: 100"
                />
              </div>
            </div>

            <div>
              <label className={baseLabel}>Cự ly mục tiêu (km)</label>
              <input
                type="number"
                name="targetDistance"
                value={form.targetDistance}
                onChange={handleChange}
                className={baseInput}
                placeholder="Ví dụ: 42"
              />
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <label className={baseLabel}>Luật tham gia</label>
            <textarea
              name="rules"
              value={form.rules}
              onChange={handleChange}
              className={`${baseInput} h-24 resize-none`}
              placeholder="Nhập các quy định và luật lệ..."
            />
          </div>

          {/* Bonuses */}
          <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl p-5 shadow-sm border border-amber-100 space-y-5">
            <h3 className="text-base font-semibold text-gray-900 pb-3 border-b border-amber-200">
              Phần thưởng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={baseLabel}>🥇 Top 1</label>
                <input
                  type="number"
                  name="top1Bonus"
                  value={form.top1Bonus}
                  onChange={handleChange}
                  className={baseInput}
                  placeholder="Điểm"
                />
              </div>
              <div>
                <label className={baseLabel}>🥈 Top 2</label>
                <input
                  type="number"
                  name="top2Bonus"
                  value={form.top2Bonus}
                  onChange={handleChange}
                  className={baseInput}
                  placeholder="Điểm"
                />
              </div>
              <div>
                <label className={baseLabel}>🥉 Top 3</label>
                <input
                  type="number"
                  name="top3Bonus"
                  value={form.top3Bonus}
                  onChange={handleChange}
                  className={baseInput}
                  placeholder="Điểm"
                />
              </div>
            </div>

            <div>
              <label className={baseLabel}>✨ Thưởng hoàn thành</label>
              <input
                type="number"
                name="completionBonus"
                value={form.completionBonus}
                onChange={handleChange}
                className={baseInput}
                placeholder="Điểm thưởng cho người hoàn thành"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="px-6 py-3 rounded-xl bg-linear-to-br from-gray-800 to-gray-900 text-white font-medium shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật hoạt động"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
