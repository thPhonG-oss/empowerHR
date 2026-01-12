import { useEffect, useState } from "react";
import pointAccountApi from "../../api/pointAccountApi";
import { Gem, TrendingUp, ArrowLeftRight } from "lucide-react";

function PointCard() {
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPointAccount();
  }, []);

  const fetchPointAccount = async () => {
    try {
      setLoading(true);
      const res = await pointAccountApi.getMyPoint();
      setPointData(res.data);
    } catch (error) {
      console.error("Failed to fetch point account", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!pointData) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">
          Điểm thưởng của bạn
        </h3>
        <div className="bg-blue-50 p-2.5 rounded-xl">
          <Gem className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Current Points */}
      <div className="mb-5">
        <p className="text-sm text-gray-500">Điểm hiện tại</p>
        <p className="text-3xl font-bold text-black mt-1">
          {pointData.currentPoints.toLocaleString()} pts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm text-gray-600">Tổng điểm đã dùng</p>
          </div>
          <p className="font-semibold text-green-700">
            +{pointData.totalEarns.toLocaleString()} pts
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowLeftRight className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-600">Đã đổi</p>
          </div>
          <p className="font-semibold text-red-600">
            {pointData.totalTransferred} lần
          </p>
        </div>
      </div>

      {/* Footer info */}
      <p className="text-xs text-gray-400 mt-4">
        Cập nhật lần cuối:{" "}
        {new Date(pointData.updateAt).toLocaleString("vi-VN")}
      </p>
    </div>
  );
}

export default PointCard;
