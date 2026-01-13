import { useContext, useState, useEffect, useRef } from "react";
import { Users, Eye, EyeClosed, Lock, User, Loader2, X } from "lucide-react";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlphanumericInput } from "../../hooks/useAlphanumericInput";

function Login() {
  const [userName, handleUserNameChange, setUserName] =
    useAlphanumericInput("");
  const [password, handlePasswordChange, setPassword] =
    useAlphanumericInput("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wrongInput, setWrongInput] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Load danh sách tài khoản đã lưu khi component mount
  useEffect(() => {
    const accounts = localStorage.getItem("savedAccounts");
    if (accounts) {
      try {
        setSavedAccounts(JSON.parse(accounts));
      } catch (err) {
        console.error("Error parsing saved accounts:", err);
        setSavedAccounts([]);
      }
    }
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc danh sách tài khoản theo input của người dùng
  const filteredAccounts = savedAccounts.filter((account) =>
    account.userName.toLowerCase().includes(userName.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setWrongInput(false);

    try {
      console.log("Đang đăng nhập...");
      const res = await authApi.login({ userName, password });

      if (!res || !res.result || !res.result.acessToken) {
        throw new Error("Invalid response format");
      }

      const token = res.result.acessToken;
      login(token);

      // Lưu tài khoản nếu tick "Lưu tài khoản"
      if (rememberMe) {
        const newAccount = { userName, password };
        const updatedAccounts = savedAccounts.filter(
          (acc) => acc.userName !== userName
        );
        updatedAccounts.unshift(newAccount); // Thêm vào đầu danh sách

        // Giới hạn tối đa 5 tài khoản
        const limitedAccounts = updatedAccounts.slice(0, 5);
        localStorage.setItem("savedAccounts", JSON.stringify(limitedAccounts));
        setSavedAccounts(limitedAccounts);
      }

      const role = localStorage.getItem("role");
      localStorage.setItem("userName", userName);

      console.log("Đăng nhập thành công, chuyển hướng...");
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setWrongInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Chọn tài khoản từ danh sách
  const handleSelectAccount = (account) => {
    setUserName(account.userName);
    setPassword(account.password);
    setShowSuggestions(false);
    setRememberMe(true);
  };

  // Xóa tài khoản khỏi danh sách
  const handleDeleteAccount = (e, userNameToDelete) => {
    e.stopPropagation();
    const updatedAccounts = savedAccounts.filter(
      (acc) => acc.userName !== userNameToDelete
    );
    localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts));
    setSavedAccounts(updatedAccounts);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="bg-white w-full max-w-md mx-4 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header Section */}
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
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên tài khoản
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    handleUserNameChange(e);
                    setWrongInput(false);
                    // Hiển thị suggestions khi có saved accounts
                    if (savedAccounts.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onFocus={() => {
                    // Chỉ hiển thị khi có saved accounts
                    if (savedAccounts.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Tên tài khoản (chỉ chữ và số)"
                  required
                  autoComplete="off"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black 
                  focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Dropdown danh sách tài khoản */}
              {showSuggestions && filteredAccounts.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                >
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                      TÀI KHOẢN ĐÃ LƯU
                    </div>
                    {filteredAccounts.map((account, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectAccount(account)}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                            <User size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {account.userName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {"•".repeat(account.password.length)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleDeleteAccount(e, account.userName)
                          }
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-md transition-all cursor-pointer"
                        >
                          <X size={16} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    handlePasswordChange(e);
                    setWrongInput(false);
                  }}
                  placeholder={
                    showPassword
                      ? "Chỉ chữ và số (không ký tự đặc biệt)"
                      : "••••••••••"
                  }
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-black  cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
              >
                Lưu tài khoản và mật khẩu
              </label>
            </div>

            {/* Error */}
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
              className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 cursor-pointer 
              disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
