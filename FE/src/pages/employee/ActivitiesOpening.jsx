import { useState, useEffect, use } from "react"
import { Calendar, MapPin, Users, Clock, Award, Target } from "lucide-react"
import stravaApi from "../../api/stravaApi"
import runningActivityApi from "../../api/runningActivityApi"
import employeeApi from "../../api/employeeApi"
import CustomButton from "../../components/common/Button"
import CustomDialog from "../../components/common/CustomDialog"

const CustomCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  )
}
//sua
export default function ActivitiesOpening() {
  const [loading, setLoading] = useState(false)
  const [employeeID, setEmployeeID] = useState(null)
  const [redirect_uri, setRedirect_uri] = useState("")
  const [error, setError] = useState(null)
  const [connectedStrava, setConnectedStrava] = useState(false)
  const [currentView, setCurrentView] = useState("active") // "active", "registered"
  const [activities, setActivities] = useState([])
  const [registeredActivities, setRegisteredActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activityResults, setActivityResults] = useState(null)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState(null)


  //Lay ID nhan vien
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await employeeApi.getMyProfile();
        setEmployeeID(profileRes.result.employeeId);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error);
      }
    };

    fetchProfile();
  }, []);

  // Kiem tra ket noi Strava
  useEffect(() => {
    if (!employeeID) return;
    const checkStravaConnection = async () => {
      try {
        
        // Check Strava connection status
        const connectionRes = await stravaApi.getStatusconnetion(employeeID);
        setConnectedStrava(connectionRes.result.connectionStatus);
      } catch (error) {
        console.error("Error checking Strava connection:", error);
        setError(error);
      }
    };

    checkStravaConnection();
  }, [employeeID]);


  // Fetch active activities and registered activities
  useEffect(() => {
    if (!employeeID) return;
    const fetchActivities = async () => {
      setLoading(true)
      try {
      // Lay danh sach hoat dong mo
      const response = await runningActivityApi.employeeGetAllOpeningActivity();
      const fitlterActivities= response.result.filter((activity) => activity.status === "Active");
      setActivities(fitlterActivities || [])

      // Lay danh sach hoat dong da dang ky
      const registeredResponse = await runningActivityApi.employeeGetAllRegisteredActivity(employeeID);
      const registered = registeredResponse.result || [];

      // For each registered activity, check if there is a result for this employee
      const registeredWithResults = await Promise.all(
        registered.map(async (act) => {
          try {
            const res = await runningActivityApi.employeeGetResultActivities(employeeID, act.runningActivityId);
            const r = res && res.result;
            const hasResult = !!(r && (r.participateInId || r.totalRun || r.isCompleted));
            return { ...act, hasResult };
          } catch (e) {
            return { ...act, hasResult: false };
          }
        }),
      );

      setRegisteredActivities(registeredWithResults);

      // Merge registration/result flags into activities list
      setActivities((prev) =>
        (prev || []).map((a) => {
          const match = registeredWithResults.find((r) => r.runningActivityId === a.runningActivityId);
          return match ? { ...a, isRegistered: 1, hasResult: match.hasResult } : a;
        }),
      );
      } catch (error) {
      console.error("Error fetching activities:", error);
      setError(error);
      }finally {
      setLoading(false)
      }
    }
    fetchActivities()
  }, [employeeID]);

  
  
  // Cập nhật trạng thái đã đăng ký cho từng hoạt động
  useEffect(() => {
    if (!activities.length || !registeredActivities.length) return;
    const registeredIds = registeredActivities.map(item => item.runningActivityId);
    const updatedActivities = activities.map(activity => {
      const isRegistered = registeredIds.includes(activity.runningActivityId) ? 1 : 0;
      return {
        ...activity,
        isRegistered: isRegistered
      };
    });
    setActivities(updatedActivities);
    
  }, [registeredActivities]); 

  console.log("Strava Connected:", connectedStrava);
  console.log("Registered Activities:", registeredActivities);
  console.log("All Activities:", activities);
  
  const handleRegister = (activityId) => {
    // TODO: Call API to register
    runningActivityApi.employeeRegisterActivity(activityId);
    setActivities((prev) =>
      prev.map((a) =>
        a.runningActivityId === activityId ? { ...a, isRegistered: true, curParticipant: a.curParticipant + 1 } : a,
      ),
    )
  }

  const handleUnregister = (activityId) => {
    // TODO: Call API to unregister
    runningActivityApi.employeeUnregisterActivity(activityId);

    setActivities((prev) =>
      prev.map((a) =>
        a.runningActivityId === activityId
          ? { ...a, isRegistered: false, curParticipant: Math.max(0, a.curParticipant - 1) }
          : a,
      ),
    )
  }

  const openDetails = (activity) => {
    setSelectedActivity(activity)
    setIsDialogOpen(true)

    // Reset previous results
    setActivityResults(null)
    setResultsError(null)

    // Load results for this activity (if employeeID available)
    const loadResults = async () => {
      if (!employeeID) return
      setResultsLoading(true)
      try {
        const res = await fetchActivityResults(employeeID, activity.runningActivityId)
        setActivityResults(res)
      } catch (err) {
        setResultsError(err)
      } finally {
        setResultsLoading(false)
      }
    }

    loadResults()
  }

  const isFull = (activity) => {
    return activity.numberRegistered >= activity.maxParticipant
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const renderContent = () => {
    if (currentView === "registered") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {registeredActivities.map((activity) => (
          <CustomCard key={activity.runningActivityId}>
            <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={activity.image || "/placeholder.svg?height=200&width=400&query=running event"}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">{activity.title}</h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Quãng đường {activity.targetDistance} km</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Tham gia tối đa {activity.maxParticipant} người
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Đăng kí: {formatDate(activity.registrationStartDate)} - {formatDate(activity.registrationEndDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <CustomButton variant="link" className="w-full text-center" onClick={() => openDetails(activity)}>
                  Xem chi tiết
                </CustomButton>

                {activity.status === "Completed" ? (
                  <CustomButton variant="secondary" className="w-full" disabled>
                    Đã tham gia
                  </CustomButton>
                ) : (
                  <CustomButton variant="danger" className="w-full" onClick={() => handleUnregister(activity.runningActivityId)}>
                    Hủy đăng ký
                  </CustomButton>
                )}

                
              </div>
            </div>
          </CustomCard>
        ))}
      </div>
      )
    }

    // Active view - show activities
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity) => (
          <CustomCard key={activity.runningActivityId}>
            <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={activity.image || "/placeholder.svg?height=200&width=400&query=running event"}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">{activity.title}</h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Quãng đường {activity.targetDistance} km</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {activity.numberRegistered}/{activity.maxParticipant} người đã tham gia
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Đăng kí: {formatDate(activity.registrationStartDate)} - {formatDate(activity.registrationEndDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <CustomButton variant="link" className="w-full text-center" onClick={() => openDetails(activity)}>
                  Xem chi tiết
                </CustomButton>

                {activity.isRegistered ? (
                  activity.status === "Completed" ? (
                    <CustomButton variant="secondary" className="w-full" disabled>
                      Đã tham gia
                    </CustomButton>
                  ) : (
                    <CustomButton
                      variant="danger"
                      className="w-full"
                      onClick={() => handleUnregister(activity.runningActivityId)}
                    >
                      Hủy đăng ký
                    </CustomButton>
                  )
                ) : (
                  <CustomButton
                    variant="primary"
                    className="w-full"
                    disabled={isFull(activity)}
                    onClick={() => handleRegister(activity.runningActivityId)}
                  >
                    {isFull(activity) ? "Đã đủ số lượng" : "Đăng ký tham gia"}
                  </CustomButton>
                )}
              </div>
            </div>
            
          </CustomCard>
        ))}
      </div>
    )
  }

  const handleStravaConnect = async () => {
    // TODO: Implement Strava OAuth connection
    if(connectedStrava) {
      alert("Bạn đã kết nối Strava rồi");
      return;
    }
    try{
      await stravaApi.RedirectURL().then((response) => {
        setRedirect_uri(response.redirectUrl);
        console.log(redirect_uri);
        
      });
    }catch(error){
      console.error("Error getting Strava redirect URL:", error);
      setError(error);

    }
    window.open(
      redirect_uri
    )
  }
  
  // hàm lấy kết quả hoạt động
  const fetchActivityResults = async (employeeId, activityId) => {
    try {
      const resultsRes = await runningActivityApi.employeeGetResultActivities(employeeId, activityId);
      return resultsRes.result;
    } catch (error) {
      console.error("Error fetching activity results:", error);
      setError(error);
      return null;
    }
  }
  
  const formatKey = (key) => {
    // Convert camelCase or snake_case to readable label
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/^./, (str) => str.toUpperCase())
  }

  const formatValue = (val) => {
    if (val === null || val === undefined) return '-'
    if (typeof val === 'number') return val.toLocaleString('vi-VN')
    if (typeof val === 'string') return val
    if (typeof val === 'object') return JSON.stringify(val)
    return String(val)
  }
 //a


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hoạt động công ty</h1>
          </div>

          <p className="text-gray-600 mb-6">Cần kết nối strava để có thể đăng ký và theo dõi hoạt động</p>

          <div className="flex gap-3">
            <CustomButton variant="orange" onClick={handleStravaConnect}>
              {connectedStrava ? "Đã nối với STRAVA" : "Kết nối STRAVA"}
            </CustomButton>
            <CustomButton
              variant={currentView === "active" ? "green" : "secondary"}
              onClick={() => setCurrentView("active")}
            >
              Đang diễn ra
            </CustomButton>
           
            <CustomButton
              variant={currentView === "registered" ? "primary" : "secondary"}
              onClick={() => setCurrentView("registered")}
            >
              Đã đăng ký
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</div>

      <CustomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        {/* Lấy kết quả hiển thị chi tiết hoạt động */}
        {selectedActivity && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">{selectedActivity.title}</h2>
            <p className="text-gray-600 mb-6">{selectedActivity.description}</p>

            {selectedActivity.image && (
              <img
                src={selectedActivity.image || "/placeholder.svg"}
                alt={selectedActivity.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

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
                  {formatDate(selectedActivity.startDate)} - {formatDate(selectedActivity.endDate)}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                  <Users className="w-4 h-4" />
                  Số lượng
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedActivity.numberRegistered !== undefined ? (
                  // Trường hợp có numberRegistered (Danh sách tất cả hoạt động)
                  `${selectedActivity.numberRegistered}/${selectedActivity.maxParticipant} người`
                  ) : (
                  // Trường hợp không có numberRegistered (Danh sách đã đăng ký)
                  `${selectedActivity.maxParticipant} người`
                )}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                  <Target className="w-4 h-4" />
                  Quãng đường mục tiêu
                </h4>
                <p className="text-sm text-gray-600">{selectedActivity.targetDistance} km</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <Award className="w-4 h-4" />
                Phần thưởng
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="font-medium text-gray-900">🥇 Giải nhất</div>
                  <div className="text-yellow-700 font-semibold">
                    {selectedActivity.top1Bonus.toLocaleString("vi-VN")} điểm
                  </div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                  <div className="font-medium text-gray-900">🥈 Giải nhì</div>
                  <div className="text-gray-700 font-semibold">
                    {selectedActivity.top2Bonus.toLocaleString("vi-VN")} điểm
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="font-medium text-gray-900">🥉 Giải ba</div>
                  <div className="text-orange-700 font-semibold">
                    {selectedActivity.top3Bonus.toLocaleString("vi-VN")} điểm
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900">✅ Hoàn thành</div>
                  <div className="text-green-700 font-semibold">
                    {selectedActivity.completionBonus.toLocaleString("vi-VN")} điểm
                  </div>
                </div>
              </div>
            </div>

            {selectedActivity.rules && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-900">Thể lệ</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedActivity.rules}</p>
              </div>
            )}

            {/* Kết quả hoạt động */}
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
                  {/* Only show required fields */}
                  {(() => {
                    const r = activityResults;
                    const get = (obj, names) => {
                      for (const n of names) {
                        if (obj[n] !== undefined) return obj[n];
                      }
                      return null;
                    };

                    const fields = [
                      { names: ['totalRun', 'TotalRun', 'Total Run', 'total_run'], label: 'Đã chạy' },
                      { names: ['isCompleted', 'IsCompleted', 'Is Completed', 'is_completed'], label: 'Hoàn thành' },
                      { names: ['completedDate', 'CompletedDate', 'Completed Date', 'completed_date'], label: 'Ngày hoàn thành' },
                      { names: ['rankPosition', 'RankPosition', 'Rank Position', 'rank_position'], label: 'Xếp hạng' },
                      { names: ['rewardPoints', 'RewardPoints', 'Reward Points', 'reward_points'], label: 'Điểm thưởng' },
                    ];

                    return fields.map((f) => {
                      const value = get(r, f.names);
                      return (
                        <div className="flex justify-between py-1 border-b last:border-b-0" key={f.label}>
                          <div className="text-gray-600">{f.label}</div>
                          <div className="font-medium">{formatValue(value)}</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Chưa có kết quả cho hoạt động này.</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              {selectedActivity.isRegistered ? (
                selectedActivity.status === "Completed" ? (
                  <CustomButton variant="secondary" className="flex-1" disabled>
                    Đã tham gia
                  </CustomButton>
                ) : (
                  <CustomButton
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      handleUnregister(selectedActivity.runningActivityId)
                      setIsDialogOpen(false)
                    }}
                  >
                    Hủy đăng ký
                  </CustomButton>
                )
              ) : (
                <CustomButton
                  variant="primary"
                  className="flex-1"
                  disabled={isFull(selectedActivity)}
                  onClick={() => {
                    handleRegister(selectedActivity.runningActivityId)
                    setIsDialogOpen(false)
                  }}
                >
                  {isFull(selectedActivity) ? "Đã đủ số lượng" : "Đăng ký tham gia"}
                </CustomButton>
              )}
            </div>
          </div>

        )}
      </CustomDialog>
    </div>
  )
}
