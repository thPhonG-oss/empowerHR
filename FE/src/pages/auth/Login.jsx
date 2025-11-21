import { useState, useContext } from "react";
import { Users, Eye, EyeClosed } from "lucide-react";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Mock tài khoản user role đăng nhập
const mockUsers = [
  { userName: "employee", password: "123", roles: ["EMPLOYEE"] },
  { userName: "admin", password: "123", roles: ["ADMIN"] },
  { userName: "manager", password: "123", roles: ["MANAGER"] },
];

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
      // // Tạm thời chưa có API
      // const res = await authApi.login({ userName, password });
      // const token = res.data.result.token;

      // // Lưu token + roles vào context
      // login(token);

      // Mock login
      const user = mockUsers.find(
        (user) => user.userName === userName && user.password === password
      );
      if (user) {
        const fakeToken = "fake_token_123"; // có thể dùng uuid hoặc random string
        const fakeUserName = "Trương Việt Công";

        login(fakeToken, user.roles[0], fakeUserName);

        const roleString = user.roles[0].toLowerCase();

        console.log(localStorage.getItem("token"));

        navigate(`/${roleString}/dashboard`);
      } else {
        setWrongInput(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại!");
      setWrongInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen flex items-start justify-center pt-20">
      <div className="bg-white w-1/2 lg:w-1/3 xl:w-1/4 rounded-2xl shadow-lg p-8">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-black rounded-2xl p-4">
            <Users className="text-white" size={62} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Đăng nhập
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Hệ thống quản lý nhân sự
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setWrongInput(false);
                }}
                placeholder={
                  showPassword ? "mật khẩu của bạn" : "••••••••••••••••"
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          </div>

          {/* Thông báo cáo thông tin đăng nhập */}

          <p className="text-red-600 min-h-6">
            {wrongInput && "userName hoặc mật khẩu không chính xác"}
          </p>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 transition duration-200"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {/* Change and Forgot Password Link */}
        <div className="text-center mt-4 flex justify-between">
          <Link
            to="/change-password"
            className="text-gray-600 text-sm hover:underline"
          >
            Thay đổi mật khẩu
          </Link>
          <Link to="#" className="text-gray-600 text-sm hover:underline">
            Quên mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
