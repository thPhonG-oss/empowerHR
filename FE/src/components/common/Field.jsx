function Field({ label, note, error, children }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {note && <p className="text-xs text-blue-500 mb-1">{note}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
export default Field;