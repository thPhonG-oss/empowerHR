import { X, SquareActivity } from "lucide-react";
import { useState } from "react";
import adminApi from "../../api/adminApi";
import toast from "react-hot-toast";

const today = new Date().toISOString().split("T")[0];

function CreateActivityOverlay({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
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
  });

  if (!open) return null;

  const baseInput =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition";

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
      [name]: value, // ✅ KHÔNG ép Number ở đây
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApi.createActivity({
        ...form,
        minParticipant:
          form.minParticipant === "" ? null : Number(form.minParticipant),
        maxParticipant:
          form.maxParticipant === "" ? null : Number(form.maxParticipant),
        targetDistance:
          form.targetDistance === "" ? null : Number(form.targetDistance),
        completionBonus:
          form.completionBonus === "" ? null : Number(form.completionBonus),
        registrationStartDate: new Date(
          form.registrationStartDate
        ).toISOString(),
        registrationEndDate: new Date(form.registrationEndDate).toISOString(),
      });

      setForm({
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
      });

      toast.success("Tạo hoạt động thành công 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Tạo hoạt động thất bại ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
            <SquareActivity size={22} /> Tạo hoạt động mới
          </h2>
          <button
            onClick={() => {
              onClose();
              setForm({
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
              });
            }}
            className="p-2 rounded-md hover:bg-red-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Tiêu đề hoạt động
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={baseInput}
              required
            />
          </div>

          {/* Upload image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh hoạt động
            </label>

            <label
              className={`relative flex items-center justify-center w-full h-48
                rounded-xl cursor-pointer overflow-hidden transition
                ${
                  uploading
                    ? "border-2 border-dashed border-gray-300 bg-gray-50"
                    : form.image
                    ? "border border-gray-300"
                    : "border-2 border-dashed border-gray-300 hover:border-black"
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {!form.image && !uploading && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Click để tải ảnh lên</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                </div>
              )}

              {uploading && (
                <p className="text-sm text-gray-500">Đang upload ảnh...</p>
              )}

              {form.image && !uploading && (
                <>
                  <img
                    src={form.image}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <span className="px-4 py-2 bg-white text-sm rounded-md">
                      Đổi ảnh khác
                    </span>
                  </div>
                </>
              )}
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Mô tả hoạt động
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${baseInput} h-24 resize-none`}
            />
          </div>

          {/* Registration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Bắt đầu đăng ký</label>
              <input
                type="date"
                name="registrationStartDate"
                value={form.registrationStartDate}
                onChange={handleChange}
                min={today}
                max={form.registrationEndDate}
                className={`${baseInput} mt-1`}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Kết thúc đăng ký</label>
              <input
                type="date"
                name="registrationEndDate"
                value={form.registrationEndDate}
                onChange={handleChange}
                min={form.registrationStartDate || today}
                className={`${baseInput} mt-1`}
                required
              />
            </div>
          </div>

          {/* Activity time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                min={today}
                max={form.endDate}
                className={`${baseInput} mt-1`}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || today}
                className={`${baseInput} mt-1`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Số người tối thiểu
              </label>
              <input
                type="number"
                name="minParticipant"
                value={form.minParticipant}
                onChange={handleChange}
                className={baseInput}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Số người tối đa
              </label>
              <input
                type="number"
                name="maxParticipant"
                value={form.maxParticipant}
                onChange={handleChange}
                className={baseInput}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Cự ly mục tiêu (km)
            </label>
            <input
              type="number"
              name="targetDistance"
              value={form.targetDistance}
              onChange={handleChange}
              className={baseInput}
              placeholder="10"
            />
          </div>

          <textarea
            name="rules"
            placeholder="Luật tham gia"
            value={form.rules}
            onChange={handleChange}
            className={`${baseInput} h-20 resize-none`}
          />

          <div>
            <label className="text-sm font-medium text-gray-700">
              Thưởng hoàn thành
            </label>
            <input
              type="number"
              name="completionBonus"
              value={form.completionBonus}
              onChange={handleChange}
              className={baseInput}
              placeholder="200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              disabled={loading || uploading}
              type="submit"
              className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading
                ? "Đang tạo..."
                : uploading
                ? "Đang upload ảnh..."
                : "Tạo hoạt động"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateActivityOverlay;
