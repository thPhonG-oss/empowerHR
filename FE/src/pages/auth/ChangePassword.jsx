import { Eye, EyeClosed, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock dữ liệu tài khoản
const mockUsers = [
  { userName: "employee", password: "123", roles: ["EMPLOYEE"] },
  { userName: "admin", password: "123", roles: ["ADMIN"] },
  { userName: "manager", password: "123", roles: ["MANAGER"] },
];

function ChangePassword() {
  const [foundUser, setFoundUser] = useState(false);

  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [password, setPassword] = useState(""); // mật khẩu mới
  const [confirm, setConfirm] = useState(""); // xác nhận mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const [wrongInput, setWrongInput] = useState(false);

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Kiểm tra tồn tại tài khoản + mật khẩu hiện tại
  const checkUserExistence = () => {
    const user = mockUsers.find(
      (u) => u.userName === userName && u.password === currentPassword
    );

    // Gọi API kiểm tra tồn tại user

    if (user) {
      setFoundUser(true);
      setWrongInput(false);
    } else {
      setWrongInput(true);
      setFoundUser(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
      alert("Đổi mật khẩu thành công!");
      navigate("/login");
    }
    // Gọi API xử lý đổi mật khẩu
  };

  return (
    <div className="w-full h-screen flex items-start justify-center pt-20">
      <div className="bg-white w-1/4 rounded-2xl shadow-lg p-8">
        {/* TITLE */}
        <div className="flex items-center">
          <ChevronLeft
            className="cursor-pointer mr-2"
            onClick={() => navigate("/login")}
          />
          <h1 className="text-left text-2xl font-bold text-gray-900">
            Thay đổi mật khẩu
          </h1>
        </div>

        <h1 className="text-left text-gray-500 text-sm mt-2 mb-6">
          Nhập tài khoản và mật khẩu hiện tại để xác minh
        </h1>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleChangePassword}>
          {/* USERNAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên tài khoản
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setWrongInput(false);
              }}
              placeholder="Tên tài khoản"
              required
              disabled={foundUser}
              className={`w-full px-4 py-3 border rounded-lg transition ${
                foundUser
                  ? "bg-gray-100 cursor-not-allowed"
                  : "border-gray-300 focus:ring-2 focus:ring-black"
              }`}
            />
          </div>

          {/* CURRENT PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={
                  showPassword ? "Nhập mật khẩu hiện tại" : "••••••••••"
                }
                required
                disabled={foundUser}
                className={`w-full px-4 py-3 border rounded-lg transition ${
                  foundUser
                    ? "bg-gray-100 cursor-not-allowed"
                    : "border-gray-300 focus:ring-2 focus:ring-black"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          </div>

          {/* BUTTON TÌM TÀI KHOẢN */}
          <button
            onClick={(e) => {
              e.preventDefault();
              checkUserExistence();
            }}
            disabled={foundUser}
            className={`w-full bg-black text-white font-semibold py-3 rounded-lg transition duration-200 ${
              foundUser ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
            }`}
          >
            Xác minh tài khoản
          </button>

          {/* WRONG INPUT */}
          {wrongInput && (
            <p className="text-red-600 text-sm">
              Tên tài khoản hoặc mật khẩu hiện tại không đúng!
            </p>
          )}

          {/* FORM ĐỔI MK — CHỈ HIỆN SAU KHI XÁC MINH */}
          {foundUser && (
            <>
              {/* NEW PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    showPassword ? "Nhập mật khẩu mới" : "••••••••••"
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={
                    showPassword ? "Nhập lại mật khẩu" : "••••••••••"
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition duration-200"
              >
                Đổi mật khẩu
              </button>
              {/* WRONG INPUT */}
              {passwordMismatch && (
                <p className="text-red-600 text-sm">
                  Xác nhận mật khẩu không khớp
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
