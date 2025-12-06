import { useEffect } from "react"

export function Toast({ message, type = "success", isVisible, onClose, duration = 4000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div
        className={`px-5 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] ${
          type === "success"
            ? "bg-green-500 text-white border-2 border-green-600"
            : "bg-red-500 text-white border-2 border-red-600"
        }`}
      >
        {type === "success" ? (
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="font-semibold text-base">{message}</span>
      </div>
    </div>
  )
}

