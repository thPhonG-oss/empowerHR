import { useState, useContext } from "react";
import { Users, Eye, EyeClosed } from "lucide-react";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock tài khoản user role đăng nhập
const mockUsers = [
  { email: "employee@example.com", password: "123", roles: ["EMPLOYEE"] },
  { email: "admin@example.com", password: "123", roles: ["ADMIN"] },
  { email: "manager@example.com", password: "123", roles: ["MANAGER"] },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tạm thời chưa có API
      // const res = await authApi.login({ email, password });
      // const token = res.data.result.token;

      // // Lưu token + roles vào context
      // login(token);

      // Mock login
      const user = mockUsers.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        const fakeToken = "fake_token_123"; // có thể dùng uuid hoặc random string
        console.log(user.roles[0]);
        login(fakeToken, user.roles[0]); // truyền roles trực tiếp

        const roleString = user.roles[0].toLowerCase();

        console.log(localStorage.getItem("token"));

        navigate(`/${roleString}/dashboard`);
      } else {
        alert("Đăng nhập thất bại!");
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="bg-white w-1/4 rounded-2xl shadow-lg p-8">
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
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  showPassword ? "your password" : "••••••••••••••••"
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 transition duration-200 mt-6"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <a href="#" className="text-gray-600 text-sm hover:underline">
            Quên mật khẩu
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
