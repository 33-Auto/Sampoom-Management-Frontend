
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface BOMItem {
  id: string;
  itemCode: string;
  itemName: string;
  requiredQuantity: number;
  availableStock: number;
  unit: string;
  status: 'sufficient' | 'insufficient' | 'critical';
}

interface ProductionRecord {
  id: string;
  date: string;
  completedQuantity: number;
  defectQuantity: number;
  operator: string;
  notes: string;
}

const WorkOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [completedQty, setCompletedQty] = useState<number>(0);
  const [defectQty, setDefectQty] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // 생산 지시 상세 정보
  const workOrder = {
    id: 'WO001',
    workOrderNumber: 'WO-2024-001',
    itemCode: 'FG-ENG-001',
    itemName: '엔진 어셈블리 A-Type',
    requestedQuantity: 10,
    completedQuantity: 0,
    requestDate: '2024-01-15',
    dueDate: '2024-01-20',
    status: 'pending',
    priority: 'high',
    requestedBy: '재고관리팀'
  };

  // BOM 정보 (자동 전개)
  const [bomItems] = useState<BOMItem[]>([
    {
      id: 'BOM001',
      itemCode: 'RM-AL-001',
      itemName: '알루미늄 합금',
      requiredQuantity: 50,
      availableStock: 30,
      unit: 'KG',
      status: 'insufficient'
    },
    {
      id: 'BOM002',
      itemCode: 'CP-SEN-001',
      itemName: '전자 센서',
      requiredQuantity: 20,
      availableStock: 45,
      unit: 'EA',
      status: 'sufficient'
    },
    {
      id: 'BOM003',
      itemCode: 'RM-BOL-001',
      itemName: 'M5 육각 볼트',
      requiredQuantity: 80,
      availableStock: 150,
      unit: 'EA',
      status: 'sufficient'
    },
    {
      id: 'BOM004',
      itemCode: 'RM-RUB-001',
      itemName: '고무 시일링',
      requiredQuantity: 40,
      availableStock: 5,
      unit: 'EA',
      status: 'critical'
    }
  ]);

  // 생산 실적 기록
  const [productionRecords] = useState<ProductionRecord[]>([
    {
      id: 'PR001',
      date: '2024-01-15 09:00',
      completedQuantity: 0,
      defectQuantity: 0,
      operator: '김생산',
      notes: '생산 시작'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sufficient: { label: '충분', color: 'bg-green-100 text-green-800' },
      insufficient: { label: '부족', color: 'bg-yellow-100 text-yellow-800' },
      critical: { label: '긴급', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleMaterialRequest = () => {
    alert('원자재 불출 요청이 전송되었습니다.');
  };

  const handleProductionSubmit = () => {
    if (completedQty === 0 && defectQty === 0) {
      alert('완료 수량 또는 불량 수량을 입력해주세요.');
      return;
    }
    
    alert(`생산 실적이 등록되었습니다.\n완료: ${completedQty}EA, 불량: ${defectQty}EA`);
    setCompletedQty(0);
    setDefectQty(0);
    setNotes('');
  };

  const insufficientMaterials = bomItems.filter(item => item.status !== 'sufficient');

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">생산 지시 상세</h1>
            <p className="text-gray-600">{workOrder.workOrderNumber} - {workOrder.itemName}</p>
          </div>
          <button
            onClick={() => navigate('/production/orders')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            목록으로
          </button>
        </div>
      </div>

      <NavigationTabs 
        navItems={navItems} 
        moduleColor="bg-red-500"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 지시 정보 및 BOM */}
        <div className="lg:col-span-2 space-y-6">
          {/* 생산 지시 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">생산 지시 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">지시 번호</label>
                <p className="text-sm text-gray-900">{workOrder.workOrderNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">품목 코드</label>
                <p className="text-sm text-gray-900">{workOrder.itemCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">품목명</label>
                <p className="text-sm text-gray-900">{workOrder.itemName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">지시 수량</label>
                <p className="text-sm text-gray-900">{workOrder.requestedQuantity} EA</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">요청일</label>
                <p className="text-sm text-gray-900">{workOrder.requestDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">납기일</label>
                <p className="text-sm text-gray-900">{workOrder.dueDate}</p>
              </div>
            </div>
          </div>

          {/* BOM 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">필요 원자재 (BOM 전개)</h2>
              {insufficientMaterials.length > 0 && (
                <button
                  onClick={handleMaterialRequest}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  원자재 불출 요청
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">원자재</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">필요량</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">현재고</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bomItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                          <div className="text-sm text-gray-500">{item.itemCode}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.requiredQuantity} {item.unit}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`text-sm ${item.availableStock >= item.requiredQuantity ? 'text-green-600' : 'text-red-600'}`}>
                          {item.availableStock} {item.unit}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 오른쪽: 생산 실적 입력 */}
        <div className="space-y-6">
          {/* 생산 실적 입력 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">생산 실적 입력</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">완료 수량</label>
                <input
                  type="number"
                  min="0"
                  value={completedQty}
                  onChange={(e) => setCompletedQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="완료된 수량을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">불량 수량</label>
                <input
                  type="number"
                  min="0"
                  value={defectQty}
                  onChange={(e) => setDefectQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="불량 수량을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="생산 관련 특이사항을 입력하세요"
                />
              </div>
              
              <button
                onClick={handleProductionSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-7

                transition-colors whitespace-nowrap"
              >
                실적 등록
              </button>
            </div>
          </div>

          {/* 생산 이력 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">생산 이력</h2>
            
            <div className="space-y-3">
              {productionRecords.map((record) => (
                <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="text-sm font-medium text-gray-900">
                    완료: {record.completedQuantity}EA, 불량: {record.defectQuantity}EA
                  </div>
                  <div className="text-xs text-gray-500">
                    {record.date} - {record.operator}
                  </div>
                  {record.notes && (
                    <div className="text-xs text-gray-600 mt-1">{record.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetail;
