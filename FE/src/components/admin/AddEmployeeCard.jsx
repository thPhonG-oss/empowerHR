import { useState } from "react";

function AddEmployeeCard({ isOpen, onClose, positions, departments }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    idCard: "",
    email: "",
    address: "",
    position: "",
    department: "",
    bank: "",
    accountNumber: "",
    taxId: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePersonalTab = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc";
    if (!formData.dateOfBirth.trim())
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    if (!formData.idCard.trim()) newErrors.idCard = "CCCD là bắt buộc";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
    if (!formData.taxId.trim()) newErrors.taxId = "Mã số thuế là bắt buộc";
    if (!formData.phone.trim()) newErrors.phone = "SDT là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateWorkTab = () => {
    const newErrors = {};
    if (!formData.bank.trim()) newErrors.bank = "Ngân hàng là bắt buộc";
    if (!formData.accountNumber.trim())
      newErrors.accountNumber = "Số tài khoản là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePersonalTab()) {
      setActiveTab("work");
    }
  };

  const handleConfirm = () => {
    console.log(1);
    if (validateWorkTab()) {
      console.log(2);
      console.log("Form submitted:", formData);
      onClose();
      handleCancel();
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      idCard: "",
      email: "",
      address: "",
      position: "",
      department: "",
      bank: "",
      accountNumber: "",
      taxId: "",
      phone: "",
    });
    setErrors({});
    setActiveTab("personal");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 bg-opacity-20 backdrop-blur-[1px] z-50"
        onClick={() => onClose()}
      />

      <div className="fixed inset-0 flex items-start justify-center p-4 z-60">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-lg mt-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tạo hộ số nhân viên
            </h1>
            <p className="text-gray-600 text-sm">
              Điền đầy đủ thông tin nhân viên
            </p>
          </div>

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 rounded border font-medium transition-colors ${
                activeTab === "personal"
                  ? "bg-gray-200 text-gray-900 border-gray-300 hover:cursor-not-allowed"
                  : "bg-white text-gray-900 border-gray-300 hover:cursor-pointer hover:bg-gray-100"
              }`}
            >
              Cá nhân
            </button>
            <button
              onClick={() => setActiveTab("work")}
              className={`px-4 py-2 rounded border font-medium transition-colors ${
                activeTab === "work"
                  ? "bg-gray-200 text-gray-900 border-gray-300 hover:cursor-not-allowed"
                  : "bg-white text-gray-900 border-gray-300 hover:cursor-pointer hover:bg-gray-100"
              }`}
            >
              Công việc, tài chính
            </button>
          </div>

          {activeTab === "personal" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    CCCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.idCard ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.idCard && (
                    <p className="text-red-500 text-xs mt-1">{errors.idCard}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Mã số thuế <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.taxId ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.taxId && (
                    <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    SDT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-900 font-medium hover:cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:cursor-pointer hover:bg-green-700 transition-colors"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {activeTab === "work" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Chức vụ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 "
                  >
                    <option value="" disabled>
                      Chọn chức vụ
                    </option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Ngân hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bank"
                    value={formData.bank}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.bank ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.bank && (
                    <p className="text-red-500 text-xs mt-1">{errors.bank}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 "
                  >
                    <option value="" disabled>
                      Chọn phòng ban
                    </option>
                    {departments.map((dert) => (
                      <option key={dert.id} value={dert.id}>
                        {dert.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.accountNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setActiveTab("personal")}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-900 font-medium hover:cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:cursor-pointer hover:bg-green-700 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddEmployeeCard;
