import { X } from "lucide-react";
import { useState, useEffect } from "react";
import employeeApi from "../../api/employeeApi";
import toast from "react-hot-toast";

function RedeemRewardModal({
  isOpen,
  onClose,
  pointPolicy,
  currentPoints,
  onSuccess,
}) {
  const [points, setPoints] = useState("");
  const [previewAmount, setPreviewAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset khi mở modal
  useEffect(() => {
    if (isOpen) {
      setPoints("");
      setPreviewAmount(0);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePointChange = (e) => {
    const value = e.target.value;
    setPoints(value);
    setError("");

    const numericPoints = Number(value);

    if (!numericPoints || numericPoints <= 0) {
      setPreviewAmount(0);
      return;
    }

    if (numericPoints < pointPolicy?.minPoints) {
      setError(
        `Số điểm tối thiểu là ${pointPolicy.minPoints.toLocaleString()} pts`
      );
      setPreviewAmount(0);
      return;
    }

    if (numericPoints > pointPolicy?.maxPoints) {
      setError(
        `Số điểm tối đa là ${pointPolicy.maxPoints.toLocaleString()} pts`
      );
      setPreviewAmount(0);
      return;
    }

    if (numericPoints > currentPoints) {
      setError("Số điểm đổi vượt quá số điểm hiện có");
      setPreviewAmount(0);
      return;
    }

    setPreviewAmount(numericPoints * pointPolicy.conversionRate);
  };

  const handleRedeem = async () => {
    setError("");
    const redeemPoints = Number(points);

    // Validate
    if (!redeemPoints || redeemPoints <= 0) {
      setError("Vui lòng nhập số điểm hợp lệ");
      return;
    }

    if (redeemPoints > currentPoints) {
      setError("Số điểm đổi vượt quá số điểm hiện có");
      return;
    }

    if (!pointPolicy?.conversionRate) {
      setError("Chưa có chính sách quy đổi");
      return;
    }

    try {
      setLoading(true);

      await employeeApi.makeCashOut({
        pointsToCashOut: redeemPoints,
      });

      toast.success("Đổi điểm thành công");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Đổi thưởng thất bại, vui lòng thử lại"
      );
      toast.error("Đổi điểm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const isInvalid =
    !points || points <= 0 || points > currentPoints || !pointPolicy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:bg-red-50 p-2 rounded-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Đổi thưởng</h3>
        <p className="text-sm text-gray-500 mb-5">Nhập số điểm bạn muốn đổi</p>

        {/* Info */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-600">
            Điểm hiện có:&nbsp;
            <span className="font-semibold text-gray-800">
              {currentPoints.toLocaleString()} pts
            </span>
          </p>

          {pointPolicy && (
            <>
              <p className="text-sm text-gray-600 mt-1">
                Tỉ lệ quy đổi:&nbsp;
                <span className="font-semibold">
                  1 pts = {pointPolicy.conversionRate.toLocaleString()} VNĐ
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Điểm đổi tối thiểu:&nbsp;
                <span className="font-semibold">
                  {pointPolicy.minPoints.toLocaleString()} pts
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Điểm đổi tối đa:&nbsp;
                <span className="font-semibold">
                  {pointPolicy.maxPoints.toLocaleString()} pts
                </span>
              </p>
            </>
          )}
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điểm muốn đổi
          </label>
          <input
            type="number"
            value={points}
            onChange={handlePointChange}
            placeholder="Nhập số điểm"
            min={1}
            max={currentPoints}
            className="
              w-full border border-gray-300 rounded-xl px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />

          {/* Preview */}
          {previewAmount > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Bạn sẽ nhận được:&nbsp;
              <span className="font-semibold text-green-600">
                {previewAmount.toLocaleString()} VNĐ
              </span>
            </p>
          )}

          {/* Error */}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600
                       hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={handleRedeem}
            disabled={loading || isInvalid}
            className="px-4 py-2 rounded-xl bg-black text-white
                       hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RedeemRewardModal;
