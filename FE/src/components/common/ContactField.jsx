function ContactField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-base font-semibold text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
export default ContactField;
