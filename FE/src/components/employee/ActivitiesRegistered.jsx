import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import Fuse from "fuse.js";

import CustomButton from "../common/Button";
import CustomCard from "../common/CustomCard";
import runningActivityApi from "../../api/runningActivityApi";

export default function ActivitiesRegistered({
  employeeID,
  handleUnregister,
  openDetails,
  formatDate,
  searchQuery,
  sortType,
}) {
  const [registeredActivities, setRegisteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchRegistered = async () => {
    try {
      const res = await runningActivityApi.employeeGetAllRegisteredActivity(
        employeeID
      );
      setRegisteredActivities(res.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employeeID) return;
    fetchRegistered();
  }, [employeeID]);

  if (loading)
    return (
      <p className="text-center text-gray-400 py-8 text-sm">
        Đang tải hoạt động đã đăng ký...
      </p>
    );

  // ================= SEARCH + SORT =================
  const fuse = new Fuse(registeredActivities, {
    keys: ["runningActivity.title"],
    threshold: 0.3,
  });

  let filteredActivities =
    searchQuery.trim() === ""
      ? registeredActivities
      : fuse.search(searchQuery).map((r) => r.item);

  filteredActivities =
    sortType === "nearest"
      ? [...filteredActivities].sort(
          (a, b) =>
            new Date(a.runningActivity.startDate) -
            new Date(b.runningActivity.startDate)
        )
      : [...filteredActivities].sort(
          (a, b) =>
            new Date(b.runningActivity.startDate) -
            new Date(a.runningActivity.startDate)
        );

  // ================= RENDER =================
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {filteredActivities.map((activity) => {
        const ra = activity.runningActivity;

        return (
          <div
            key={activity.participateInId}
            className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden  hover:shadow-lg transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="relative h-44 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
              <img
                src={
                  ra.image ||
                  "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                }
                alt={ra.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-4 text-base leading-tight line-clamp-2 min-h-10">
                {ra.title}
              </h3>

              <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Calendar
                    size={15}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  <span className="leading-relaxed">
                    {formatDate(ra.startDate)} – {formatDate(ra.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <MapPin size={15} className="shrink-0 text-gray-400" />
                  <span>{ra.targetDistance} km</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <Users size={15} className="shrink-0 text-gray-400" />
                  <span>{ra.maxParticipant} người</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-600">
                  <Clock size={15} className="mt-0.5 shrink-0 text-gray-400" />
                  <span className="leading-relaxed">
                    {formatDate(ra.registrationStartDate)} –{" "}
                    {formatDate(ra.registrationEndDate)}
                  </span>
                </div>
              </div>

              {/* ACTION */}
              <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                <div className="flex justify-center">
                  <CustomButton
                    variant="link"
                    onClick={() => openDetails(ra)}
                    className="px-0 w-fit text-xs font-medium text-gray-900 hover:text-gray-600 cursor-pointer"
                  >
                    Xem chi tiết →
                  </CustomButton>
                </div>
                {(ra.status === "Active" || ra.status === "Open") &&
                !activity.isCancelled ? (
                  <CustomButton
                    variant="danger"
                    onClick={async () => {
                      await handleUnregister(ra.runningActivityId);
                      fetchRegistered();
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800  text-xs font-medium py-2.5 rounded-md transition-colors cursor-pointer"
                  >
                    Hủy đăng ký
                  </CustomButton>
                ) : ra.status === "Completed" ? (
                  <div className="w-full bg-gray-100 text-gray-500 text-xs font-medium py-2.5 rounded-md text-center cursor-not-allowed">
                    Đã kết thúc
                  </div>
                ) : ra.status === "Cancelled" ? (
                  <div className="w-full bg-gray-100 text-gray-500 text-xs font-medium py-2.5 rounded-md text-center cursor-not-allowed">
                    Hoạt động đã bị hủy
                  </div>
                ) : activity.isCancelled ? (
                  <div className="w-full bg-gray-100 text-gray-500 text-xs font-medium py-2.5 rounded-md text-center cursor-not-allowed">
                    Đã hủy
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
