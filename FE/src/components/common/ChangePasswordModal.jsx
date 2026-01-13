import { Eye, EyeClosed, Lock, CheckCircle2, X, Loader2 } from "lucide-react";
import { useState } from "react";
import authApi from "../../api/authApi";
import { useAlphanumericInput } from "../../hooks/useAlphanumericInput";
import toast from "react-hot-toast";

function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, handleCurrentChange, setCurrentPassword] =
    useAlphanumericInput("");
  const [newPassword, handleNewChange, setNewPassword] =
    useAlphanumericInput("");
  const [confirmPassword, handleConfirmChange, setConfirmPassword] =
    useAlphanumericInput("");

  const [showPassword, setShowPassword] = useState(false);
  const [wrongInput, setWrongInput] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleClose = () => {
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setWrongInput(false);
    setPasswordMismatch(false);
    setSuccess(false);
    onClose();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    setIsLoading(true);
    setWrongInput(false);

    try {
      // Xác minh mật khẩu hiện tại
      await authApi.confirmAccount({
        userName,
        password: currentPassword,
      });

      // Đổi mật khẩu
      await authApi.changePassword({
        userName,
        newpassword: newPassword,
      });

      setSuccess(true);
      setTimeout(() => handleClose(), 2000);
    } catch (error) {
      console.error("Change password error:", error);
      if (error.response?.status === 401 || error.response?.status === 400) {
        setWrongInput(true);
      } else {
        toast.error("Đổi mật khẩu thất bại! Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50">
      <div
        className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in 
      fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className=" p-6 relative shadow-md">
          <button
            onClick={handleClose}
            className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:bg-red-100 p-1 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-1">Đổi mật khẩu</h2>
          <p className="text-gray-600 text-sm">
            Tài khoản: <span className="font-semibold">{userName}</span>
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="text-green-600" size={48} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Thành công!
              </h3>
              <p className="text-gray-600">
                Mật khẩu đã được thay đổi thành công
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleChangePassword}>
              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      handleCurrentChange(e);
                      setWrongInput(false);
                    }}
                    placeholder={
                      showPassword ? "Nhập mật khẩu hiện tại" : "••••••••••"
                    }
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-black transition-all bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                    hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </button>
                </div>
              </div>

              {wrongInput && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm font-medium text-center">
                    Mật khẩu hiện tại không đúng
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">
                    Mật khẩu mới
                  </span>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      handleNewChange(e);
                      setPasswordMismatch(false);
                    }}
                    placeholder={
                      showPassword ? "Nhập mật khẩu mới" : "••••••••••"
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-black transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      handleConfirmChange(e);
                      setPasswordMismatch(false);
                    }}
                    placeholder={
                      showPassword ? "Nhập lại mật khẩu" : "••••••••••"
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-black 
                    transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {passwordMismatch && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm font-medium text-center">
                    Xác nhận mật khẩu không khớp
                  </p>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl 
                  hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2 text-gray-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
