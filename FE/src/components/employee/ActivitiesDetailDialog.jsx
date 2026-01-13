import { Calendar, Users, Target, Award, X } from "lucide-react";
import CustomButton from "../../components/common/Button";
import CustomDialog from "../../components/common/CustomDialog";
import { useState, useEffect } from "react";

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
  isHistory = false,
  isCancelled = false,
}) {
  useEffect(() => {}, [activityResults]);
  if (!selectedActivity) return null;

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col h-full max-h-[90vh] w-full max-w-4xl bg-white rounded-xl shadow-2xl">
        {/* HEADER STICKY */}
        <div className="p-6 shadow-lg bg-white sticky top-0 z-20 flex justify-between items-start rounded-t-xl">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold mb-2 leading-tight">
              {selectedActivity.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedActivity.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className=" p-2 rounded-lg cursor-pointer transition-all duration-200 shrink-0  hover:bg-red-100 transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLL AREA (CONTENT + FOOTER CUỘN CHUNG) */}
        <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
          {/* IMAGE */}
          {selectedActivity.image && (
            <div className="mb-6 overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src={
                  selectedActivity.image ||
                  "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                }
                alt={selectedActivity.title}
                className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500 grayscale-0 hover:grayscale-0"
              />
            </div>
          )}

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-700" />
                </div>
                Thời gian đăng ký
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed pl-10">
                {formatDate(selectedActivity.registrationStartDate)} -{" "}
                {formatDate(selectedActivity.registrationEndDate)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-700" />
                </div>
                Thời gian tổ chức
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed pl-10">
                {formatDate(selectedActivity.startDate)} -{" "}
                {formatDate(selectedActivity.endDate)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-4 h-4 text-gray-700" />
                </div>
                Số lượng
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed pl-10">
                {selectedActivity.numberRegistered !== undefined
                  ? `${selectedActivity.numberRegistered}/${selectedActivity.maxParticipant} người`
                  : `${selectedActivity.maxParticipant} người`}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Target className="w-4 h-4 text-gray-700" />
                </div>
                Quãng đường mục tiêu
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed pl-10">
                {selectedActivity.targetDistance} km
              </p>
            </div>
          </div>

          {/* Rewards */}
          {isHistory && (
            <div className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 text-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Award className="w-5 h-5 text-gray-700" />
                </div>
                Phần thưởng
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-gray-900  rounded-xl  hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="font-medium text-white mb-1 text-lg">
                    Giải nhất
                  </div>
                  <div className="text-gray-200 font-bold text-xl">
                    {selectedActivity.top1Bonus} điểm
                  </div>
                </div>

                <div className="p-4 bg-gray-700 rounded-xl  hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="font-medium text-white mb-1 text-lg">
                    Giải nhì
                  </div>
                  <div className="text-gray-200 font-bold text-xl">
                    {selectedActivity.top2Bonus} điểm
                  </div>
                </div>

                <div className="p-4 bg-gray-500 rounded-xl  hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="font-medium text-white mb-1 text-lg">
                    Giải ba
                  </div>
                  <div className="text-gray-100 font-bold text-xl">
                    {selectedActivity.top3Bonus} điểm
                  </div>
                </div>

                <div className="p-4 bg-gray-200 rounded-xl  hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="font-medium text-gray-900 mb-1 text-lg">
                    Hoàn thành
                  </div>
                  <div className="text-gray-700 font-bold text-xl">
                    {selectedActivity.completionBonus} điểm
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rules */}
          {selectedActivity.rules && (
            <div className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-800 text-lg">
                Thể lệ
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
                {selectedActivity.rules}
              </p>
            </div>
          )}

          {/* Activity Results */}
          <div className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 text-lg">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Award className="w-5 h-5 text-gray-700" />
              </div>
              Kết quả hoạt động
            </h4>

            {resultsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                <p className="text-sm text-gray-600 ml-3">
                  Đang tải kết quả...
                </p>
              </div>
            ) : resultsError ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-700">Chưa có kết quả</p>
              </div>
            ) : activityResults ? (
              <div className="text-sm text-gray-700 bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
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

                  return fields.map((f, index) => {
                    const value = get(r, f.names);
                    return (
                      <div
                        key={f.label}
                        className={`flex justify-between py-3 px-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-gray-600 font-medium">
                          {f.label}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {value}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Chưa có kết quả cho hoạt động này.
                </p>
              </div>
            )}
          </div>

          {/* FOOTER (SCROLL CÙNG NỘI DUNG) */}
          <div className="flex gap-3 pt-6 border-t-2 border-gray-200 bg-white mt-6 rounded-lg">
            {isHistory ? (
              // ---- Lịch sử (chỉ xem) ----
              isCancelled ? (
                <CustomButton
                  variant="secondary"
                  className="flex-1 cursor-not-allowed"
                >
                  Đã hủy đăng ký
                </CustomButton>
              ) : selectedActivity.status === "Completed" ? (
                <CustomButton
                  variant="blue"
                  className="flex-1 cursor-not-allowed"
                >
                  Đã kết thúc
                </CustomButton>
              ) : selectedActivity.status === "Cancelled" ? (
                <CustomButton
                  variant="secondary"
                  className="flex-1 cursor-not-allowed"
                >
                  Hoạt động đã bị hủy
                </CustomButton>
              ) : (
                <CustomButton
                  variant="danger"
                  onClick={() => {
                    handleUnregister(selectedActivity?.runningActivityId);
                  }}
                  className="cursor-pointer w-full"
                >
                  Hủy đăng ký
                </CustomButton>
              )
            ) : selectedActivity.status === "Active" && !isCancelled ? (
              <CustomButton
                variant="blue"
                className="flex-1 cursor-not-allowed"
              >
                Hoạt động đang diễn ra
              </CustomButton>
            ) : selectedActivity.status === "Completed" ? (
              <CustomButton
                variant="blue"
                className="flex-1 cursor-not-allowed"
              >
                Đã kết thúc
              </CustomButton>
            ) : selectedActivity.status === "Cancelled" ? (
              <CustomButton
                variant="secondary"
                className="flex-1 cursor-not-allowed"
              >
                Hoạt động đã bị hủy
              </CustomButton>
            ) : isCancelled ? (
              <CustomButton
                variant="secondary"
                className="flex-1 cursor-not-allowed"
              >
                Đã hủy đăng ký
              </CustomButton>
            ) : selectedActivity.isRegistered ? (
              <CustomButton
                variant="secondary"
                className="flex-1 cursor-not-allowed"
                disabled
              >
                Đã tham gia
              </CustomButton>
            ) : (
              <CustomButton
                variant="primary"
                className="flex-1 cursor-pointer"
                disabled={isFull(selectedActivity)}
                onClick={() => {
                  handleRegister(selectedActivity);
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
