const InputField = ({ label, name, value, onChange, type = "text" }) => {
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClasses}
      />
    </div>
  );
};

export default InputField;
