// import { useEffect, useState } from "react";
// import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
// import monthlyRewardApi from "../../api/monthlyRewardApi";
// import pointApi from "../../api/pointApi";

// export default function MonthlyPointPage() {
//   const [positionData, setPositionData] = useState([]);
//   const [departmentData, setDepartmentData] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [value, setValue] = useState("");

//   useEffect(() => {
//     fetchDepartments();
//     fetchPositions();
//   }, []);

//   const fetchDepartments = async () => {
//     const res = await pointApi.getPointDerpartment();
//     setDepartmentData(
//       res.data.map((d) => ({
//         id: d.departmentId,
//         budgetId: d.departmentBudgetId,
//         name: d.departmentName,
//         point: d.budget,
//       }))
//     );
//   };

//   const fetchPositions = async () => {
//     const res = await pointApi.getPointPosition();
//     setPositionData(
//       res.result.map((p) => ({
//         id: p.monthlyRewardId,
//         positionId: p.position.positionId,
//         name: p.position.positionName,
//         point: p.monthlyPoints,
//       }))
//     );
//   };

//   const startEdit = (type, item) => {
//     setEditing({ type, id: item.id });
//     setValue(item.point);
//   };

//   const cancelEdit = () => {
//     setEditing(null);
//     setValue("");
//   };

//   const saveEdit = async () => {
//     if (editing.type === "position") {
//       console.log("Edit_id",editing.id);
//       console.log("point",value);
      
//       await monthlyRewardApi.updateMonthlyReward(editing.id, { monthlyPoints: value });
//       setPositionData((prev) =>
//         prev.map((p) =>
//           p.id === editing.id ? { ...p, point: value } : p
//         )
//       );
//     }

//     if (editing.type === "department") {
//       await monthlyRewardApi.updateDepartmentPoint(editing.id, { pointBalance: value });
//       setDepartmentData((prev) =>
//         prev.map((d) =>
//           d.id === editing.id ? { ...d, point: value } : d
//         )
//       );
//     }

//     cancelEdit();
//   };

//   const renderPointCell = (item, type) => {
//     const isEdit = editing?.id === item.id && editing?.type === type;

//     return isEdit ? (
//       <input
//         type="number"
//         className="border rounded px-2 py-1 w-32"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//       />
//     ) : (
//       item.point
//     );
//   };

//   const renderActions = (item, type) => {
//     const isEdit = editing?.id === item.id && editing?.type === type;

//     return isEdit ? (
//       <div className="flex gap-2">
//         <button onClick={saveEdit}>
//           <CheckIcon className="w-4 h-4 text-green-600" />
//         </button>
//         <button onClick={cancelEdit}>
//           <XIcon className="w-4 h-4 text-red-600" />
//         </button>
//       </div>
//     ) : (
//       <button onClick={() => startEdit(type, item)}>
//         <PencilIcon className="w-4 h-4 text-blue-600" />
//       </button>
//     );
//   };

//   return (
//     <div className="space-y-8 max-w-6xl">
//       <Section title="Thiết lập điểm thưởng theo chức vụ">
//         <Table
//           headers={["Vị trí", "Điểm / tháng", ""]}
//           data={positionData}
//           renderRow={(item) => (
//             <>
//               <td className="px-4 py-2">{item.name}</td>
//               <td className="px-4 py-2">
//                 {renderPointCell(item, "position")}
//               </td>
//               <td className="px-4 py-2">
//                 {renderActions(item, "position")}
//               </td>
//             </>
//           )}
//         />
//       </Section>

//       <Section title="Ngân sách điểm theo phòng ban">
//         <Table
//           headers={["Phòng ban", "Ngân sách", ""]}
//           data={departmentData}
//           renderRow={(item) => (
//             <>
//               <td className="px-4 py-2">{item.name}</td>
//               <td className="px-4 py-2">
//                 {renderPointCell(item, "department")}
//               </td>
//               <td className="px-4 py-2">
//                 {renderActions(item, "department")}
//               </td>
//             </>
//           )}
//         />
//       </Section>
//     </div>
//   );
// }

// /* ---------- UI ---------- */

// function Section({ title, children }) {
//   return (
//     <div className="bg-white border rounded-lg p-6">
//       <h2 className="font-semibold text-sm mb-4">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Table({ headers, data, renderRow }) {
//   return (
//     <table className="w-full text-sm">
//       <thead>
//         <tr className="bg-gray-50">
//           {headers.map((h) => (
//             <th key={h} className="px-4 py-2 text-left">
//               {h}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item) => (
//           <tr key={item.id} className="border-b hover:bg-gray-50">
//             {renderRow(item)}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
import { useEffect, useState } from "react";
import { Pencil, Check, X, TrendingUp, Users, Award } from "lucide-react";
import monthlyRewardApi from "../../api/monthlyRewardApi";
import pointApi from "../../api/pointApi";

