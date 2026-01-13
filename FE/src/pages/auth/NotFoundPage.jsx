import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -ml-32 -mb-32"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-gray-900 via-gray-700 to-gray-900 tracking-tight">
                404
              </h1>
              <div className="h-1 w-24 bg-linear-to-r from-transparent via-gray-900 to-transparent mx-auto mt-2"></div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Không tìm thấy trang
            </h2>

            {/* Description */}
            <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
              Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              {/* Login Button */}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <LogIn size={18} />
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>

        {/* Optional: Subtle hint text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Cần hỗ trợ? Vui lòng liên hệ bộ phận chăm sóc khách hàng
        </p>
      </div>
    </main>
  );
}
