import { useState } from "react"
import { Toast } from "../../components/common/Toast"

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN")
}
//


function formatTimeOnly(timeString) {
  if (!timeString) return ""
  // Format "09:00:00" to "9h00"
  const [hours, minutes] = timeString.split(":")
  return `${parseInt(hours)}h${minutes}`
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}

function isImageFile(fileName) {
  if (!fileName) return false
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]
  const lowerFileName = fileName.toLowerCase()
  return imageExtensions.some((ext) => lowerFileName.endsWith(ext))
}



export function RequestDetailPopup({ request, onClose, onApprove, onReject }) {
  const [note, setNote] = useState("")
  const [showConfirm, setShowConfirm] = useState(null)
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success") // "success" | "error"

  const isProcessed = request.status !== "Pending"
  const isLeave = request.requestType === "LEAVE"
  const isTimesheet = request.requestType === "TIMESHEET_UPDATE"
  const days = isLeave && request.startDate && request.endDate ? calculateDays(request.startDate, request.endDate) : 0

  const handleApproveClick = () => {
    setShowConfirm("approve")
    setError("")
  }

  const handleRejectClick = () => {
    if (!note.trim()) {
      setError("Vui lòng nhập lý do từ chối")
      return
    }
    setShowConfirm("reject")
    setError("")
  }

  const confirmAction = () => {
    if (showConfirm === "approve") {
      onApprove(request.requestId, note)
      setToastMessage("Phê duyệt yêu cầu thành công!")
      setToastType("success")
      setShowToast(true)
      setShowConfirm(null)
      // Close popup after 2 seconds to let user see the toast
      setTimeout(() => {
        onClose()
      }, 2000)
    } else if (showConfirm === "reject") {
      onReject(request.requestId, note)
      setToastMessage("Từ chối yêu cầu thành công!")
      setToastType("success")
      setShowToast(true)
      setShowConfirm(null)
      // Close popup after 2 seconds to let user see the toast
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }

  return (
    <>
     
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={4000}
      />

      {/* Main Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Popup Content */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isLeave ? "Xin nghỉ phép" : isTimesheet ? "Cập nhật chấm công" : "Yêu cầu"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Người yêu cầu:</span>
                <span className="text-gray-900 font-semibold">{request.employeeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Bộ phận:</span>
                <span className="text-gray-900">Developer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Ngày yêu cầu:</span>
                <span className="text-gray-900">{formatDate(request.submitAt)}</span>
              </div>
              <div></div>

              {/* Leave Request Fields */}
              {isLeave && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Bắt đầu:</span>
                    <span className="text-gray-900">
                      {request.startDate ? `${formatTimeOnly("08:00:00")} - ${formatDate(request.startDate)}` : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Đến ngày:</span>
                    <span className="text-gray-900">
                      {request.endDate ? `${formatTimeOnly("17:00:00")} - ${formatDate(request.endDate)}` : "N/A"}
                    </span>
                  </div>
                </>
              )}

              {/* Timesheet Update Fields */}
              {isTimesheet && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Checkin Time:</span>
                    <span className="text-gray-900">
                      {request.attendanceDate && request.checkinTime
                        ? `${formatTimeOnly(request.checkinTime)} - ${formatDate(request.attendanceDate)}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Checkout Time:</span>
                    <span className="text-gray-900">
                      {request.attendanceDate && request.checkoutTime
                        ? `${formatTimeOnly(request.checkoutTime)} - ${formatDate(request.attendanceDate)}`
                        : "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Total Leave Days - Only for Leave Request */}
            {isLeave && days > 0 && (
              <div className="mt-3 text-sm">
                <span className="text-gray-500">Tổng ngày nghỉ:</span>
                <span className="ml-2 text-gray-900 font-medium">{days} ngày</span>
              </div>
            )}

            {/* Reason Box */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Lý do:</p>
              <p className="text-sm text-gray-700">{request.reason}</p>
            </div>

            {/* Proof Document - Only for Leave Request */}
            {request.proofDocument && isLeave && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">File đính kèm</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2">
                  <img 
                    src={request.proofDocument}
                    alt="Minh chứng"
                    className="w-[400px] h-[300px] object-contain rounded mx-auto"
                    onError={(e) => {
                      // Fallback nếu ảnh không load được
                      e.target.style.display = "none"
                      const errorDiv = e.target.nextElementSibling
                      if (errorDiv) {
                        errorDiv.style.display = "block"
                      }
                    }}
                  />
                  <div className="hidden p-4 text-center text-gray-500 text-sm bg-gray-100 rounded">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Không thể tải hình ảnh
                  </div>
                </div>
              </div>
            )}

            {/* Status Badge for Processed Requests */}
            {isProcessed && (
              <div className="mt-4 p-4 rounded-md border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {request.status === "Approved" ? "Đã phê duyệt" : "Đã từ chối"}
                  </span>
                  {request.handleAt && (
                    <span className="text-sm text-gray-500">vào {formatDate(request.handleAt)}</span>
                  )}
                </div>
                {request.responseReason && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Ghi chú của quản lý:</p>
                    <p className="text-sm text-gray-700">{request.responseReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Manager Note - Only for Pending */}
            {!isProcessed && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Ghi chú của quản lý</p>
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value)
                    setError("")
                  }}
                  placeholder="Ghi chú lý do từ chối hoặc phê duyệt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>
            )}
          </div>

          {/* Footer - Only for Pending */}
          {!isProcessed && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleRejectClick}
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition-colors"
              >
                Từ chối
              </button>
              <button
                onClick={handleApproveClick}
                className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md cursor-pointer transition-colors"
              >
                Phê duyệt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowConfirm(null)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  showConfirm === "approve" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {showConfirm === "approve" ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xác nhận {showConfirm === "approve" ? "phê duyệt" : "từ chối"}
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn {showConfirm === "approve" ? "phê duyệt" : "từ chối"} yêu cầu của{" "}
              <span className="font-medium">{request.employeeName}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer transition-colors ${
                  showConfirm === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
