import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Activity,
  ArrowUpDown,
  History,
  FastForward,
} from "lucide-react";

import stravaApi from "../../api/stravaApi";
import runningActivityApi from "../../api/runningActivityApi";
import employeeApi from "../../api/employeeApi";

import CustomButton from "../../components/common/Button";
import Header from "../../components/common/Header";
import ActivitiesRegistered from "../../components/employee/ActivitiesRegistered";
import ActivitiesDetailDialog from "../../components/employee/ActivitiesDetailDialog";
import CustomCard from "../../components/common/CustomCard";

import Fuse from "fuse.js";
import toast from "react-hot-toast";

export default function ActivitiesOpening() {
  const [loading, setLoading] = useState(false);
  const [employeeID, setEmployeeID] = useState(null);

  const [redirect_uri, setRedirect_uri] = useState("");
  const [error, setError] = useState(null);
  const [connectedStrava, setConnectedStrava] = useState(false);

  const [currentView, setCurrentView] = useState("active");
  const [activities, setActivities] = useState([]);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [activityResults, setActivityResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("nearest");

  //=====================================================
  // PROFILE
  //=====================================================
  const fetchProfile = async () => {
    try {
      const profileRes = await employeeApi.getMyProfile();
      setEmployeeID(profileRes.result.employeeId);
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  //=====================================================
  // STRAVA STATUS
  //=====================================================
  useEffect(() => {
    if (!employeeID) return;
    console.log("kết nối strava");
    const checkStravaConnection = async () => {
      try {
        const connectionRes = await stravaApi.getStatusconnetion(employeeID);

        setConnectedStrava(connectionRes.result.connectionStatus);
      } catch (error) {
        setError(error);
      }
    };
    checkStravaConnection();
  }, [employeeID]);

  const handleStravaConnect = async () => {
    if (connectedStrava) {
      toast.success("Bạn đã kết nối Strava rồi");
      return;
    }

    try {
      const response = await stravaApi.RedirectURL();
      console.log(response);
      const redirectUrl = response.redirectUrl;
      if (redirectUrl) {
        setRedirect_uri(redirectUrl);

        console.log(redirectUrl);

        window.open(redirectUrl, "_blank");
      }
    } catch (error) {
      console.error("Error getting Strava redirect URL:", error);
      setError(error);
    }
  };

  //=====================================================
  // FETCH OPENING ACTIVITIES
  //=====================================================
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await runningActivityApi.employeeGetAllOpeningActivity();
      const filterActivities = response.result.filter(
        (a) => a.status === "Active" || a.status === "Open"
      );

      setActivities(filterActivities || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employeeID) return;
    fetchActivities();
  }, [employeeID]);

  //=====================================================
  // REGISTER / UNREGISTER
  //=====================================================
  const handleRegister = async (activity) => {
    try {
      await runningActivityApi.employeeRegisterActivity(
        activity.runningActivityId
      );

      toast.success("Đăng ký thành công");
      fetchActivities();
    } catch (err) {
      const backend = err?.response?.data;

      if (backend?.message === "ACTIVITY_REGISTRATION_CLOSED") {
        const now = new Date();
        const startDate = new Date(activity.registrationStartDate);
        const endDate = new Date(activity.registrationEndDate);

        if (now < startDate) {
          toast.error("Chưa đến ngày đăng ký");
          return;
        }

        if (now > endDate) {
          toast.error("Đã quá hạn đăng ký");
          return;
        }
      }

      if (backend?.message === "ACTIVITY_ALREADY_REGISTERED") {
        toast.error("Bạn đã đăng ký hoạt động này");
        return;
      }

      toast.error(backend?.message || "Không thể đăng ký");
    }
  };

  const handleUnregister = async (id) => {
    try {
      const res = await runningActivityApi.employeeUnregisterActivity(id);
      toast.success("Hủy đăng ký hoạt động thành công");
    } catch (error) {
      console.error("Hủy đăng ký thất bại", error.status);
      if (error.status) {
        toast.error("Đã quá hạn chỉnh sửa đăng ký");
      } else {
        toast.error("Hủy đăng ký thất bại");
      }
    }
  };

  //=====================================================
  // DETAIL
  //=====================================================
  const openDetails = (activity) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);

    setActivityResults(null);
    setResultsError(null);

    const loadResults = async () => {
      if (!employeeID) return;
      setResultsLoading(true);
      try {
        const res = await runningActivityApi.employeeGetResultActivities(
          employeeID,
          activity.runningActivityId
        );

        setActivityResults(res?.result);
      } catch (err) {
        setResultsError(err);
      } finally {
        setResultsLoading(false);
      }
    };

    loadResults();
  };

  //=====================================================
  // MISC
  //=====================================================
  const isFull = (activity) =>
    activity.runningActivity?.numberRegistered >=
    activity.runningActivity?.maxParticipant;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  //=====================================================
  // SEARCH + SORT (ACTIVE)
  //=====================================================
  const fuseActivities = new Fuse(activities, {
    keys: ["runningActivity.title"],
    threshold: 0.3,
  });

  let filteredActivities =
    searchQuery.trim() === ""
      ? activities
      : fuseActivities.search(searchQuery).map((r) => r.item);

  filteredActivities =
    sortType === "nearest"
      ? [...filteredActivities].sort(
          (a, b) =>
            new Date(a.runningActivity?.startDate) -
            new Date(b.runningActivity?.startDate)
        )
      : [...filteredActivities].sort(
          (a, b) =>
            new Date(b.runningActivity?.startDate) -
            new Date(a.runningActivity?.startDate)
        );

  //=====================================================
  // RENDER
  //=====================================================
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header title="Hoạt động" icon={Activity} />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEARCH + SORT SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
              />
            </div>

            <button
              onClick={() =>
                setSortType(sortType === "nearest" ? "furthest" : "nearest")
              }
              className="cursor-pointer flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-300  hover:border-gray-300 transition-all duration-200 shadow-sm whitespace-nowrap font-medium"
            >
              <ArrowUpDown size={18} />
              {sortType === "nearest" ? "Xa nhất" : "Gần nhất"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <CustomButton
              variant="orange"
              onClick={handleStravaConnect}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md  ${
                !connectedStrava
                  ? "cursor-pointer hover:shadow-lg transition-all duration-200"
                  : ""
              }`}
            >
              {connectedStrava ? "✓ Đã nối với STRAVA" : "Kết nối STRAVA"}
            </CustomButton>

            {currentView === "registered" ? (
              <CustomButton
                variant="green"
                onClick={() => setCurrentView("active")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <FastForward size={20} />
                Đang diễn ra
              </CustomButton>
            ) : (
              <CustomButton
                variant="primary"
                onClick={() => setCurrentView("registered")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
              >
                <History size={20} />
                Đã đăng ký
              </CustomButton>
            )}
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          {currentView === "registered" ? (
            <ActivitiesRegistered
              employeeID={employeeID}
              openDetails={openDetails}
              handleUnregister={handleUnregister}
              formatDate={formatDate}
              searchQuery={searchQuery}
              sortType={sortType}
            />
          ) : (
            <>
              {/* Section Header */}
              <div className="mb-8 pb-4 border-b-2 border-gray-400">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Hoạt động đang diễn ra
                </h1>
                <p className="text-base text-gray-600">
                  Danh sách các hoạt động đang được công ty tổ chức
                </p>
              </div>

              {/* Activities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.runningActivityId}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden">
                      <img
                        src={
                          activity.image ||
                          "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                        }
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-4 text-gray-900 line-clamp-2 min-h-14">
                        {activity.title}
                      </h3>

                      <div className="space-y-3 text-sm text-gray-600 mb-5">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 mt-0.5 shrink-0 text-gray-800" />
                          <span className="leading-tight">
                            {formatDate(activity.startDate)} -{" "}
                            {formatDate(activity.endDate)}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-800" />
                          <span className="leading-tight">
                            Quãng đường {activity.targetDistance} km
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <Users className="w-4 h-4 mt-0.5 shrink-0 text-gray-800" />
                          <span className="leading-tight">
                            Tối đa {activity.maxParticipant} người
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gray-800" />
                          <span className="leading-tight">
                            Đăng ký:{" "}
                            {formatDate(activity.registrationStartDate)}
                            {" - "}
                            {formatDate(activity.registrationEndDate)}
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col gap-3">
                        <CustomButton
                          variant="link"
                          onClick={() => openDetails(activity)}
                          className="w-full text-center py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-200"
                        >
                          Xem chi tiết →
                        </CustomButton>

                        {activity.isRegistered && (
                          <CustomButton
                            variant="primary"
                            disabled={isFull(activity)}
                            onClick={() => handleRegister(activity)}
                            className="w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isFull(activity)
                              ? "Đã đủ số lượng"
                              : "Đăng ký tham gia"}
                          </CustomButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredActivities.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Activity size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không có hoạt động nào
                  </h3>
                  <p className="text-gray-600">
                    Hiện tại chưa có hoạt động nào đang diễn ra
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* POPUP DETAIL */}
      {selectedActivity && (
        <ActivitiesDetailDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedActivity={selectedActivity}
          formatDate={formatDate}
          activityResults={activityResults}
          resultsLoading={resultsLoading}
          resultsError={resultsError}
          handleRegister={handleRegister}
          handleUnregister={handleUnregister}
          isFull={isFull}
          isHistory={currentView === "registered" ? true : false}
          isCancelled={activityResults?.isCancelled}
        />
      )}
    </div>
  );
}
