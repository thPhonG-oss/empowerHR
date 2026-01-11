import { useState } from "react";

import{
  PencilIcon,
  TrashIcon,
} from 'lucide-react';

export default function MonthlyPointPage() {
  const [positionData] = useState([
    { id: 1, name: "Nhân viên", point: 50, amount: 50000 },
    { id: 2, name: "Team Leader", point: 100, amount: 100000 },
    { id: 3, name: "Manager", point: 200, amount: 200000 },
    { id: 4, name: "Senior Manager", point: 500, amount: 500000 },
  ]);

  const [departmentData] = useState([
    { id: 1, name: "Kế toán", point: 2000, amount: 2000000 },
    { id: 2, name: "Nhân sự", point: 1000, amount: 1000000 },
    { id: 3, name: "IT", point: 5000, amount: 5000000 },
    { id: 4, name: "Thiết bị", point: 2500, amount: 2500000 },
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* ===== POSITION ===== */}
      <Section
        title="Thiết lập phân bổ điểm hàng tháng theo chức vụ"
        actionLabel="Thêm vị trí"
      >
        <Table
          headers={["Vị trí", "Điểm thưởng / tháng", "Giá trị", "Thao tác"]}
          data={positionData}
          renderRow={(item) => (
            <>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.point}</td>
              <td className="px-4 py-2">
                {item.amount.toLocaleString()} VNĐ
              </td>
            </>
          )}
        />
      </Section>

      {/* ===== DEPARTMENT ===== */}
      <Section
        title="Thiết lập ngân sách điểm thưởng theo phòng ban"
        actionLabel="Thêm phòng ban"
      >
        <Table
          headers={["Phòng ban", "Ngân sách / tháng", "Giá trị", "Thao tác"]}
          data={departmentData}
          renderRow={(item) => (
            <>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.point}</td>
              <td className="px-4 py-2">
                {item.amount.toLocaleString()} VNĐ
              </td>
            </>
          )}
        />
      </Section>
    </div>
  );
}



function Section({ title, actionLabel, children }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Table({ headers, data, renderRow }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-50 text-left">
          {headers.map((h) => (
            <th key={h} className="px-4 py-2 border-b font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            {renderRow(item)}
            <td className="px-4 py-2 flex gap-2">
              <button className="text-blue-600 hover:underline">
                <PencilIcon className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
