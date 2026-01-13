import { useState, useContext } from "react";
import { Users, Eye, EyeClosed, Lock, User } from "lucide-react";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [wrongInput, setWrongInput] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authApi.login({ userName, password });
      const token = res.result.acessToken;

      // Lưu token + roles vào context
      login(token);
      // Lấy role từ token
      const role = localStorage.getItem("role");

      localStorage.setItem("userName", userName);
      navigate(`/${role}/dashboard`);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setWrongInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="bg-white w-full max-w-md mx-4 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header Section với gradient */}
        <div className="bg-linear-to-br from-gray-900 to-black p-8 pb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <Users className="text-black" size={48} />
            </div>
          </div>
          <h1 className="text-center text-3xl font-bold text-white mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-center text-gray-300 text-sm">
            Đăng nhập vào hệ thống quản lý nhân sự
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 -mt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên tài khoản
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setWrongInput(false);
                  }}
                  placeholder="Nhập tên tài khoản"
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setWrongInput(false);
                  }}
                  placeholder={showPassword ? "Mật khẩu của bạn" : "••••••••••"}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {wrongInput && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium text-center">
                  Tên tài khoản hoặc mật khẩu không chính xác
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            {/* <Link
              to="#"
              className="text-gray-600 text-sm font-medium hover:text-black hover:underline transition-colors"
            >
              Quên mật khẩu?
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
