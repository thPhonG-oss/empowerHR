import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Contact, RefreshCcw } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import FormField from "../../components/common/FormField";
import ContactFormField from "../../components/common/ContactFormField";
import GoBackLink from "../../components/common/GoBackLink";

import adminApi from "../../api/adminApi";
import employeeApi from "../../api/employeeApi";
import departmentApi from "../../api/departmentApi";
import positionApi from "../../api/positionApi";
import { getProvinces } from "vn-provinces-wards";

import toast from "react-hot-toast";

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
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const safeRole = typeof role === "string" ? role.toUpperCase() : "";
  const isAdmin = safeRole === "ADMIN";
  const isManager = safeRole === "MANAGER";

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [deptRes, posRes] = await Promise.all([
          departmentApi.getAllDepartment(),
          positionApi.getAllPosition(),
        ]);
        setDepartments(deptRes.result || []);
        setPositions(posRes.result || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
        toast.error("Không thể tải danh sách phòng ban / chức vụ");
      }
    };

    fetchDropdowns();
  }, []);

  // Load initial profile
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("profile"));
    if (stored) {
      setFormData({
        ...stored,
        departmentId: stored.department?.departmentId,
        departmentName: stored.department?.departmentName,
        positionId: stored.position?.positionId,
        positionName: stored.position?.positionName,
        bankName: stored.bank ?? "",
        bankAccountNumber: stored.bankAccountNumber ?? "",
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

    if (isManager) {
      return ["phoneNumber", "address", "email"].includes(field);
    }

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
      if (safeRole === "ADMIN") {
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

        const res = await adminApi.updateUserById(employeeId, payload);
        toast.success(
          `Cập nhật thông tin ${res.data.employeeCode} thành công!`
        );
      }

      if (safeRole === "EMPLOYEE") {
        const payload = {
          address: formData.address ?? "",
          email: formData.email ?? "",
          phoneNumber: formData.phoneNumber ?? "",
        };
        const res = employeeApi.updateMyProfile(payload);

        toast.success("Cập nhật thông tin liên hệ của bạn thành công");
      }
      navigate(backPath);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Cập nhật thông tin liên hệ không thành công");
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
        bankName: stored.bank ?? "",
        bankAccountNumber: stored.bankAccountNumber ?? "",
      });
    }
  };

  const formatDateForInput = (date) => (date ? date.split("T")[0] : "");

  if (!formData) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        <Header title={"Hồ sơ"} icon={Contact} />

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
                    options={departments.map((d) => d.departmentName)}
                    disabled={!canEditField("departmentId")}
                    onChange={(v) => {
                      const dept = departments.find(
                        (d) => d.departmentName === v
                      );
                      handleChange("departmentName", v);
                      handleChange("departmentId", dept?.departmentId);
                    }}
                  />

                  <FormField
                    label="Vị trí"
                    value={formData.positionName}
                    type="select"
                    options={positions.map((p) => p.positionName)}
                    disabled={!canEditField("positionId")}
                    onChange={(v) => {
                      const pos = positions.find((p) => p.positionName === v);
                      handleChange("positionName", v);
                      handleChange("positionId", pos?.positionId);
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
