import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-900 to-slate-800 text-slate-100 p-6">
      <div className="max-w-3xl w-full rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-700 shadow-2xl p-12 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-7xl font-extrabold text-amber-400 drop-shadow mb-4">
            404
          </h1>

          <h2 className="text-2xl font-semibold mb-2">Không tìm thấy trang</h2>

          <p className="text-sm opacity-80 max-w-sm mb-6">
            Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.
          </p>

          <div className="flex gap-3">
            {/* Nút quay lại */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 hover:-translate-y-0.5 transition text-sm"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>

            {/* Nút đăng nhập */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 text-slate-900 font-semibold hover:brightness-95 hover:-translate-y-0.5 transition text-sm"
            >
              <LogIn size={16} />
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
