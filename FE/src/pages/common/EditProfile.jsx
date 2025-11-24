import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Contact, RefreshCcw } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import FormField from "../../components/common/FormField";
import ContactFormField from "../../components/common/ContactFormField";
import GoBackLink from "../../components/common/GoBackLink";

import adminApi from "../../api/adminApi";

// Mock dropdowns
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

function EditProfile() {
  const { role } = useContext(AuthContext);
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  const safeRole = typeof role === "string" ? role.toUpperCase() : "";
  const isAdmin = safeRole === "ADMIN";
  const isManager = safeRole === "MANAGER";

  // Load initial profile
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("profile"));
    console.log(stored);
    if (stored) {
      setFormData({
        ...stored,
        departmentId: stored.department?.departmentId,
        departmentName: stored.department?.departmentName,
        positionId: stored.position?.positionId,
        positionName: stored.position?.positionName,
        bankName: stored.bank?.bankName ?? "",
        bankAccountNumber: stored.bank?.bankAccountNumber ?? "",
      });
    }
  }, []);

  // Back path
  const backPath =
    safeRole === "ADMIN"
      ? `/admin/employee-management/${employeeId}`
      : safeRole === "MANAGER"
      ? "/manager/profile"
      : "/employee/profile";

  // Permission logic
  const adminLocked = [
    "employeeId",
    "employeeCode",
    "startingDate",
    "createAt",
    "updateAt",
    "isActive",
  ];

  const employeeEditable = ["address", "email", "phoneNumber"];

  const canEditField = (field) => {
    if (isAdmin) return !adminLocked.includes(field);
    if (isManager) return ["phoneNumber", "address"].includes(field);
    return employeeEditable.includes(field);
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        employeeName: formData.employeeName ?? "",
        identityCard: formData.identityCard ?? "",
        address: formData.address ?? "",
        dateOfBirth: formData.dateOfBirth ?? "",
        gender: formData.gender,
        email: formData.email ?? "",
        phoneNumber: formData.phoneNumber ?? "",
        taxCode: formData.taxCode ?? "",
        positionId: formData.positionId ?? 0,
        departmentId: formData.departmentId ?? 0,
        bankName: formData.bankName ?? "",
        bankBranch: formData.bankBranch ?? "",
        bankAccountNumber: formData.bankAccountNumber ?? "",
        roles: formData.account?.roles?.map((r) => r.name) ?? ["EMPLOYEE"],
      };

      console.log("Payload gửi:", JSON.stringify(payload, null, 2));

      const res = await adminApi.updateUserById(employeeId, payload);
      console.log("Update response:", res.data);
      alert(`Cập nhật thông tin ${res.data.employeeCode} thành công!`);
      navigate(backPath);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetForm = () => {
    const stored = JSON.parse(sessionStorage.getItem("profile"));
    if (stored) {
      setFormData({
        ...stored,
        departmentId: stored.department?.departmentId,
        departmentName: stored.department?.departmentName,
        positionId: stored.position?.positionId,
        positionName: stored.position?.positionName,
        bankName: stored.bank?.bankName ?? "",
        bankAccountNumber: stored.bank?.bankAccountNumber ?? "",
      });
    }
  };

  const formatDateForInput = (date) => (date ? date.split("T")[0] : "");

  if (!formData) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        <Header title={"Quản lý nhân viên"} icon={Contact} />

        <div className="px-8">
          <GoBackLink destination={backPath} />

          <div className="flex justify-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa hồ sơ
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* BASIC INFO */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Họ và tên"
                    value={formData.employeeName}
                    disabled={!canEditField("employeeName")}
                    onChange={(v) => handleChange("employeeName", v)}
                  />

                  <FormField
                    label="Mã nhân viên"
                    value={formData.employeeCode}
                    disabled={true}
                  />

                  <FormField
                    label="Tên phòng ban"
                    value={formData.departmentName}
                    type="select"
                    options={departments.map((d) => d.name)}
                    disabled={!canEditField("departmentId")}
                    onChange={(v) => {
                      const dept = departments.find((d) => d.name === v);
                      handleChange("departmentName", v);
                      handleChange("departmentId", dept?.id);
                    }}
                  />

                  <FormField
                    label="Vị trí"
                    value={formData.positionName}
                    type="select"
                    options={positions.map((p) => p.name)}
                    disabled={!canEditField("positionId")}
                    onChange={(v) => {
                      const pos = positions.find((p) => p.name === v);
                      handleChange("positionName", v);
                      handleChange("positionId", pos?.id);
                    }}
                  />

                  <FormField
                    label="Số tài khoản"
                    value={formData.bankAccountNumber}
                    disabled={!canEditField("bankAccountNumber")}
                    onChange={(v) => handleChange("bankAccountNumber", v)}
                    onlyNumber={true}
                  />

                  <FormField
                    label="Tên ngân hàng"
                    value={formData.bankName}
                    type="select"
                    options={banks}
                    disabled={!canEditField("bankName")}
                    onChange={(v) => handleChange("bankName", v)}
                  />

                  <FormField
                    label="Ngày vào làm"
                    type="date"
                    value={formatDateForInput(formData.startingDate)}
                    disabled={true}
                  />

                  <FormField
                    label="CCCD"
                    value={formData.identityCard}
                    disabled={!canEditField("identityCard")}
                    onChange={(v) => handleChange("identityCard", v)}
                    onlyNumber={true}
                  />

                  <FormField
                    label="Ngày sinh"
                    type="date"
                    value={formatDateForInput(formData.dateOfBirth)}
                    disabled={!canEditField("dateOfBirth")}
                    onChange={(v) => handleChange("dateOfBirth", v)}
                  />

                  <FormField
                    label="Giới tính"
                    value={formData.gender}
                    type="select"
                    options={["Nam", "Nữ", "Khác"]}
                    disabled={!canEditField("gender")}
                    onChange={(v) => handleChange("gender", v)}
                  />
                </div>
              </div>

              {/* CONTACT INFO */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Thông tin liên hệ
                </h2>

                <div className="space-y-4">
                  <ContactFormField
                    label="Địa chỉ"
                    value={formData.address}
                    disabled={!canEditField("address")}
                    onChange={(v) => handleChange("address", v)}
                  />

                  <ContactFormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    disabled={!canEditField("email")}
                    onChange={(v) => handleChange("email", v)}
                  />

                  <ContactFormField
                    label="Số điện thoại"
                    value={formData.phoneNumber}
                    disabled={!canEditField("phoneNumber")}
                    onChange={(v) => handleChange("phoneNumber", v)}
                    onlyNumber={true}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => handleResetForm()}
                className="rounded-md border  px-6 py-2 text-sm flex gap-2 hover:bg-gray-200 duration-200 cursor-pointer"
              >
                <RefreshCcw size={20} />
                <span>Thiết lập lại</span>
              </button>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(backPath)}
                  className="rounded-md border  px-6 py-2 text-sm hover:bg-gray-200 duration-200 cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-black px-6 py-2 text-sm text-white disabled:opacity-50 hover:bg-black/80 duration-200 cursor-pointer"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
