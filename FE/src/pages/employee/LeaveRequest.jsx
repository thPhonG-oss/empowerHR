import { Upload, FileText } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/common/Header";

import employeeApi from "../../api/employeeApi";

import { countDays } from "../../utils/countDays";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const CLOUD_FOLDER = import.meta.env.VITE_CLOUD_FOLDER;

function LeaveRequest() {
  const { role } = useContext(AuthContext);
  const safeRole = typeof role === "string" ? role.toLowerCase() : "";

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const [formData, setFormData] = useState({
    reason: "",
    request_type: "LeaveRequest",
    startDate: "",
    endDate: "",
    proofDocument: "",
    leaveTypeId: "",
    agreed: false,
  });

  // 3 field readonly được fetch từ API
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    department: "",
  });

  // Leave Type
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [daysOff, setDaysOff] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [totalLeave, setTotalLeave] = useState(0);

  // Số ngày yêu cầu phải nhỏ hơn số ngày nghỉ được phép
  const [validTotal, setValidTotal] = useState(true);
  //
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // -----------------------------
  // Fetch info từ API
  // -----------------------------
  useEffect(() => {
    async function fetchInfo() {
      const res = await employeeApi.getMyProfile();

      setUserInfo({
        fullName: res.result.employeeName,
        department: res.result.department,
      });
    }

    fetchInfo();
  }, []);

  // -----------------------------
  // Fetch lấy danh sách loại yêu cầu
  // -----------------------------
  useEffect(() => {
    async function fetchInfo() {
      const res = await employeeApi.getLeaveType();
      setLeaveTypes(res.result);
    }

    fetchInfo();
  }, []);

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Khi chọn loại nghỉ phép → gọi API lấy remainingLeave
    if (name === "leaveTypeId") {
      const leaveTypeId = Number(value);

      if (!leaveTypeId) {
        setDaysOff("");
        return;
      }
      console.log(leaveTypeId);
      const fetchLeaveBalance = async () => {
        try {
          const res = await employeeApi.filterLeaveType({ leaveTypeId });
          console.log(res);
          setDaysOff(res.result.remainingLeave || 0);
          setDaysOff(0);
        } catch (err) {
          console.error("Fetch remaining leave error:", err);
          setDaysOff(0);
        }
      };

      fetchLeaveBalance();
    }
  };

  // -----------------------------
  // Handle file upload
  // -----------------------------
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);

    if (files.length === 0) return;

    const file = files[0];

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", UPLOAD_PRESET);
    if (CLOUD_FOLDER) formDataCloud.append("folder", CLOUD_FOLDER);

    try {
      setIsUploading(true); // Bắt đầu loading
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          proofDocument: data.secure_url,
        }));
      }
    } catch (err) {
      console.error("Upload Cloudinary error:", err);
    } finally {
      setIsUploading(false); // Kết thúc loading
    }
  };

  // -----------------------------
  // Submit form
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { agreed, ...rest } = formData;
    const body = {
      ...rest,
      leaveTypeId: Number(rest.leaveTypeId),
    };

    try {
      const res = await employeeApi.makeLeaveRequest(body);

      toast.success("Đã gửi yêu cầu thành công");

      await new Promise((r) => setTimeout(r, 1500));

      // Qua trang Lịch sử yêu cầu
      navigate(`/${safeRole}/request-history`);
    } catch (err) {
      toast.error("Gửi yêu cầu không thành công");
      console.error("Lỗi", err);
    }
  };

  // Cập nhật tổng số ngày nghỉ
  useEffect(() => {
    const total = countDays(formData.startDate, formData.endDate);
    setTotalLeave(total);

    // Kiểm tra tổng số ngày nghỉ có vượt quá ngày còn lại không
    if (daysOff && total > Number(daysOff)) {
      setValidTotal(false);
    } else {
      setValidTotal(true);
    }
  }, [formData.startDate, formData.endDate, daysOff]);

  return (
    <main className="min-h-screen">
      <Header title="Bảng chấm công" icon={FileText} />

      <div className="mx-6 my-6 px-6 py-4 bg-gray-100 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center py-8 mb-4">
          <h1 className="text-4xl font-bold mb-2">Yêu cầu hành chính</h1>
          <p className="text-gray-600 text-sm">
            Vui lòng điền đầy đủ thông tin vào đơn
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Personal Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-6">THÔNG TIN CÁ NHÂN</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phòng ban
                </label>
                <input
                  type="text"
                  value={userInfo.department}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Request Type + Days Off */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-6">NỘI DUNG YÊU CẦU</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chọn loại yêu cầu
                </label>
                <select
                  name="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg"
                >
                  <option value="">-- Chọn loại --</option>
                  {leaveTypes.map((leaveType) => (
                    <option
                      key={leaveType.leaveTypeId}
                      value={leaveType.leaveTypeId}
                    >
                      {leaveType.leaveTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày phép còn lại
                </label>
                <input
                  type="number"
                  value={daysOff}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-6">CHI TIẾT YÊU CẦU</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={today}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    !validTotal ? "border-red-500" : "border-gray-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || today}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    !validTotal ? "border-red-500" : "border-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Tổng ngày nghỉ */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tổng số ngày nghỉ
                </label>
                <input
                  type="text"
                  readOnly
                  value={!totalLeave ? "0" : totalLeave}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    !validTotal ? "border-red-500" : "border-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-2">Lý do</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Nhập lý do"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg"
              />
            </div>
          </div>

          {/* File upload */}
          <div className="p-6 border-b border-gray-200">
            {!formData.proofDocument ? (
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-12 cursor-pointer hover:border-blue-400 ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? (
                  <span className="text-gray-500">Đang tải lên...</span>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-600">Tải minh chứng</span>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={formData.proofDocument}
                  alt="Minh chứng"
                  className="w-48 h-48 object-contain rounded-lg mb-2 border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, proofDocument: "" }));
                    setUploadedFiles([]);
                  }}
                  className="text-red-500 text-sm hover:underline"
                >
                  Xóa ảnh
                </button>
              </div>
            )}

            {uploadedFiles.length > 0 && !formData.proofDocument && (
              <ul className="mt-4 text-sm text-gray-600">
                {uploadedFiles.map((f, i) => (
                  <li key={i}>• {f.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Checkbox */}
          <div className="p-6 border-b border-gray-200">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleInputChange}
                disabled={!validTotal}
              />
              <span>Tôi cam kết thông tin trên là chính xác</span>
            </label>
            {!validTotal && (
              <p className="text-red-500 text-sm mt-1">
                Tổng số ngày nghỉ vượt quá số ngày còn lại!
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="p-6">
            <button
              type="submit"
              disabled={!formData.agreed}
              className="w-full bg-black text-white py-3 rounded-lg disabled:bg-gray-400"
            >
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LeaveRequest;
