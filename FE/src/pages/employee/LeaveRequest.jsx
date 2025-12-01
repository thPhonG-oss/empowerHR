import { Upload, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../../components/common/Header";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const CLOUD_FOLDER = import.meta.env.VITE_CLOUD_FOLDER;

function LeaveRequest() {
  // -----------------------------
  // FORM DATA (đúng DTO backend)
  // -----------------------------
  const [formData, setFormData] = useState({
    reason: "",
    request_type: "",
    startDate: "",
    endDate: "",
    proof_document: "",
    leaveTypeId: "",
    agreed: false,
  });

  // 3 field readonly được fetch từ API
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    department: "",
    daysOff: 0,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // -----------------------------
  // Fetch info từ API
  // -----------------------------
  useEffect(() => {
    async function fetchInfo() {
      const res = await fetch("http://localhost:8080/api/user/info");
      const data = await res.json();

      setUserInfo({
        fullName: data.fullName,
        department: data.department,
        daysOff: data.remainingLeaveDays,
      });
    }

    fetchInfo();
  }, []);

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      const data = await res.json();
      console.log("Cloudinary upload result:", data);

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          proof_document: data.secure_url,
        }));
      }

      console.log(data.secure_url);
    } catch (err) {
      console.error("Upload Cloudinary error:", err);
    }
  };

  // -----------------------------
  // Submit form
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      leaveTypeId: parseInt(formData.leaveTypeId),
    };

    console.log("DATA gửi backend:", body);

    // const res = await fetch("http://localhost:8080/api/leave-requests", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(body),
    // });

    // if (res.ok) alert("Gửi yêu cầu thành công!");
    // else alert("Lỗi khi gửi yêu cầu");
  };

  return (
    <main className="min-h-screen">
      <Header title="Bảng chấm công" icon={FileText} />

      <div className="mx-6 my-6 px-6 py-4 bg-gray-100 rounded-2xl">
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
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100"
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
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100"
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
                  name="request_type"
                  value={formData.request_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg"
                >
                  <option value="">-- Chọn loại --</option>
                  <option value="LEAVE">Nghỉ phép</option>
                  <option value="LATE">Đi muộn</option>
                  <option value="EARLY">Về sớm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày phép còn lại
                </label>
                <input
                  type="number"
                  value={userInfo.daysOff}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100"
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
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg"
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
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg"
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

            {/* Leave Type ID */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Mã loại nghỉ phép (leaveTypeId)
              </label>
              <input
                type="number"
                name="leaveTypeId"
                value={formData.leaveTypeId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-400 rounded-lg"
              />
            </div>
          </div>

          {/* File upload */}
          <div className="p-6 border-b border-gray-200">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-12 cursor-pointer hover:border-blue-400"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600">Tải minh chứng</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFiles.length > 0 && (
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
              />
              <span>Tôi cam kết thông tin trên là chính xác</span>
            </label>
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
