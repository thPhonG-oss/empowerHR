import Header from "../../components/common/Header";
import { Gem } from "lucide-react";
import TransactionsCard from "../../components/employee/TransactionsCard";
import PointCard from "../../components/employee/PointCard";
import { useState } from "react";

function Rewards() {
  const [redeemKey, setRedeemKey] = useState(0);

  const handleRedeemSuccess = () => {
    setRedeemKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen">
      <Header icon={Gem} title="Điểm thưởng của tôi" />

      <div className=" px-6 py-6 flex flex-col gap-4 bg-gray-50 min-h-screen">
        <PointCard onRedeemSuccess={handleRedeemSuccess} />

        <TransactionsCard redeemKey={redeemKey} />

        {/* 🔥 Sau này bạn thêm card khác ở đây */}
      </div>
    </main>
  );
}

export default Rewards;