export default function MonthlyPointPage() {
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchDepartments = async () => {
    const res = await pointApi.getPointDerpartment();
    setDepartmentData(
      res.data.map((d) => ({
        id: d.departmentId,
        budgetId: d.departmentBudgetId,
        name: d.departmentName,
        point: d.budget,
      }))
    );
  };

  const fetchPositions = async () => {
    const res = await pointApi.getPointPosition();
    setPositionData(
      res.result.map((p) => ({
        id: p.monthlyRewardId,
        positionId: p.position.positionId,
        name: p.position.positionName,
        point: p.monthlyPoints,
      }))
    );
  };

  const startEdit = (type, item) => {
    setEditing({ type, id: item.id });
    setValue(item.point);
  };

  const cancelEdit = () => {
    setEditing(null);
    setValue("");
  };

  const saveEdit = async () => {
    if (editing.type === "position") {
      console.log("Edit_id", editing.id);
      console.log("point", value);

      await monthlyRewardApi.updateMonthlyReward(editing.id, { monthlyPoints: value });
      setPositionData((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, point: value } : p
        )
      );
    }

    if (editing.type === "department") {
      await monthlyRewardApi.updateDepartmentPoint(editing.id, { pointBalance: value });
      setDepartmentData((prev) =>
        prev.map((d) =>
          d.id === editing.id ? { ...d, point: value } : d
        )
      );
    }

    cancelEdit();
  };

  const renderPointCell = (item, type) => {
    const isEdit = editing?.id === item.id && editing?.type === type;

    return isEdit ? (
      <input
        type="number"
        className="border-2 border-blue-500 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
    ) : (
      <span className="font-semibold text-gray-900">{item.point.toLocaleString()}</span>
    );
  };

  const renderActions = (item, type) => {
    const isEdit = editing?.id === item.id && editing?.type === type;

    return isEdit ? (
      <div className="flex gap-2">
        <button
          onClick={saveEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Check className="w-4 h-4 text-green-600" />
        </button>
        <button
          onClick={cancelEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    ) : (
      <button
        onClick={() => startEdit(type, item)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Pencil className="w-4 h-4 text-blue-600" />
      </button>
    );
  };

  const totalPositionPoints = positionData.reduce((sum, p) => sum + Number(p.point), 0);
  const totalDepartmentBudget = departmentData.reduce((sum, d) => sum + Number(d.point), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý điểm thưởng
            </h1>
          </div>
          <p className="text-gray-600 ml-14">Thiết lập và quản lý điểm thưởng theo chức vụ và phòng ban</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Tổng điểm chức vụ</p>
                <p className="text-3xl font-bold text-gray-900">{totalPositionPoints.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-2">{positionData.length} chức vụ</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Tổng ngân sách phòng ban</p>
                <p className="text-3xl font-bold text-gray-900">{totalDepartmentBudget.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-2">{departmentData.length} phòng ban</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Position Points Section */}
        <Section
          title="Thiết lập điểm thưởng theo chức vụ"
          subtitle="Cấu hình số điểm thưởng hàng tháng cho từng vị trí"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        >
          <Table
            headers={["Vị trí", "Điểm / tháng", "Thao tác"]}
            data={positionData}
            renderRow={(item) => (
              <>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-700 font-semibold text-sm">
                        {item.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {renderPointCell(item, "position")}
                </td>
                <td className="px-6 py-4">
                  {renderActions(item, "position")}
                </td>
              </>
            )}
          />
        </Section>

        {/* Department Budget Section */}
        <Section
          title="Ngân sách điểm theo phòng ban"
          subtitle="Quản lý ngân sách điểm cho từng phòng ban"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        >
          <Table
            headers={["Phòng ban", "Ngân sách", "Thao tác"]}
            data={departmentData}
            renderRow={(item) => (
              <>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-700 font-semibold text-sm">
                        {item.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {renderPointCell(item, "department")}
                </td>
                <td className="px-6 py-4">
                  {renderActions(item, "department")}
                </td>
              </>
            )}
          />
        </Section>
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function Section({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-50 rounded-lg">
            {icon}
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function Table({ headers, data, renderRow }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}