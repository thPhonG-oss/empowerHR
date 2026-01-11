import { useEffect, useState } from "react";
import pointApi from "../../api/pointApi";

import Input from "../../components/common/Input";
import Field from "../../components/common/Field";
import{
  PencilIcon,
} from 'lucide-react';  


const initialData = {
  exchangeRate: 0,
  minPoint: 0,
  maxPoint: 0,
  expiredTime: 0,
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
      console.log("policy:", policy);

      const mappedData = {
      exchangeRate: policy.conversionRate,
      minPoint: policy.minPoints,
      maxPoint: policy.maxPoints,
      expiredTime: policy.expiry,
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    try {
      // await axios.put("/api/reward-policy/rate", formData);

      console.log("Saved:", formData);
      setOriginData(formData);
      setIsEdit(false);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData(originData);
    setErrors({});
    setIsEdit(false);
  };


  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold">
            Tỉ lệ quy đổi điểm thưởng
          </h2>

          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              <PencilIcon className="w-4 h-4 mr-1 inline" /> Cập nhật
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
              >
                Hủy
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
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
              className="w-full border border-gray-200 rounded px-3 py-2 disabled:bg-transparent hover:border-gray-400 focus:border-black-500 transition"
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
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h3 className="font-semibold mb-2">
              Xác nhận cập nhật
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn cập nhật chính sách điểm thưởng?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="border px-4 py-2 rounded text-sm"
              >
                Hủy
              </button>
              <button
                onClick={confirmSave}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
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




