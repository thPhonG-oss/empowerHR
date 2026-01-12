import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, PenLine, Phone, Contact } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import InfoField from "../../components/common/InfoField";
import ContactField from "../../components/common/ContactField";
import GoBackLink from "../../components/common/GoBackLink";

import adminApi from "../../api/adminApi";
import employeeApi from "../../api/employeeApi";

function DetailProfile({}) {
  const { role } = useContext(AuthContext);
  const { employeeId } = useParams();
  const safeRole = typeof role === "string" ? role.toUpperCase() : "";
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (safeRole === "ADMIN" || (safeRole === "MANAGER" && employeeId)) {
          const res = await adminApi.getUserById(employeeId);
          setProfile(res.data);
          sessionStorage.setItem("profile", JSON.stringify(res.data));
        } else if (
          safeRole === "EMPLOYEE" ||
          (safeRole === "MANAGER" && !employeeId)
        ) {
          const res = await employeeApi.getMyProfile();
          setProfile(res.result);

          sessionStorage.setItem("profile", JSON.stringify(res.result));
        }
      } catch (err) {
        console.error("Lỗi khi load thông tin:", err);
      }
    };

    fetchData();
  }, [safeRole, employeeId]);

  // Chuẩn hóa department và position trước khi render JSX
  const departmentName = (() => {
    if (!profile?.department) return "";
    if (typeof profile.department === "string") return profile.department; // Employee xem chính mình
    if (typeof profile.department === "object")
      return profile.department.departmentName; // Admin/Manager xem nhân viên khác
    return "";
  })();

  const positionName = (() => {
    if (!profile?.position) return "";
    if (typeof profile.position === "string") return profile.position; // Employee
    if (typeof profile.position === "object")
      return profile.position.positionName; // Admin/Manager
    return "";
  })();

  // Manager có thể chỉnh sửa profile của chính mình (khi không có employeeId)
  // Manager không thể chỉnh sửa profile của nhân viên khác (khi có employeeId)
  const canEdit =
    safeRole === "ADMIN" ||
    safeRole === "EMPLOYEE" ||
    (safeRole === "MANAGER" && !employeeId);

  // Xác định edit path dựa trên role và context
  let editPath = "";
  if (safeRole === "ADMIN") {
    editPath = `/admin/employee-management/${employeeId}/edit`;
  } else if (safeRole === "EMPLOYEE") {
    editPath = "/employee/profile/edit";
  } else if (safeRole === "MANAGER" && !employeeId) {
    editPath = "/manager/profile/edit";
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Xác định tiêu đề dựa trên role
  const pageTitle =
    safeRole === "ADMIN"
      ? `Hồ sơ của ${profile?.employeeCode}`
      : safeRole === "MANAGER" && employeeId
      ? `Hồ sơ của ${profile?.employeeCode}`
      : "Hồ sơ của tôi";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <Header title="Hồ sơ" icon={Contact} />

        {/* Main Content */}
        <div className="px-8 pb-8">
          <GoBackLink />

          {/* Header Card với Gradient Border */}
          <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between rounded-2xl bg-white p-8">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {pageTitle}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Xem thông tin chi tiết hồ sơ nhân viên
                </p>
              </div>
              {canEdit && editPath && (
                <Link
                  to={editPath}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-xl hover:scale-105"
                  title="Chỉnh sửa"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <PenLine className="relative h-4 w-4 transition-transform group-hover:rotate-12" />
                  <span className="relative">Chỉnh sửa</span>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Thông tin cơ bản */}
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
                <InfoField label="Họ và tên" value={profile?.employeeName} />
                <InfoField label="Mã nhân viên" value={profile?.employeeCode} />
                <InfoField label="Tên phòng ban" value={departmentName} />
                <InfoField label="Vị trí" value={positionName} />
                <InfoField
                  label="Tài khoản ngân hàng"
                  value={`${profile?.bankAccountNumber} - ${profile?.bank}`}
                />
                <InfoField
                  label="Ngày vào làm"
                  value={formatDate(profile?.startingDate)}
                />
                <InfoField label="CCCD" value={profile?.identityCard} />
                <InfoField
                  label="Ngày sinh"
                  value={formatDate(profile?.dateOfBirth)}
                />
                <InfoField
                  label="Giới tính"
                  value={profile?.gender == "Male" ? "Nam" : "Nữ"}
                />
              </div>
            </div>

            {/* Card 2: Thông tin liên hệ */}
            <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-700 to-gray-500 shadow-lg">
                  <Phone className="h-6 w-6 text-white" />
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
                <ContactField
                  icon={MapPin}
                  label="Địa chỉ"
                  value={profile?.address}
                />
                <ContactField
                  icon={Mail}
                  label="Email"
                  value={profile?.email}
                />
                <ContactField
                  icon={Phone}
                  label="Số điện thoại"
                  value={profile?.phoneNumber}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProfile;
