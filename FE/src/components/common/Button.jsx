export default function CustomButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ";

  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed focus:ring-gray-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
    danger:
      "bg-white text-red-500 border border-red-500 hover:bg-red-50 focus:ring-red-300",
    orange:
      "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400",
    green: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
    link: "text-blue-600 hover:text-blue-700 hover:underline p-0",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
