import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, MapPin, PenLine, Phone } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

// Mock data cho dropdowns
const departments = [
  { id: 1, name: "Ban Giám Đốc" },
  { id: 2, name: "Phòng Nhân Sự" },
  { id: 3, name: "Phòng Kỹ Thuật" },
  { id: 4, name: "Phòng Kinh Doanh" },
  { id: 5, name: "Phòng Marketing" },
  { id: 6, name: "Phòng Kế Toán" },
  { id: 7, name: "Phòng Hành Chính" },
];

const positions = [
  { id: 1, name: "CEO" },
  { id: 2, name: "CTO" },
  { id: 3, name: "CFO" },
  { id: 4, name: "HR Manager" },
  { id: 5, name: "Department Manager" },
  { id: 6, name: "Team Leader" },
  { id: 7, name: "Senior Software Engineer" },
  { id: 8, name: "Software Engineer" },
  { id: 9, name: "Junior Software Engineer" },
  { id: 10, name: "Senior Business Analyst" },
  { id: 11, name: "Business Analyst" },
  { id: 12, name: "Junior Business Analyst" },
  { id: 13, name: "Senior QA Engineer" },
  { id: 14, name: "QA Engineer" },
  { id: 15, name: "Junior QA Engineer" },
  { id: 16, name: "Senior Designer" },
  { id: 17, name: "Designer" },
  { id: 18, name: "Junior Designer" },
  { id: 19, name: "DevOps Engineer" },
  { id: 20, name: "Data Analyst" },
  { id: 21, name: "Product Manager" },
  { id: 22, name: "Project Manager" },
  { id: 23, name: "Marketing Manager" },
  { id: 24, name: "Sales Manager" },
  { id: 25, name: "Accountant" },
  { id: 26, name: "HR Specialist" },
  { id: 27, name: "Receptionist" },
  { id: 28, name: "Intern" },
  { id: 29, name: "Nhân viên" },
];

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

// Mock data theo schema Employee
const initialProfile = {
  employee_id: 1,
  employee_code: "22120042",
  employee_name: "Đỗ Ngọc Cường",
  identity_card: "079123456789",
  address: "TP Hồ Chí Minh",
  date_of_birth: "1995-05-15",
  gender: "Nam",
  email: "cuonghandsome@gmail.com",
  phone_number: "0342339167",
  starting_date: "2023-01-01",
  is_active: true,
  tax_code: "1234567890",
  department_id: 2,
  position_id: 29,
  point_balance: 500,
  // Thông tin bổ sung
  department_name: "Phòng Nhân Sự",
  position_name: "Nhân viên",
  bank_account: "1234567890",
  bank_name: "Vietcombank",
};

function EditProfile() {
  const { role } = useContext(AuthContext);
  const { employeeId } = useParams();
  const safeRole = typeof role === "string" ? role.toUpperCase() : "";
  const isAdmin = safeRole === "ADMIN";
  const isManager = safeRole === "MANAGER";
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialProfile);
  const [saving, setSaving] = useState(false);

  // Xác định path quay lại
  const backPath =
    safeRole === "ADMIN"
      ? `/admin/employee-management/${employeeId}`
      : safeRole === "MANAGER"
      ? "/manager/profile"
      : "/employee/profile";

  // Employee và Manager chỉ sửa được: address, email, phone_number
  // Admin sửa được tất cả (trừ employee_id, employee_code, starting_date, is_active, create_at, update_at)
  const canEditField = (field) => {
    if (isAdmin) {
      // Admin không sửa được các field hệ thống
      const systemFields = [
        "employee_id",
        "employee_code",
        "starting_date",
        "is_active",
        "create_at",
        "update_at",
      ];
      return !systemFields.includes(field);
    } else {
      // Employee và Manager chỉ sửa được thông tin liên hệ
      return ["address", "email", "phone_number"].includes(field);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Gọi API để lưu thay đổi
      // await axiosClient.put(`/employees/${employeeId || formData.employee_id}`, formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Payload gửi lên:", formData);
      navigate(backPath);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(backPath);
  };

  // Format date cho input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Thông tin cơ bản */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Thông tin cơ bản
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Họ và tên"
                value={formData.employee_name}
                onChange={(value) => handleChange("employee_name", value)}
                disabled={!canEditField("employee_name")}
              />
              <FormField
                label="Mã nhân viên"
                value={formData.employee_code}
                disabled={true}
              />
              <FormField
                label="Tên phòng ban"
                value={formData.department_name}
                onChange={(value) => {
                  handleChange("department_name", value);
                  // Cập nhật department_id nếu cần
                  const dept = departments.find((d) => d.name === value);
                  if (dept) {
                    handleChange("department_id", dept.id);
                  }
                }}
                disabled={!canEditField("department_name")}
                type="select"
                options={departments.map((d) => d.name)}
              />
              <FormField
                label="Vị trí"
                value={formData.position_name}
                onChange={(value) => {
                  handleChange("position_name", value);
                  // Cập nhật position_id nếu cần
                  const pos = positions.find((p) => p.name === value);
                  if (pos) {
                    handleChange("position_id", pos.id);
                  }
                }}
                disabled={!canEditField("position_name")}
                type="select"
                options={positions.map((p) => p.name)}
              />
              <FormField
                label="Số tài khoản"
                value={formData.bank_account}
                onChange={(value) => handleChange("bank_account", value)}
                disabled={!canEditField("bank_account")}
              />
              <FormField
                label="Tên ngân hàng"
                value={formData.bank_name}
                onChange={(value) => handleChange("bank_name", value)}
                disabled={!canEditField("bank_name")}
                type="select"
                options={banks}
              />
              <FormField
                label="Ngày vào làm"
                type="date"
                value={formatDateForInput(formData.starting_date)}
                disabled={true}
              />
              <FormField
                label="CCCD"
                value={formData.identity_card}
                onChange={(value) => handleChange("identity_card", value)}
                disabled={!canEditField("identity_card")}
              />
              <FormField
                label="Ngày sinh"
                type="date"
                value={formatDateForInput(formData.date_of_birth)}
                onChange={(value) => handleChange("date_of_birth", value)}
                disabled={!canEditField("date_of_birth")}
              />
              <FormField
                label="Giới tính"
                value={formData.gender}
                onChange={(value) => handleChange("gender", value)}
                disabled={!canEditField("gender")}
                type="select"
                options={["Nam", "Nữ", "Khác"]}
              />
            </div>
          </div>

          {/* Card 2: Thông tin liên hệ */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Thông tin liên hệ
                </h2>
               
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <PenLine className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-4">
              <ContactFormField
                icon={MapPin}
                label="Địa chỉ"
                value={formData.address}
                onChange={(value) => handleChange("address", value)}
                disabled={!canEditField("address")}
              />
              <ContactFormField
                icon={Mail}
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
                disabled={!canEditField("email")}
              />
              <ContactFormField
                icon={Phone}
                label="Số điện thoại"
                value={formData.phone_number}
                onChange={(value) => handleChange("phone_number", value)}
                disabled={!canEditField("phone_number")}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  options = [],
}) {
  if (type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      />
    </div>
  );
}

function ContactFormField({
  icon: Icon,
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-2 h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
        />
      </div>
    </div>
  );
}

export default EditProfile;

