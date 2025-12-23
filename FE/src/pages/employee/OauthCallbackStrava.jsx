import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import stravaApi from "../../api/stravaApi";

export default function OAuthCallbackStrava() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [state, setState] = useState("");
  const [scope, setScope] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Lấy params từ URL
  useEffect(() => {
    const codeParam = searchParams.get("code");
    const stateParam = searchParams.get("state");
    const scopeParam = searchParams.get("scope");

    setCode(codeParam);
    setState(stateParam);
    setScope(scopeParam);
  }, [searchParams]);

  // 2️⃣ Bấm nút → POST về backend
  const handleConnectStrava = async () => {
    setLoading(true);
    try {
      await stravaApi.Oauth2({
        state: state,
        code: code,
        scope: scope
      });

      alert("Kết nối Strava thành công!");
    } catch (error) {
      console.error(error);
      alert("Kết nối Strava thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/150 flex items-center justify-center">
      <div className="bg-slate-800 text-white w-[600px] rounded-xl p-6 relative">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Kết nối Strava</h2>

        <div className="flex gap-6">
          {/* Bên trái */}
          <div className="flex-1 space-y-4 text-sm">
            <div className="flex gap-2 items-start">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-center">1</span>
              <p>Xác thực tài khoản Strava</p>
            </div>

            <div className="flex gap-2 items-start">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-center">2</span>
              <p>Kết nối và đồng bộ hoạt động</p>
            </div>

            <div className="flex gap-2 items-start text-gray-400">
              <span className="w-6 h-6 rounded-full bg-gray-600 text-center">3</span>
              <p>Hoàn tất</p>
            </div>
          </div>

          {/* Bên phải */}
          <div className="flex-1 bg-slate-900 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Strava_Logo.svg"
                alt="Strava"
                className="w-8 bg-white p-1 rounded"
              />
              <span className="font-semibold">Strava</span>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              Kết nối Strava để đồng bộ dữ liệu hoạt động thể thao.
            </p>

            <button
              onClick={handleConnectStrava}
              disabled={loading || !code}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 py-2 rounded-lg font-semibold"
            >
              {loading ? "Đang kết nối..." : "Kết nối Strava"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
