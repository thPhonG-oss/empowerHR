import { useEffect, useState } from "react";

import pointApi from "../../api/pointApi";

import{
  PencilIcon,
} from 'lucide-react';

export default function MonthlyPointPage() {
  const [positionData,setPositionData] = useState([]);

  const [departmentData,setDepartmentData] = useState([]);
  // call api get department budget data
  useEffect(() => {
    const fetchDepartmentBudgets = async () => {
      try { 
        const response = await pointApi.getPointDerpartment();
        console.log("Department Budgets:", response.data);
        const budgets = response.data.map((dept) => ({
          id: dept.departmentId,
          name: dept.departmentName,
          point: dept.budget,
        }));

        setDepartmentData(budgets);
      } catch (error) {
        console.error("Failed to fetch department budgets:", error);
      } 
    };

    fetchDepartmentBudgets();
  }, []);



  return (
    <div className="space-y-8  max-w-6xl">
      <Section
        title="Thiết lập phân bổ điểm hàng tháng theo chức vụ"
        actionLabel="Thêm vị trí">
        <Table
          headers={["Vị trí", "Điểm thưởng / tháng","Thay đổi"]}
          data={positionData}
          renderRow={(item) => (
            <>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.point}</td>
            </>
          )}
        />
      </Section>

      <Section
        title="Thiết lập ngân sách điểm thưởng theo phòng ban"
        actionLabel="Thêm phòng ban">

        <Table
          headers={["Phòng ban", "Ngân sách / tháng","Thay đổi"]}
          data={departmentData}
          renderRow={(item) => (
            <>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.point}</td>
            </>
          )}
        />
      </Section>
    </div>
  );
}



function Section({ title, actionLabel, children }) {
  return (
    <div className="bg-white border border-gray-300  rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Table({ headers, data, renderRow }) {
  return (
    <table className="w-full border-gray-200 text-sm">
      <thead>
        <tr className="bg-gray-50 text-left">
          {headers.map((h) => (
            <th key={h} className="px-4 py-2 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
            {renderRow(item)}
            <td className="px-4 py-2 flex gap-2">
              <button className="text-blue-600 hover:underline">
                <PencilIcon className="w-4 h-4 ml-6" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
