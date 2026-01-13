import { useState, useEffect } from "react";
import { X, Award, Gift } from "lucide-react";
import managerApi from "../../api/managerApi";
import toast from "react-hot-toast";
import departmentApi from "../../api/departmentApi";
import { getMyDepartmentId } from "../../utils/getMyDepartmentId";
import { getMyId } from "../../utils/getMyId";

function GiveRewardsModal({ isOpen, onClose, employee, onSuccess }) {
  const [points, setPoints] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [departmentId, setDepartmentId] = useState(null);
  const [myEmployees, setMyEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Gán employee nếu được truyền vào
  useEffect(() => {
    if (employee) {
      setSelectedEmployee(employee);
    }
  }, [employee]);

  // Fetch departmentId nếu modal mở mà không có employee
  useEffect(() => {
    if (isOpen && !employee) {
      const fetchDepartmentId = async () => {
        try {
          const id = await getMyDepartmentId();
          setDepartmentId(id);
        } catch (err) {
          console.error("Lỗi khi lấy departmentId:", err);
        }
      };
      fetchDepartmentId();
    }
  }, [isOpen, employee]);

  // Fetch danh sách nhân viên khi có departmentId (và không có employee)
  useEffect(() => {
    if (departmentId && !employee) {
      const fetchEmployees = async () => {
        try {
          const res = await departmentApi.getEmployeesInDepartment(
            departmentId,
            1
          );

          // Lấy ID của chính mình
          const myId = await getMyId();

          // Lọc bỏ chính bản thân khỏi danh sách
          const filteredEmployees = (
            res.result.employeeResponseDTOS || []
          ).filter((emp) => emp.employeeId !== myId);

          setMyEmployees(filteredEmployees);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách nhân viên:", err);
          toast.error("Không thể tải danh sách nhân viên");
        }
      };
      fetchEmployees();
    }
  }, [departmentId, employee]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const chosen = selectedEmployee;

    if (!chosen) {
      setError("Vui lòng chọn nhân viên để trao thưởng");
      return;
    }

    if (!points || points <= 0) {
      setError("Vui lòng nhập số điểm hợp lệ");
      return;
    }

    if (!message.trim()) {
      setError("Vui lòng nhập lý do trao thưởng");
      return;
    }

    try {
      setLoading(true);
      const data = {
        employeeId: chosen.employeeId,
        points: parseInt(points),
        message: message.trim(),
      };

      await managerApi.givePoint(data);
      toast.success("Thưởng điểm thành công");

      if (onSuccess) onSuccess();

      // Reset form
      setPoints("");
      setMessage("");
      setError("");
      setSelectedEmployee(employee || null); // giữ lại nếu có employee props
      onClose();
    } catch (error) {
      toast.error("Thưởng điểm thất bại");
      console.error("Error giving points:", error);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPoints("");
    setMessage("");
    setError("");
    setSelectedEmployee(employee || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Gift className="size-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Trao thưởng điểm
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors cursor-pointer "
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>

        {/* Thông tin hoặc lựa chọn nhân viên */}
        {selectedEmployee ? (
          <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center font-semibold text-gray-700 border border-gray-200">
                {selectedEmployee.employeeName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedEmployee.employeeName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedEmployee.employeeCode}
                </p>
              </div>
            </div>
            {/* Nếu employee truyền từ props thì KHÔNG cho chọn lại */}
            {!employee && (
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="text-sm text-gray-600 hover:text-black font-semibold underline transition-colors cursor-pointer"
              >
                Chọn lại
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Chọn nhân viên
            </label>
            <div className="relative">
              <select
                value={selectedEmployee?.employeeId || ""}
                onChange={(e) => {
                  const emp = myEmployees.find(
                    (emp) => emp.employeeId === parseInt(e.target.value)
                  );
                  setSelectedEmployee(emp || null);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">-- Chọn nhân viên --</option>
                {myEmployees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.employeeName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Points Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Số điểm <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Nhập số điểm..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ghi chú trao thưởng <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập ghi chú trao thưởng..."
              rows="4"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GiveRewardsModal;
