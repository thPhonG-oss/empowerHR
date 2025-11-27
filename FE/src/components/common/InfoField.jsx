function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}
export default InfoField;
