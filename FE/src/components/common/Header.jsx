function Header({ title, icon: Icon }) {
  return (
    <div className="sticky top-0 z-50 bg-white/80  shadow-sm h-20 px-6 flex items-center gap-3 border-b border-gray-200">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
        {title}
      </h1>
    </div>
  );
}

export default Header;
