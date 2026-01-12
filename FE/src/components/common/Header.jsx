function Header({ title, icon: Icon }) {
  return (
    <div className="sticky top-0 z-50 bg-white shadow h-20 p-6 flex items-center gap-2 text-2xl font-bold  border-b border-gray-300">
      {Icon && <Icon className="w-6 h-6" />}
      {title}
    </div>
  );
}

export default Header;
