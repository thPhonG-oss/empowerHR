import { X, SquareActivity } from "lucide-react";
import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import toast from "react-hot-toast";

const today = new Date().toISOString().split("T")[0];

function CreateActivityOverlay({
  open,
  onClose,
  onSuccess,
  activity,
  mode = "create",
}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const defaultForm = {
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

  const [form, setForm] = useState(defaultForm);

  // Load activity vào form khi edit
  useEffect(() => {
    if (activity && mode === "edit") {
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
    } else if (mode === "create") {
      setForm(defaultForm);
    }
  }, [activity, mode]);
  if (!open) return null;

  const baseInput =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200";

  /* ================= IMAGE UPLOAD ================= */
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
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Upload ảnh thành công 📸");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại ❌");
    } finally {
      setUploading(false);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      minParticipant:
        form.minParticipant === "" ? null : Number(form.minParticipant),
      maxParticipant:
        form.maxParticipant === "" ? null : Number(form.maxParticipant),
      targetDistance:
        form.targetDistance === "" ? null : Number(form.targetDistance),
      completionBonus:
        form.completionBonus === "" ? null : Number(form.completionBonus),
      registrationStartDate: new Date(form.registrationStartDate).toISOString(),
      registrationEndDate: new Date(form.registrationEndDate).toISOString(),
    };

    try {
      if (mode === "edit") {
        await adminApi.updateActivity(activity.runningActivityId, payload);
        toast.success("Cập nhật hoạt động thành công ✨");
      } else {
        await adminApi.createActivity(payload);
        toast.success("Tạo hoạt động thành công 🎉");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        mode === "edit" ? "Cập nhật thất bại ❌" : "Tạo hoạt động thất bại ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-b from-gray-50 to-white">
          <h2 className="inline-flex items-center gap-2.5 text-lg font-semibold text-gray-900">
            <SquareActivity size={22} className="text-gray-700" />{" "}
            {mode === "edit" ? "Cập nhật hoạt động" : "Tạo hoạt động mới"}
          </h2>
          <button
            onClick={() => {
              onClose();
              if (mode === "create") setForm(defaultForm);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tiêu đề hoạt động
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={baseInput}
              required
              placeholder="Nhập tiêu đề hoạt động"
            />
          </div>

          {/* Upload image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh hoạt động
            </label>

            <label
              className={`relative flex items-center justify-center w-full h-52
                rounded-2xl cursor-pointer overflow-hidden transition-all duration-300
                ${
                  uploading
                    ? "border-2 border-dashed border-gray-300 bg-gray-50"
                    : form.image
                    ? "border border-gray-200 shadow-sm"
                    : "border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {!form.image && !uploading && (
                <div className="text-center px-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Click để tải ảnh lên
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    PNG, JPG, JPEG (tối đa 10MB)
                  </p>
                </div>
              )}

              {uploading && (
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-3 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang upload ảnh...
                  </p>
                </div>
              )}

              {form.image && !uploading && (
                <>
                  <img
                    src={form.image}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-5 py-2.5 bg-white/95 backdrop-blur-sm text-sm font-medium text-gray-900 rounded-lg shadow-lg">
                      Đổi ảnh khác
                    </span>
                  </div>
                </>
              )}
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mô tả hoạt động
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${baseInput} h-24 resize-none`}
              placeholder="Mô tả chi tiết cho hoạt động chạy bộ"
            />
          </div>

          {/* Registration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bắt đầu đăng ký
              </label>
              <input
                type="date"
                name="registrationStartDate"
                value={form.registrationStartDate}
                onChange={handleChange}
                min={today}
                max={form.registrationEndDate}
                className={baseInput}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Kết thúc đăng ký
              </label>
              <input
                type="date"
                name="registrationEndDate"
                value={form.registrationEndDate}
                onChange={handleChange}
                min={form.registrationStartDate}
                className={baseInput}
                required
              />
            </div>
          </div>

          {/* Activity time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                min={form.registrationEndDate}
                max={form.endDate}
                className={baseInput}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate}
                className={baseInput}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số người tối thiểu
              </label>
              <input
                type="number"
                name="minParticipant"
                value={form.minParticipant}
                onChange={handleChange}
                className={baseInput}
                placeholder="VD: 10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số người tối đa
              </label>
              <input
                type="number"
                name="maxParticipant"
                value={form.maxParticipant}
                onChange={handleChange}
                className={baseInput}
                placeholder="VD: 100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cự ly mục tiêu (km)
            </label>
            <input
              type="number"
              name="targetDistance"
              value={form.targetDistance}
              onChange={handleChange}
              className={baseInput}
              placeholder="VD: 10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Luật tham gia
            </label>
            <textarea
              name="rules"
              value={form.rules}
              onChange={handleChange}
              className={`${baseInput} h-20 resize-none`}
              placeholder="Nhập các quy tắc tham gia hoạt động"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Thưởng hoàn thành
            </label>
            <input
              type="number"
              name="completionBonus"
              value={form.completionBonus}
              onChange={handleChange}
              className={baseInput}
              placeholder="VD: 200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Thưởng Top 1
              </label>
              <input
                type="number"
                name="top1Bonus"
                value={form.top1Bonus}
                onChange={handleChange}
                className={baseInput}
                placeholder="VD: 150"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Thưởng Top 2
              </label>
              <input
                type="number"
                name="top2Bonus"
                value={form.top2Bonus}
                onChange={handleChange}
                className={baseInput}
                placeholder="VD: 100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Thưởng Top 3
              </label>
              <input
                type="number"
                name="top3Bonus"
                value={form.top3Bonus}
                onChange={handleChange}
                className={baseInput}
                placeholder="VD: 50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 
              hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 shadow-sm cursor-pointer"
            >
              Hủy
            </button>
            <button
              disabled={loading || uploading}
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 hover:-translate-y-0.5 cursor-pointer
              disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-200 active:translate-y-0 shadow-sm"
            >
              {loading
                ? mode === "edit"
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : uploading
                ? "Đang upload ảnh..."
                : mode === "edit"
                ? "Cập nhật hoạt động"
                : "Tạo hoạt động"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateActivityOverlay;
