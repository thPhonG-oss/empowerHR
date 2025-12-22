import { useState, useEffect, use } from "react"
import { Calendar, MapPin, Users, Clock, Award, Target } from "lucide-react"
import stravaApi from "../../api/stravaApi"
import runningActivityApi from "../../api/runningActivityApi"
import employeeApi from "../../api/employeeApi"

const CustomButton = ({ children, onClick, disabled = false, variant = "primary", className = "" }) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed focus:ring-gray-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
    danger: "bg-white text-red-500 border border-red-500 hover:bg-red-50 focus:ring-red-300",
    orange: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400",
    green: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
    link: "text-blue-600 hover:text-blue-700 hover:underline p-0",
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

const CustomCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  )
}

const CustomDialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Dialog Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto m-4 animate-[scale-in_0.2s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  )
}

export default function ActivitiesOpening() {
  const [loading, setLoading] = useState(false)
  const [redirect_uri, setRedirect_uri] = useState("")
  const [error, setError] = useState(null)
  const [connectedStrava, setConnectedStrava] = useState(false)
  const [currentView, setCurrentView] = useState("active") // "active", "registered"
  const [activities, setActivities] = useState([])
  const [registeredActivities, setRegisteredActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Kiem tra ket noi Strava
  // useffect(() => {
  //   // Check Strava connection status
  //   //stravaApi.connectedStrava().then((response) => {
  //     // Assuming response contains a field 'connected' indicating connection status
  //     //setConnectedStrava(true)
  //   // }
  //   // ).catch((error) => {
  //   //   console.error("Error checking Strava connection:", error)
  //   //   setError(error)
  //   // })
  //   setConnectedStrava(true);

  // },[])

  // Fetch active activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      try {
      // Lay danh sach hoat dong mo
      const response = await runningActivityApi.employeeGetAllOpeningActivity();
      const fitlterActivities= response.result.filter((activity) => activity.status === "Active");
      setActivities(fitlterActivities || [])
  
      
      // Lay ID nhan vien
      const profileRes = await employeeApi.getMyProfile();
      const employeeID = profileRes.result.employeeId;

      // Lay danh sach hoat dong da dang ky
      const registeredResponse = await runningActivityApi.employeeGetAllRegisteredActivity(employeeID);
      setRegisteredActivities(registeredResponse.result || []);
      } catch (error) {
      console.error("Error fetching activities:", error);
      setError(error);
      }finally {
      setLoading(false)
      }
    }
    fetchActivities()
  }, []);

  
  
  // Cap nhat trang thai da dang ky cho tung hoat dong
  useEffect(() => {
    if (activities.length === 0 || registeredActivities.length === 0) return;
    
    const registeredIds = registeredActivities.map(item => item.activityId);
    
    const updatedActivities = activities.map(activity => ({
      ...activity,
      isRegistered: registeredIds.includes(activity.id)
    }));
    
    setActivities(updatedActivities);
  }, []);
  
  console.log("Registered Activities:", registeredActivities);
  console.log("All Activities:", activities);

  const handleRegister = (activityId) => {
    // TODO: Call API to register
    // fetch(`/api/activities/${activityId}/register`, { method: 'POST' })

    setActivities((prev) =>
      prev.map((a) =>
        a.runningActivityId === activityId ? { ...a, isRegistered: true, curParticipant: a.curParticipant + 1 } : a,
      ),
    )
  }

  const handleUnregister = (activityId) => {
    // TODO: Call API to unregister
    // fetch(`/api/activities/${activityId}/unregister`, { method: 'POST' })

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
  }

  const isFull = (activity) => {
    return activity.numberRegistered >= activity.maxParticipant
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const renderContent = () => {
    if (currentView === "results") {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-700">Trang Kết quả</h2>
          <p className="text-gray-500 mt-2">Chức năng đang được phát triển</p>
        </div>
      )
    }

    if (currentView === "registered") {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-700">Danh sách đã đăng ký</h2>
          <p className="text-gray-500 mt-2">Chức năng đang được phát triển</p>
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
                  <CustomButton
                    variant="danger"
                    className="w-full"
                    onClick={() => handleUnregister(activity.runningActivityId)}
                  >
                    Hủy đăng ký
                  </CustomButton>
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
              Đã nối với STRAVA
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
                  {selectedActivity.curParticipant}/{selectedActivity.maxParticipant} người
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

            <div className="flex gap-3 pt-4 border-t">
              {selectedActivity.isRegistered ? (
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

      {/* <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style> */}
    </div>
  )
}
