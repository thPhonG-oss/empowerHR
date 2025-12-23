import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import CustomButton from "../common/Button";
import CustomCard from "../common/CustomCard";
import runningActivityApi from "../../api/runningActivityApi";
import Fuse from "fuse.js";

export default function ActivitiesRegistered({
  employeeID,
  openDetails,
  handleUnregister,
  formatDate,
  searchQuery,
  sortType,
}) {
  const [registeredActivities, setRegisteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeID) return;

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

    fetchRegistered();
  }, [employeeID]);

  if (loading) return <p>Đang tải...</p>;

  //=====================================================
  // SEARCH + SORT (REGISTERED)
  //=====================================================
  const fuse = new Fuse(registeredActivities, {
    keys: ["title"],
    threshold: 0.3,
  });

  let filteredActivities =
    searchQuery.trim() === ""
      ? registeredActivities
      : fuse.search(searchQuery).map((r) => r.item);

  if (sortType === "nearest") {
    filteredActivities = [...filteredActivities].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  } else {
    filteredActivities = [...filteredActivities].sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredActivities.map((activity) => (
        <CustomCard key={activity.runningActivityId}>
          {/* UI GIỮ NGUYÊN */}
          <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
            <img
              src={
                activity.image ||
                "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
              }
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">{activity.title}</h3>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(activity.startDate)} -{" "}
                {formatDate(activity.endDate)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {activity.targetDistance} km
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {activity.maxParticipant} người
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDate(activity.registrationStartDate)} -{" "}
                {formatDate(activity.registrationEndDate)}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <CustomButton
                variant="link"
                onClick={() => openDetails(activity)}
                className="cursor-pointer w-fit px-0"
              >
                Xem chi tiết
              </CustomButton>
              {activity.status == "Active" && (
                <CustomButton
                  variant="danger"
                  onClick={() => handleUnregister(activity.runningActivityId)}
                  className="cursor-pointer w-full"
                >
                  Hủy đăng ký
                </CustomButton>
              )}
              {activity.status == "Completed" && (
                <CustomButton
                  variant="secondary"
                  className="w-full cursor-not-allowed"
                >
                  Đã kết thúc
                </CustomButton>
              )}
              {activity.status == "Cancelled" && (
                <CustomButton
                  variant="secondary"
                  className="w-full cursor-not-allowed"
                >
                  Hoạt động bị hủy bỏ
                </CustomButton>
              )}
            </div>
          </div>
        </CustomCard>
      ))}
    </div>
  );
}
