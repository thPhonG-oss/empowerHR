import Header from "../../components/common/Header";
import { Gem } from "lucide-react";
import TransactionsCard from "../../components/employee/TransactionsCard";
import PointCard from "../../components/employee/PointCard";
function Rewards() {
  return (
    <main className="min-h-screen">
      <Header icon={Gem} title="Điểm thưởng của tôi" />

      <div className=" px-6 py-6 flex flex-col gap-4 bg-gray-50 min-h-screen">
        <PointCard />

        <TransactionsCard />

        {/* 🔥 Sau này bạn thêm card khác ở đây */}
      </div>
    </main>
  );
}

export default Rewards;
