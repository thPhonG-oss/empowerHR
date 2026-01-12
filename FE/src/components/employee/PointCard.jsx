import { useEffect, useState } from "react";
import pointAccountApi from "../../api/pointAccountApi";
import pointPolicyApi from "../../api/pointPolicyApi";
import RedeemRewardModal from "./RedeemRewardModal";
import { Gem, TrendingUp, ArrowLeftRight, Info } from "lucide-react";

function PointCard({ onRedeemSuccess }) {
  const [pointData, setPointData] = useState(null);
  const [pointPolicy, setPointPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openRedeem, setOpenRedeem] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [pointRes, policyRes] = await Promise.all([
        pointAccountApi.getMyPoint(),
        pointPolicyApi.getPointPolicy(),
      ]);

      setPointData(pointRes.data);
      setPointPolicy(policyRes.result);
    } catch (error) {
      console.error("Failed to fetch point data", error);
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
        <div className="flex flex-row items-center gap-2 p-2 rounded-xl">
          {/* Redeem Button */}
          <button
            onClick={() => setOpenRedeem(true)}
            className="flex-1 h-full bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition p-2 cursor-pointer"
          >
            Đổi thưởng
          </button>

          {/* Icon */}
          <div className="bg-blue-50 p-2.5 rounded-xl flex items-center justify-center">
            <Gem className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      {/* Current Points */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Điểm hiện tại</p>
        <p className="text-3xl font-bold text-black mt-1">
          {pointData.currentPoints.toLocaleString()} pts
        </p>
      </div>

      {/* Conversion Rate */}
      {pointPolicy && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-5">
          <Info className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-600">
            Tỉ lệ quy đổi:&nbsp;
            <span className="font-semibold text-gray-800">
              {pointPolicy.conversionRate.toLocaleString()} pts
            </span>
            &nbsp;= 1 đơn vị
          </p>
        </div>
      )}

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
      <RedeemRewardModal
        isOpen={openRedeem}
        onClose={() => setOpenRedeem(false)}
        pointPolicy={pointPolicy}
        currentPoints={pointData.currentPoints}
        onSuccess={onRedeemSuccess}
      />
    </div>
  );
}

export default PointCard;
