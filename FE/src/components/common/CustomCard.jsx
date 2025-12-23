export default function CustomCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
