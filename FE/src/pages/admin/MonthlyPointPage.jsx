import { useEffect, useState } from "react";
import { Pencil, Check, X, TrendingUp, Users, Award } from "lucide-react";
import monthlyRewardApi from "../../api/monthlyRewardApi";
import pointApi from "../../api/pointApi";
import toast from "react-hot-toast";

export default function MonthlyPointPage() {
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

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
    setError("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setValue("");
    setError("");
  };

  const validateValue = () => {
    // Check empty
    if (!value || value === '' || value.toString().trim() === '') {
      setError("Vui lòng nhập giá trị");
      return false;
    }

    // Check if is number
    if (isNaN(value)) {
      setError("Giá trị phải là số");
      return false;
    }

    // Check positive number
    const numValue = Number(value);
    if (numValue <= 0) {
      setError("Giá trị phải lớn hơn 0");
      return false;
    }

    // Check integer
    if (!Number.isInteger(numValue)) {
      setError("Giá trị phải là số nguyên");
      return false;
    }

    // Check max value (optional - prevent too large numbers)
    if (numValue > 1000000) {
      setError("Giá trị không được vượt quá 1,000,000");
      return false;
    }

    setError("");
    return true;
  };

  const saveEdit = async () => {
    if (!validateValue()) {
      return;
    }

    try {
      const numValue = Number(value);

      if (editing.type === "position") {
        await monthlyRewardApi.updateMonthlyReward(editing.id, { monthlyPoints: numValue });
        setPositionData((prev) =>
          prev.map((p) =>
            p.id === editing.id ? { ...p, point: numValue } : p
          )
        );
        toast.success("Cập nhật điểm chức vụ thành công!");
      }

      if (editing.type === "department") {
        await monthlyRewardApi.updateDepartmentPoint(editing.id, { budget: numValue });
        setDepartmentData((prev) =>
          prev.map((d) =>
            d.id === editing.id ? { ...d, point: numValue } : d
          )
        );
        toast.success("Cập nhật ngân sách phòng ban thành công!");
      }

      cancelEdit();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật!");
      console.error(err);
    }
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    setError("");
  };

  const renderPointCell = (item, type) => {
    const isEdit = editing?.id === item.id && editing?.type === type;

    return isEdit ? (
      <div className="space-y-1">
        <input
          type="number"
          className={`border-2 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 transition-colors ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-blue-500 focus:ring-blue-500'
          }`}
          value={value}
          onChange={handleValueChange}
          autoFocus
          min="1"
          step="1"
        />
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>
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
          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
          title="Lưu"
        >
          <Check className="w-4 h-4 text-green-600 group-hover:text-green-700" />
        </button>
        <button
          onClick={cancelEdit}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          title="Hủy"
        >
          <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
        </button>
      </div>
    ) : (
      <button
        onClick={() => startEdit(type, item)}
        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
        title="Chỉnh sửa"
      >
        <Pencil className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
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

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                i
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">Lưu ý khi cập nhật</p>
              <p className="text-sm text-blue-800">
                Giá trị phải là số nguyên dương và không vượt quá 1,000,000. Thay đổi sẽ được áp dụng ngay lập tức.
              </p>
            </div>
          </div>
        </div>
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