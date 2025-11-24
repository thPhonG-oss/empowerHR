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

  // Nếu là admin  xem hồ sơ nhân viên khác
  if (safeRole === "ADMIN") {
    // Lấy thông tin nhân viên từ API theo employeeId từ params
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await adminApi.getUserById(employeeId);
          // Lưu nhân viên vào session
          setProfile(res.data);
          sessionStorage.setItem("profile", JSON.stringify(res.data));
        } catch (err) {
          console.error("Lỗi khi load thông tin nhân viên:", err);
        }
      };
      fetchProfile();
    }, [employeeId]);
  }

  // Nếu là Employee xem hồ sơ nhân viên của mình
  if (safeRole === "EMPLOYEE") {
    useEffect(() => {
      const fetchMyProfile = async () => {
        try {
          const res = await employeeApi.getMyProfile();
          setProfile(res.result);
          sessionStorage.setItem("profile", JSON.stringify(res.result));
        } catch (err) {
          console.error("Không thể lấy profile của mình", err);
        }
      };
      fetchMyProfile();
    }, []);
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <Header title="Hồ sơ nhân viên" icon={Contact} />
        {/* Header với nút chỉnh sửa nổi bật */}
        <div className="px-8">
          <GoBackLink />

          <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            {canEdit && editPath && (
              <Link
                to={editPath}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md"
                title="Chỉnh sửa"
              >
                <PenLine className="h-4 w-4" />
                Chỉnh sửa
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Thông tin cơ bản - Không thể sửa */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin cơ bản
                  </h2>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoField label="Họ và tên" value={profile?.employeeName} />
                <InfoField label="Mã nhân viên" value={profile?.employeeCode} />
                <InfoField
                  label="Tên phòng ban"
                  value={
                    safeRole === "ADMIN"
                      ? profile?.department?.departmentName
                      : safeRole === "EMPLOYEE"
                      ? profile?.department
                      : ""
                  }
                />
                <InfoField
                  label="Vị trí"
                  value={
                    safeRole === "ADMIN"
                      ? profile?.position.positionName
                      : safeRole === "EMPLOYEE"
                      ? profile?.position
                      : ""
                  }
                />
                <InfoField
                  label="Tài khoản ngân hàng"
                  value={`${profile?.bank.bankAccountNumber} - ${profile?.bank.bankName}`}
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
            {/* Card 2: Thông tin liên hệ - Có thể sửa */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin liên hệ
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
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
