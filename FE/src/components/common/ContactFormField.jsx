function ContactFormField({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  onlyNumber = false,
}) {
  const handleInput = (e) => {
    let v = e.target.value;

    if (onlyNumber) {
      v = v.replace(/\D+/g, ""); // chỉ giữ số
    }

    onChange(v);
  };
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
        <input
          type={type}
          value={value || ""}
          onChange={handleInput}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
        />
      </div>
    </div>
  );
}

export default ContactFormField;
