function Input({ suffix, ...props }) {
  return (
    <div className="flex items-center border border-gray-300 rounded px-3 hover:border-gray-400 focus-within:border-black-500 transition">
      <input
        type="number"
        className="w-full py-2 outline-none disabled:bg-transparent"
        {...props}
      />
      {suffix && (
        <span className="text-gray-400 text-sm ml-2">
          {suffix}
        </span>
      )}
    </div>
  );
}

export default Input;