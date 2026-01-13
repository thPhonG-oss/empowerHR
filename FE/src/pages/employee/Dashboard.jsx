import { Home } from "lucide-react";
import Header from "../../components/common/Header";
import AttendanceCard from "../../components/employee/AttendanceCard";

function Dashboard() {
  return (
    <main className="p-0">
      <div className="mx-auto">
        {/* Header */}
        <Header title="Tổng quan" icon={Home} />

        {/* Content */}
        <div className="grid grid-cols-2 p-6 gap-4">
          <AttendanceCard isDashboard={true} className="grid-cols-1" />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
