import {
  Upload,
  FileText,
  User,
  Calendar,
  FileCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  X,
} from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
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
      const fetchLeaveBalance = async () => {
        try {
          const res = await employeeApi.filterLeaveType({ leaveTypeId });
          setDaysOff(res.result.remainingLeave || 0);
        } catch (err) {
          console.error("Fetch remaining leave error:", err);
          setDaysOff(0);
        }
      };

      fetchLeaveBalance();
    }
  };

  // -----------------------------
  // Handle file upload (đã tách riêng logic xử lý file)
  // -----------------------------
  const processFile = async (file) => {
    // ======= 1️⃣ Kiểm tra định dạng ảnh =======
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file hình ảnh (JPG, PNG, WEBP)");
      return;
    }

    // ======= 2️⃣ Kiểm tra dung lượng ảnh =======
    const maxSizeMB = 5; // giới hạn 5MB
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Kích thước file tối đa ${maxSizeMB}MB`);
      return;
    }

    // ======= 3️⃣ Lưu file để hiển thị tên =======
    setUploadedFiles([file]);

    // ======= 4️⃣ Upload lên Cloudinary =======
    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", UPLOAD_PRESET);
    if (CLOUD_FOLDER) formDataCloud.append("folder", CLOUD_FOLDER);

    try {
      setIsUploading(true);
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
        toast.success("Tải ảnh lên thành công!");
      } else {
        toast.error("Không thể tải lên Cloudinary");
        console.error("Cloudinary upload error:", data);
      }
    } catch (err) {
      console.error("Upload Cloudinary error:", err);
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await processFile(files[0]);
  };

  // -----------------------------
  // Handle Drag & Drop
  // -----------------------------
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    await processFile(files[0]);
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
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header title="Yêu cầu nghỉ phép" icon={FileText} />

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-2xl  shadow-2xl">
          <div className="rounded-2xl bg-white p-8 text-center">
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Yêu cầu hành chính
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Vui lòng điền đầy đủ thông tin vào đơn
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Card */}
          <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-900 to-gray-700 shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Thông tin cá nhân
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Thông tin tự động từ hệ thống
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phòng ban
                </label>
                <input
                  type="text"
                  value={userInfo.department}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Request Type Card */}
          <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-800 to-gray-600 shadow-lg">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Nội dung yêu cầu
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chọn loại nghỉ phép và kiểm tra số ngày
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn loại yêu cầu
                </label>
                <select
                  name="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-2 
                  focus:ring-gray-200 transition-all duration-200 font-medium"
                >
                  <option value="">-- Chọn loại --</option>
                  {leaveTypes.map((leaveType) => (
                    <option
                      key={leaveType.leaveTypeId}
                      value={leaveType.leaveTypeId}
                    >
                      {leaveType.leaveTypeName === "Remote"
                        ? "Làm việc tại nhà"
                        : leaveType.leaveTypeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày phép còn lại
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={daysOff}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600 font-bold text-lg"
                  />
                  {daysOff && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                      ngày
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-700 to-gray-500 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết yêu cầu
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ngày nghỉ và lý do
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={today}
                  className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                    !validTotal
                      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || today}
                  className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                    !validTotal
                      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* Tổng ngày nghỉ */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tổng số ngày nghỉ
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={!totalLeave ? "0" : totalLeave}
                  className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-lg transition-all duration-200 ${
                    !validTotal
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300 bg-gray-50 text-gray-900"
                  }`}
                />
                {totalLeave > 0 && (
                  <span
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium ${
                      !validTotal ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    ngày
                  </span>
                )}
              </div>
              {!validTotal && (
                <div className="mt-2 flex items-start gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">
                    Tổng số ngày nghỉ vượt quá số ngày còn lại!
                  </p>
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lý do
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Nhập lý do chi tiết..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-2 
                focus:ring-gray-200 transition-all duration-200 resize-none font-medium"
              />
            </div>
          </div>

          {/* File upload Card */}
          <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-gray-600 to-gray-400 shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Minh chứng</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tải lên tài liệu xác nhận (nếu có)
                </p>
              </div>
            </div>

            {!formData.proofDocument ? (
              <label
                htmlFor="file-upload"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group/upload flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-12 cursor-pointer transition-all duration-300 ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  isDragging
                    ? "border-gray-900 bg-gray-50 scale-105"
                    : "border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
                    <span className="text-gray-600 font-medium">
                      Đang tải lên...
                    </span>
                  </div>
                ) : (
                  <>
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 mb-4 ${
                        isDragging
                          ? "bg-gray-900"
                          : "group-hover/upload:bg-gray-900"
                      }`}
                    >
                      <Upload
                        className={`w-8 h-8 text-gray-400 transition-colors duration-300 ${
                          isDragging
                            ? "text-white"
                            : "group-hover/upload:text-white"
                        }`}
                      />
                    </div>
                    <span className="text-gray-900 font-semibold mb-1">
                      {isDragging ? "Thả ảnh vào đây" : "Tải minh chứng"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Kéo thả hoặc click để chọn file
                    </span>
                    <span className="text-xs text-gray-400 mt-2 italic">
                      (Chỉ chấp nhận file hình ảnh: JPG, PNG, WEBP)
                    </span>
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
                <div className="relative group/image">
                  <img
                    src={formData.proofDocument}
                    alt="Minh chứng"
                    className="w-64 h-64 object-contain rounded-2xl border-2 border-gray-200 shadow-lg"
                  />
                  <div
                    className="absolute inset-0 hover:bg-black/30 group-hover/image:bg-opacity-50 
                  rounded-2xl transition-all duration-300 flex items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, proofDocument: "" }));
                        setUploadedFiles([]);
                      }}
                      className="cursor-pointer opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 
                      flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Tải lại
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && !formData.proofDocument && (
              <ul className="mt-4 space-y-1">
                {uploadedFiles.map((f, i) => (
                  <li key={i} className="text-sm text-gray-600 font-medium">
                    • {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirmation Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative shrink-0 mt-1">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleInputChange}
                  disabled={!validTotal}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 
                  checked:border-gray-900 checked:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
                <CheckCircle2
                  className="absolute top-0 left-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100 
                transition-opacity duration-200 pointer-events-none"
                />
              </div>
              <div className="flex-1">
                <span className="text-gray-900 font-semibold group-hover:text-gray-700 transition-colors duration-200">
                  Tôi cam kết thông tin trên là chính xác
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Mọi thông tin sai lệch sẽ được xử lý theo quy định của công ty
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
            <button
              type="submit"
              disabled={!formData.agreed}
              className="group w-full bg-linear-to-r from-gray-900 to-gray-700 text-white py-4 rounded-xl font-bold 
              text-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 
              hover:from-gray-800 hover:to-gray-600 hover:shadow-2xl hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 duration-300" />
              <span>Gửi yêu cầu</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LeaveRequest;
