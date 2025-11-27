import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GoBackLink({ destination }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(destination || -1);
      }}
      className="flex gap-1 items-center w-fit font-bold cursor-pointer hover:text-gray-600 mb-4"
    >
      <MoveLeft size={20} />
      <span>Quay lại</span>
    </div>
  );
}

export default GoBackLink;
