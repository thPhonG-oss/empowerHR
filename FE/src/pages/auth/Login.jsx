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
    <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black p-10 pb-14 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            ></div>
          </div>
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-5 shadow-2xl ring-1 ring-white ring-opacity-20">
                <Users className="text-black" size={52} strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-center text-4xl font-bold text-white mb-3 tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-center text-gray-300 text-sm font-medium">
              Đăng nhập vào hệ thống quản lý nhân sự
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-10 -mt-8 bg-white rounded-t-3xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-800 mb-3 tracking-wider uppercase">
                Tên tài khoản
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors">
                  <User size={20} strokeWidth={2} />
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white hover:border-gray-300 transition-all duration-200"
                />
              </div>

              {/* Dropdown danh sách tài khoản */}
              {showSuggestions && filteredAccounts.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto"
                >
                  <div className="p-3">
                    <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">
                      Tài khoản đã lưu
                    </div>
                    {filteredAccounts.map((account, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectAccount(account)}
                        className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0 shadow-lg">
                            <User
                              size={18}
                              className="text-white"
                              strokeWidth={2.5}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate text-sm">
                              {account.userName}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {"•".repeat(account.password.length)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleDeleteAccount(e, account.userName)
                          }
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X
                            size={16}
                            className="text-red-500"
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-3 tracking-wider uppercase">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors">
                  <Lock size={20} strokeWidth={2} />
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
                  className="w-full pl-12 pr-14 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white hover:border-gray-300 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  {showPassword ? (
                    <Eye size={20} strokeWidth={2} />
                  ) : (
                    <EyeClosed size={20} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded-md border-2 border-gray-300 cursor-pointer"
                style={{ accentColor: "#111827" }}
              />
              <label
                htmlFor="rememberMe"
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none hover:text-gray-900 transition-colors"
              >
                Lưu tài khoản và mật khẩu
              </label>
            </div>

            {/* Error */}
            {wrongInput && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm font-semibold text-center">
                  Tên tài khoản hoặc mật khẩu không chính xác
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-gray-900 via-gray-800 to-black text-white font-bold 
              py-4 rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all 
              duration-300 shadow-xl transform hover:scale-102 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
                  <span className="font-bold tracking-wide">Đang xử lý...</span>
                </span>
              ) : (
                <span className="tracking-wide">Đăng nhập</span>
              )}
            </button>
          </form>

          {/* Footer hint */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Chỉ sử dụng chữ cái và số cho tên tài khoản & mật khẩu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
