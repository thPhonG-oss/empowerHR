export default function CustomDialog ({ isOpen, onClose, children }){
  if (!isOpen) return null; 
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
    );
}