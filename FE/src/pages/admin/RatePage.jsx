import { useEffect, useState } from "react";
import pointApi from "../../api/pointApi";
import pointPolicyApi from "../../api/pointPolicyApi";
import Input from "../../components/common/Input";
import Field from "../../components/common/Field";
import { Pencil, Settings, Info, Percent } from "lucide-react";

import toast from "react-hot-toast";

const initialData = {
  policyID: "",
  exchangeRate: 0,
  minPoint: 0,
  maxPoint: 0,
  expiredTime: 0,
  isActive: true,
  endDate: "",
};

export default function RatePage() {
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [originData, setOriginData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  // Call api
  useEffect(() => {
    async function fetchData() {
      const res = await pointApi.getCurrentPolicy();
      const policy = res.result;
      const mappedData = {
        policyID: policy.pointPolicyId,
        exchangeRate: policy.conversionRate,
        minPoint: policy.minPoints,
        maxPoint: policy.maxPoints,
        expiredTime: policy.expiry,
        isActive: policy.isActive,
        endDate: policy.endDate,
      };

      setFormData(mappedData);
      setOriginData(mappedData);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (formData.exchangeRate <= 0) {
      newErrors.exchangeRate = "Tỉ lệ quy đổi phải > 0";
    }

    if (formData.minPoint <= 0) {
      newErrors.minPoint = "Số điểm tối thiểu phải > 0";
    }

    if (formData.maxPoint <= 0) {
      newErrors.maxPoint = "Số điểm tối đa phải > 0";
    }

    if (Number(formData.minPoint) > Number(formData.maxPoint)) {
      newErrors.maxPoint = "Số điểm tối đa phải ≥ số điểm tối thiểu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    try {
      const dataToUpdate = {
        conversionRate: Number(formData.exchangeRate),
        minPoints: Number(formData.minPoint),
        maxPoints: Number(formData.maxPoint),
        expiry: Number(formData.expiredTime),
        isActive: formData.isActive,
        endDate: formData.endDate,
      };
      await pointPolicyApi.updatePointPolicy(formData.policyID, dataToUpdate);
      setOriginData(formData);

      setIsEdit(false);
      setShowConfirm(false);
      toast.success("Cập nhật chính sách điểm thưởng thành công!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData(originData);
    setErrors({});
    setIsEdit(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Chính sách điểm thưởng
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý tỉ lệ quy đổi và các thông số điểm thưởng
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Tỉ lệ quy đổi điểm thưởng
              </h2>

              {!isEdit ? (
                <button
                  onClick={() => setIsEdit(true)}
                  className="cursor-pointer flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 active:bg-gray-900 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Cập nhật
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="cursor-pointer border-2 border-gray-300 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="cursor-pointer bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 active:bg-gray-900 transition-all"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Exchange rate */}
                <Field
                  label="Tỉ lệ quy đổi (1 điểm = ? VNĐ)"
                  error={errors.exchangeRate}
                >
                  <Input
                    name="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={handleChange}
                    disabled={!isEdit}
                    suffix="VNĐ"
                  />
                </Field>

                {/* Expired */}
                <Field label="Hạn sử dụng">
                  <select
                    name="expiredTime"
                    value={formData.expiredTime}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all font-medium"
                  >
                    <option value="180">6 tháng</option>
                    <option value="365">Một năm</option>
                    <option value="730">Hai năm</option>
                  </select>
                </Field>

                {/* Min */}
                <Field
                  label="Số điểm tối thiểu để quy đổi"
                  note="* Áp dụng cho yêu cầu đổi tiền"
                  error={errors.minPoint}
                >
                  <Input
                    name="minPoint"
                    value={formData.minPoint}
                    onChange={handleChange}
                    disabled={!isEdit}
                    suffix="điểm"
                  />
                </Field>

                {/* Max */}
                <Field
                  label="Số điểm tối đa để quy đổi"
                  note="* Áp dụng cho yêu cầu đổi tiền"
                  error={errors.maxPoint}
                >
                  <Input
                    name="maxPoint"
                    value={formData.maxPoint}
                    onChange={handleChange}
                    disabled={!isEdit}
                    suffix="điểm"
                  />
                </Field>

                {/* End Date */}
                <Field label="Ngày kết thúc chính sách" error={errors.endDate}>
                  <input
                    type="date"
                    name="endDate"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-50 disabled:text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-5">
            <div className="flex gap-4">
              <div className="shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-bold mb-1">
                  Lưu ý quan trọng
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Các thay đổi về chính sách điểm thưởng sẽ ảnh hưởng đến toàn
                  bộ hệ thống. Vui lòng kiểm tra kỹ trước khi lưu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
            <div className="mb-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <Settings className="w-7 h-7 text-black" />
              </div>
              <h3 className="font-bold text-2xl text-center text-gray-900 mb-2">
                Xác nhận cập nhật
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Bạn có chắc chắn muốn cập nhật chính sách điểm thưởng?
              </p>
            </div>

            <div className="space-y-3 mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">
                  Tỉ lệ quy đổi:
                </span>
                <span className="font-bold text-gray-900">
                  {formData.exchangeRate} VNĐ/điểm
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">
                  Điểm tối thiểu:
                </span>
                <span className="font-bold text-gray-900">
                  {formData.minPoint} điểm
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">
                  Điểm tối đa:
                </span>
                <span className="font-bold text-gray-900">
                  {formData.maxPoint} điểm
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ngày kết thúc:</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(formData.endDate)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border-2 border-gray-300 px-4 py-3 rounded-lg text-sm hover:bg-gray-50 active:bg-gray-100 transition-all font-bold text-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={confirmSave}
                className="flex-1 bg-black text-white px-4 py-3 rounded-lg text-sm hover:bg-gray-800 active:bg-gray-900 transition-all font-bold"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
