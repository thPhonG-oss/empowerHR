import { Calendar, Users, Target, Award, X } from "lucide-react";
import CustomButton from "../../components/common/Button";
import CustomDialog from "../../components/common/CustomDialog";

export default function ActivitiesDetailDialog({
  isOpen,
  onClose,
  selectedActivity,
  formatDate,
  activityResults,
  resultsLoading,
  resultsError,
  handleRegister,
  handleUnregister,
  isFull,
}) {
  if (!selectedActivity) return null;

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full max-h-[90vh] bg-white rounded-lg">
        {/* HEADER STICKY */}
        <div className="p-6 shadow-md bg-white sticky top-0 z-20 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">
              {selectedActivity.title}
            </h2>
            <p className="text-gray-600">{selectedActivity.description}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-red-300 p-2 rounded-md cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* SCROLL AREA (CONTENT + FOOTER CUỘN CHUNG) */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* IMAGE */}
          {selectedActivity.image && (
            <img
              src={selectedActivity.image || "/placeholder.svg"}
              alt={selectedActivity.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4" />
                Thời gian đăng ký
              </h4>
              <p className="text-sm text-gray-600">
                {formatDate(selectedActivity.registrationStartDate)} -{" "}
                {formatDate(selectedActivity.registrationEndDate)}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4" />
                Thời gian tổ chức
              </h4>
              <p className="text-sm text-gray-600">
                {formatDate(selectedActivity.startDate)} -{" "}
                {formatDate(selectedActivity.endDate)}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                <Users className="w-4 h-4" />
                Số lượng
              </h4>
              <p className="text-sm text-gray-600">
                {selectedActivity.numberRegistered !== undefined
                  ? `${selectedActivity.numberRegistered}/${selectedActivity.maxParticipant} người`
                  : `${selectedActivity.maxParticipant} người`}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                <Target className="w-4 h-4" />
                Quãng đường mục tiêu
              </h4>
              <p className="text-sm text-gray-600">
                {selectedActivity.targetDistance} km
              </p>
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
              <Award className="w-4 h-4" />
              Phần thưởng
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-medium text-gray-900">🥇 Giải nhất</div>
                <div className="text-yellow-700 font-semibold">
                  {selectedActivity.top1Bonus} điểm
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                <div className="font-medium text-gray-900">🥈 Giải nhì</div>
                <div className="text-gray-700 font-semibold">
                  {selectedActivity.top2Bonus} điểm
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="font-medium text-gray-900">🥉 Giải ba</div>
                <div className="text-orange-700 font-semibold">
                  {selectedActivity.top3Bonus} điểm
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-gray-900">✅ Hoàn thành</div>
                <div className="text-green-700 font-semibold">
                  {selectedActivity.completionBonus} điểm
                </div>
              </div>
            </div>
          </div>

          {/* Rules */}
          {selectedActivity.rules && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-900">Thể lệ</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                {selectedActivity.rules}
              </p>
            </div>
          )}

          {/* Activity Results */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
              <Award className="w-4 h-4" />
              Kết quả hoạt động
            </h4>

            {resultsLoading ? (
              <p className="text-sm text-gray-600">Đang tải kết quả...</p>
            ) : resultsError ? (
              <p className="text-sm text-red-600">Lỗi tải kết quả</p>
            ) : activityResults ? (
              <div className="text-sm text-gray-700 bg-white border rounded-lg p-3">
                {(() => {
                  const r = activityResults;
                  const get = (obj, names) => {
                    for (const n of names) {
                      if (obj[n] !== undefined) return obj[n];
                    }
                    return null;
                  };

                  const fields = [
                    {
                      names: ["totalRun", "TotalRun", "total_run"],
                      label: "Đã chạy",
                    },
                    {
                      names: ["isCompleted", "IsCompleted", "is_completed"],
                      label: "Hoàn thành",
                    },
                    {
                      names: ["completedDate", "CompletedDate"],
                      label: "Ngày hoàn thành",
                    },
                    {
                      names: ["rankPosition", "RankPosition"],
                      label: "Xếp hạng",
                    },
                    {
                      names: ["rewardPoints", "RewardPoints"],
                      label: "Điểm thưởng",
                    },
                  ];

                  return fields.map((f) => {
                    const value = get(r, f.names);
                    return (
                      <div
                        key={f.label}
                        className="flex justify-between py-1 border-b last:border-b-0"
                      >
                        <div className="text-gray-600">{f.label}</div>
                        <div className="font-medium">{value}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Chưa có kết quả cho hoạt động này.
              </p>
            )}
          </div>

          {/* FOOTER (SCROLL CÙNG NỘI DUNG) */}
          <div className="flex gap-3 p-6 border-t bg-white mt-6">
            {selectedActivity.isRegistered ? (
              selectedActivity.status === "Completed" ? (
                <CustomButton
                  variant="secondary"
                  className="flex-1 cursor-pointer"
                  disabled
                >
                  Đã tham gia
                </CustomButton>
              ) : (
                <CustomButton
                  variant="danger"
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    handleUnregister(selectedActivity.runningActivityId);
                    onClose();
                  }}
                >
                  Hủy đăng ký
                </CustomButton>
              )
            ) : (
              <CustomButton
                variant="primary"
                className="flex-1 cursor-pointer"
                disabled={isFull(selectedActivity)}
                onClick={() => {
                  handleRegister(selectedActivity.runningActivityId);
                  onClose();
                }}
              >
                {isFull(selectedActivity)
                  ? "Đã đủ số lượng"
                  : "Đăng ký tham gia"}
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}
