"use client";

import { useState, useEffect } from "react";

import InputField from "./InputField";
import adminApi from "../../api/adminApi";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";

import { getProvinces } from "vn-provinces-wards";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const AddEmployeeCard = ({ onClose, onAddSuccess }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    employeeName: "",
    identityCard: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    taxCode: "",
    positionId: "",
    departmentId: "",
    bankName: "",
    bankBranch: "",
    bankAccountNumber: "",
    roles: [],
  });
  const REQUIRED_FIELDS = [
    "employeeName",
    "identityCard",
    "email",
    "phoneNumber",
    "address",
    "dateOfBirth",
    "gender",
    "departmentId",
    "positionId",
    "taxCode",
    "bankName",
    "bankBranch",
    "bankAccountNumber",
  ];

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const provinces = getProvinces();

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 \
     focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent \
     hover:bg-white transition-all duration-200";

  const btnPrimary =
    "px-6 py-2.5 rounded-xl bg-slate-700 text-white font-medium \
     hover:bg-slate-800 active:scale-[0.97] shadow-md hover:shadow-lg \
     transition-all duration-200";

  const btnOutline =
    "px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium \
     hover:bg-gray-100 hover:border-gray-400 active:scale-[0.97] \
     transition-all duration-200";

  const inputError = "border-red-400 focus:ring-red-300 bg-red-50";

  const banks = [
    "Vietcombank",
    "BIDV",
    "Vietinbank",
    "Agribank",
    "ACB",
    "Techcombank",
    "MBBank",
    "VPBank",
    "TPBank",
    "Sacombank",
    "HDBank",
    "SHB",
    "VIB",
    "Eximbank",
    "MSB",
  ];

  const roleOptions = ["ADMIN", "MANAGER", "EMPLOYEE"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await departmentApi.getAllDepartment();
        setDepartments(res.result);
      } catch (err) {
        console.error("Lỗi khi load danh sách phòng ban");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await positionApi.getAllPosition();
        setPositions(res.result);
      } catch (err) {
        console.error("Lỗi khi load danh sách position");
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "Trường này là bắt buộc";
      }
    });

    if (formData.roles.length === 0) {
      newErrors.roles = "Vui lòng chọn vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles[0] === role ? [] : [role],
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      await adminApi.addUser(formData);
      onClose();
      onAddSuccess();
      toast.success("Tạo nhân viên thành công");
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      toast.error("Tạo nhân viên thất bại");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-gray-200 p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Tạo Hồ Sơ Nhân Viên
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-red-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("personal")}
              className={`relative pb-3 font-medium transition-all duration-300
                ${
                  activeTab === "personal"
                    ? "text-slate-700 after:absolute after:-bottom-px after:left-0 after:w-full after:h-0.5 after:bg-slate-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              Thông tin cá nhân
            </button>

            <button
              onClick={() => setActiveTab("work")}
              className={`relative pb-3 font-medium transition-all duration-300
                ${
                  activeTab === "work"
                    ? "text-slate-700 after:absolute after:-bottom-px after:left-0 after:w-full after:h-0.5 after:bg-slate-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              Công việc & Tài chính
            </button>
          </div>

          {/* PERSONAL */}
          {activeTab === "personal" && (
            <div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                  label="Họ và tên"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className={`${inputClasses} ${
                    errors.employeeName ? inputError : ""
                  }`}
                />

                <InputField
                  type="number"
                  label="CMND/CCCD"
                  name="identityCard"
                  value={formData.identityCard}
                  onChange={handleChange}
                />

                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />

                <InputField
                  type="number"
                  label="Số điện thoại"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Địa chỉ
                  </label>
                  <select
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">-- Chọn tỉnh / thành phố --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={onClose} className={btnOutline}>
                  Hủy
                </button>
                <button
                  onClick={() => setActiveTab("work")}
                  className={btnPrimary}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* WORK */}
          {activeTab === "work" && (
            <div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phòng ban
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">-- Chọn phòng ban --</option>
                    {departments.map((d) => (
                      <option key={d.departmentId} value={d.departmentId}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Chức vụ
                  </label>
                  <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">-- Chọn chức vụ --</option>
                    {positions.map((p) => (
                      <option key={p.positionId} value={p.positionId}>
                        {p.positionName}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Mã số thuế"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleChange}
                  type="number"
                />

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ngân hàng
                  </label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">-- Chọn ngân hàng --</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Chi nhánh ngân hàng"
                  name="bankBranch"
                  value={formData.bankBranch}
                  onChange={handleChange}
                />

                <InputField
                  label="Số tài khoản ngân hàng"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  type="number"
                />

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Vai trò
                  </label>
                  <div className="flex gap-2">
                    {roleOptions
                      .filter((r) => ["MANAGER", "EMPLOYEE"].includes(r))
                      .map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleToggle(role)}
                          className={`px-4 py-2.5 rounded-xl border font-medium transition-all duration-200
                            ${
                              formData.roles[0] === role
                                ? "bg-slate-700 text-white border-slate-700 shadow-md"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                            }`}
                        >
                          {role === "MANAGER" ? "Quản lý" : "Nhân viên"}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {errors.roles && (
                <p className="text-sm text-red-500 mt-1">{errors.roles}</p>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={btnOutline}
                >
                  Quay lại
                </button>
                <button onClick={handleSubmit} className={btnPrimary}>
                  Xác nhận
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddEmployeeCard;
