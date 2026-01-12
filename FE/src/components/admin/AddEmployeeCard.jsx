import { useState, useEffect } from "react";

import InputField from "./InputField";
import adminApi from "../../api/adminApi";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";

import { getProvinces } from "vn-provinces-wards";

const AddEmployeeCard = ({ onClose }) => {
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

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  const provinces = getProvinces();

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  const btnPrimary =
    "px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer";

  const btnOutline =
    "px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer";

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

  // const handleDeleteEmployee = () => {
  //   // Xóa giả
  //   setEmployeeList((prev) =>
  //     prev.filter((emp) => emp.employeeId !== employeeToDelete)
  //   );
  //   // Gọi API xóa ở đây
  //   setIsConfirmPopupOpen(false);
  // };

  // Load danh sách departments
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

  // Load danh sách position
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await adminApi.addUser(formData);

      alert("Tạo nhân viên thành công!");
      onClose(); // Đóng modal sau khi submit thành công
      // reload
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      alert("Tạo nhân viên thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Tạo Hồ Sơ Nhân Viên
          </h2>

          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 font-medium border-b-2 transition cursor-pointer ${
                activeTab === "personal"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("work")}
              className={`px-4 py-2 font-medium border-b-2 transition cursor-pointer ${
                activeTab === "work"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Công việc & Tài chính
            </button>
          </div>

          {activeTab === "personal" && (
            <div>
              <div className="space-y-4 grid grid-cols-2 gap-4">
                <InputField
                  label="Họ và tên"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                />

                <InputField
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
                  label="Số điện thoại"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <div className="flex flex-col">
                  <label htmlFor="" className="block text-gray-700 mb-1">
                    Địa Chỉ
                  </label>
                  <select
                    // value={value}
                    // onChange={(e) => onChange(e.target.value)}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <label className="block text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onClose}
                  className={btnOutline + "cursor-pointer"}
                >
                  Hủy
                </button>
                <button
                  onClick={() => setActiveTab("work")}
                  className={btnPrimary + "cursor-pointer"}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {activeTab === "work" && (
            <div>
              <div className="space-y-4  grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Phòng ban</label>
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
                  <label className="block text-gray-700 mb-1">Chức vụ</label>
                  <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      -- Chọn chức vụ --
                    </option>
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
                />

                <div>
                  <label className="block text-gray-700 mb-1">Ngân hàng</label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      -- Chọn ngân hàng --
                    </option>
                    {banks.map((bank) => (
                      <option value={bank} key={bank}>
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
                />

                <div>
                  <label className="block text-gray-700 mb-2">
                    Roles (vai trò)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`px-4 py-2 border rounded-lg cursor-pointer font-medium transition cursor-pointer ${
                          formData.roles.includes(role)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={btnOutline + "cursor-pointer"}
                >
                  Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  className={btnPrimary + "cursor-pointer"}
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
};

export default AddEmployeeCard;
