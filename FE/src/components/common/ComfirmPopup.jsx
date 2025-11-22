function ConfirmPopup({ isOpen, onClose, message, onConfirm }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600/10 backdrop-blur-xs z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-60 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Xác nhận thao tác
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
            >
              Hủy
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmPopup;
