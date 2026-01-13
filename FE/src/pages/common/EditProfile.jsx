import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Contact, RefreshCcw, Save, X } from "lucide-react";
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
        bankName: stored.bank.bankName ?? "",
        bankAccountNumber: stored.bank.bankAccountNumber ?? "",
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

  if (!formData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="mx-auto space-y-8">
        <Header title={"Hồ sơ"} icon={Contact} />

        <div className="px-8 pb-8">
          <GoBackLink destination={backPath} />

          {/* Header Section */}
          <div className="mb-8 overflow-hidden rounded-2xl p-px shadow-2xl">
            <div className="rounded-2xl bg-white p-8 text-center">
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Chỉnh sửa hồ sơ
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Cập nhật thông tin nhân sự và liên hệ
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BASIC INFO */}
              <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-900 to-gray-700 shadow-lg">
                    <Contact className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Thông tin cơ bản
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Dữ liệu nhân sự chính thức
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
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
              <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-700 to-gray-500 shadow-lg">
                    <Contact className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Thông tin liên hệ
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Thông tin có thể cập nhật
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <button
                type="button"
                onClick={() => handleResetForm()}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl 
                border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 
                transition-all duration-300 hover:border-gray-900 hover:bg-gray-50 hover:scale-105 cursor-pointer"
              >
                <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
                <span>Thiết lập lại</span>
              </button>

              <div className="flex w-full sm:w-auto gap-3">
                <button
                  type="button"
                  onClick={() => navigate(backPath)}
                  className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl 
                  border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all 
                  duration-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Hủy</span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 
                  rounded-xl bg-linear-to-r from-gray-900 to-gray-700 px-6 py-3 text-sm font-semibold 
                  text-white transition-all duration-300 hover:from-gray-800 hover:to-gray-600 hover:shadow-xl 
                  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
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
