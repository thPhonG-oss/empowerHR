import { useEffect, useState } from "react";
import pointApi from "../../api/pointApi";
import pointPolicyApi from "../../api/pointPolicyApi";
import Input from "../../components/common/Input";
import Field from "../../components/common/Field";
import { Pencil, Settings } from 'lucide-react';
import toast from "react-hot-toast";

const initialData = {
  policyID: "",
  exchangeRate: 0,
  minPoint: 0,
  maxPoint: 0,
  expiredTime: 0,
  isActive: true,
  endDate:"",
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chính sách điểm thưởng</h1>
                <p className="text-gray-600 text-sm mt-1">Quản lý tỉ lệ quy đổi và các thông số điểm thưởng</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-lg text-gray-900">
                Tỉ lệ quy đổi điểm thưởng
              </h2>

              {!isEdit ? (
                <button
                  onClick={() => setIsEdit(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Cập nhật
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-50 disabled:text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
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
                <Field
                  label="Ngày kết thúc chính sách"
                  error={errors.endDate}
                >
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  i
                </div>
              </div>
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">Lưu ý quan trọng</p>
                <p className="text-sm text-blue-800">
                  Các thay đổi về chính sách điểm thưởng sẽ ảnh hưởng đến toàn bộ hệ thống. 
                  Vui lòng kiểm tra kỹ trước khi lưu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-center text-gray-900 mb-2">
                Xác nhận cập nhật
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Bạn có chắc chắn muốn cập nhật chính sách điểm thưởng?
              </p>
            </div>

            <div className="space-y-3 mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tỉ lệ quy đổi:</span>
                <span className="font-semibold text-gray-900">{formData.exchangeRate} VNĐ/điểm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Điểm tối thiểu:</span>
                <span className="font-semibold text-gray-900">{formData.minPoint} điểm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Điểm tối đa:</span>
                <span className="font-semibold text-gray-900">{formData.maxPoint} điểm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ngày kết thúc:</span>
                <span className="font-semibold text-gray-900">{formatDate(formData.endDate)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={confirmSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
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