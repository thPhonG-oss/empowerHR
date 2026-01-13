import { Users, UserRoundX, ClipboardList, Home, Clock } from "lucide-react";

import Header from "../../components/common/Header";

function Dashboard() {
  return (
    <main className="p-0">
      <div className="mx-auto">
        {/* Header */}
        <Header title="Tổng quan" icon={Home} />

        {/* Content */}
        <div className="p-6"></div>
      </div>
    </main>
  );
}

export default Dashboard;
