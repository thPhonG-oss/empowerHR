import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, MapPin, PenLine, Phone } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

// Mock data theo schema Employee
const mockProfile = {
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
  department_id: 1,
  position_id: 1,
  point_balance: 500,
  // Thông tin bổ sung (có thể từ join với bảng khác)
  department_name: "Phòng Nhân sự",
  position_name: "Nhân viên",
  bank_account: "1234567890",
  bank_name: "Vietcombank",
};

function DetailProfile() {
  const { role } = useContext(AuthContext);
  const { employeeId } = useParams();
  const safeRole = typeof role === "string" ? role.toUpperCase() : "";
  
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

  // TODO: Fetch profile data by employeeId
  // useEffect(() => {
  //   axiosClient.get(`/employees/${employeeId}`).then(setProfile);
  // }, [employeeId]);

  // Xác định tiêu đề dựa trên role
  const pageTitle =
    safeRole === "ADMIN"
      ? `Hồ sơ của ${mockProfile.employee_code}`
      : safeRole === "MANAGER" && employeeId
      ? `Hồ sơ của ${mockProfile.employee_code}`
      : "Hồ sơ của tôi";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header với nút chỉnh sửa nổi bật */}
        <div className="flex items-center justify-between">
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
            <InfoField label="Họ và tên" value={mockProfile.employee_name} />
            <InfoField label="Mã nhân viên" value={mockProfile.employee_code} />
            <InfoField label="Tên phòng ban" value={mockProfile.department_name} />
            <InfoField label="Vị trí" value={mockProfile.position_name} />
            <InfoField
              label="Tài khoản ngân hàng"
              value={`${mockProfile.bank_account} - ${mockProfile.bank_name}`}
            />
            <InfoField
              label="Ngày vào làm"
              value={formatDate(mockProfile.starting_date)}
            />
            <InfoField label="CCCD" value={mockProfile.identity_card} />
            <InfoField
              label="Ngày sinh"
              value={formatDate(mockProfile.date_of_birth)}
            />
            <InfoField label="Giới tính" value={mockProfile.gender} />
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
              value={mockProfile.address}
            />
            <ContactField
              icon={Mail}
              label="Email"
              value={mockProfile.email}
            />
            <ContactField
              icon={Phone}
              label="Số điện thoại"
              value={mockProfile.phone_number}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-900">{value || "-"}</p>
    </div>
  );
}

function ContactField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-base font-semibold text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default DetailProfile;

