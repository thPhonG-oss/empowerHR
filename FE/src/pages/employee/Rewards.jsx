import Header from "../../components/common/Header";
import { Gem } from "lucide-react";
import TransactionsCard from "../../components/employee/TransactionsCard";

function Rewards() {
  return (
    <>
      <Header icon={Gem} title="Điểm thưởng của tôi" />

      <div className="px-4 py-6 flex flex-col gap-4 bg-gray-50 min-h-screen">
        <TransactionsCard />

        {/* 🔥 Sau này bạn thêm card khác ở đây */}
        {/* <TotalPointsCard /> */}
        {/* <RewardsSummaryCard /> */}
      </div>
    </>
  );
}

export default Rewards;
