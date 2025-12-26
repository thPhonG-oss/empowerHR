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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await employeeApi.getMyProfile();
        setEmployeeID(profileRes.result.employeeId);
      } catch (error) {
        setError(error);
      }
    };
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
        (a) => a.status === "Active"
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
      console.log("ID hoạt động", activity.runningActivityId);
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

  const handleUnregister = async (participateInId) => {
    try {
      const res = await runningActivityApi.employeeUnregisterActivity(
        participateInId
      );
      console.log(res);
      toast.success("Hủy đăng ký hoạt động thành công");
    } catch (error) {
      console.error("Hủy đăng ký thất bại", error);
      toast.error("Hủy đăng ký hoạt động không thành công");
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
    <div className="min-h-screen bg-gray-50">
      <Header title="Hoạt động" icon={Activity} />

      <div className="px-4 rounded-lg flex flex-col gap-4">
        {/* SEARCH + SORT */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm hoạt động..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
            />

            <button
              onClick={() =>
                setSortType(sortType === "nearest" ? "furthest" : "nearest")
              }
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700
               hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <ArrowUpDown size={18} />
              {sortType === "nearest" ? "Xa nhất" : "Gần nhất"}
            </button>
          </div>

          <div className="flex justify-between gap-3">
            <CustomButton variant="orange" onClick={handleStravaConnect}>
              {connectedStrava ? "Đã nối với STRAVA" : "Kết nối STRAVA"}
            </CustomButton>

            {currentView === "registered" ? (
              <CustomButton
                variant="green"
                onClick={() => setCurrentView("active")}
                className="flex items-center gap-2 px-4 py-2 border whitespace-nowrap cursor-pointer"
              >
                <FastForward size={20} />
                Đang diễn ra
              </CustomButton>
            ) : (
              <CustomButton
                variant="primary"
                onClick={() => setCurrentView("registered")}
                className="flex items-center gap-2 px-4 py-2 border whitespace-nowrap cursor-pointer"
              >
                <History size={20} />
                Đã đăng ký
              </CustomButton>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-10">
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
              <div className="mb-8 pb-1 border-b-2 border-blue-500 w-fit">
                <h1 className="text-xl font-bold">Hoạt đang diễn ra</h1>
                <p className="text-md text-gray-500">
                  Danh sách các hoạt động đang được công ty tổ chức
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                  <CustomCard key={activity.runningActivityId}>
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
                      <h3 className="font-semibold text-lg mb-3">
                        {activity.title}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(activity.startDate)} -{" "}
                            {formatDate(activity.endDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Quãng đường {activity.targetDistance} km</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Tối đa {activity.maxParticipant} người</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Đăng ký:{" "}
                            {formatDate(activity.registrationStartDate)}
                            {" - "}
                            {formatDate(activity.registrationEndDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <CustomButton
                          variant="link"
                          onClick={() => openDetails(activity)}
                          className="w-fit cursor-pointer px-0"
                        >
                          Xem chi tiết
                        </CustomButton>

                        {activity.isRegistered && (
                          <CustomButton
                            variant="primary"
                            disabled={isFull(activity)}
                            onClick={() => handleRegister(activity)}
                            className="w-full cursor-pointer"
                          >
                            {isFull(activity)
                              ? "Đã đủ số lượng"
                              : "Đăng ký tham gia"}
                          </CustomButton>
                        )}
                      </div>
                    </div>
                  </CustomCard>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* POPUP DETAIL */}
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
      />
    </div>
  );
}
