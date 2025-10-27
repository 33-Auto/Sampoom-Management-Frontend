
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { Table } from '@/shared/ui';

// 재고 현황 데이터
const inventoryData = [
  {
    itemCode: 'PROD-001',
    itemName: '엔진 어셈블리 A-Type',
    category: '완제품',
    currentStock: 45,
    safetyStock: 20,
    reorderPoint: 60,
    maxStock: 200,
    unit: 'EA',
    location: 'A-01-05',
    lastUpdated: '2024-01-20 14:30',
    status: '정상',
    avgCost: 850000,
    totalValue: 38250000,
  },
  {
    itemCode: 'PROD-002',
    itemName: '브레이크 시스템',
    category: '완제품',
    currentStock: 15,
    safetyStock: 25,
    reorderPoint: 40,
    maxStock: 150,
    unit: 'EA',
    location: 'B-02-03',
    lastUpdated: '2024-01-20 16:45',
    status: '부족',
    avgCost: 320000,
    totalValue: 4800000,
  },
  {
    itemCode: 'MAT-001',
    itemName: '알루미늄 합금 판재',
    category: '원자재',
    currentStock: 120,
    safetyStock: 50,
    reorderPoint: 80,
    maxStock: 300,
    unit: 'KG',
    location: 'C-01-02',
    lastUpdated: '2024-01-20 09:15',
    status: '정상',
    avgCost: 8500,
    totalValue: 1020000,
  },
  {
    itemCode: 'MAT-002',
    itemName: '고무 시일링',
    category: '원자재',
    currentStock: 25,
    safetyStock: 100,
    reorderPoint: 150,
    maxStock: 500,
    unit: 'EA',
    location: 'D-03-01',
    lastUpdated: '2024-01-20 11:20',
    status: '위험',
    avgCost: 2500,
    totalValue: 62500,
  },
];

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');

  const headerConfig = {
    moduleTitle: '재고 관리 (WMS)',
    moduleDescription: '창고 재고 현황 및 위치를 관리합니다',
    moduleIcon: 'ri-stack-line',
    moduleColor: 'bg-purple-500',
    userRole: '창고 관리자',
    userEmail: 'warehouse@company.com',
    navItems: [
      { path: '/wms/shipping', label: '출고 지시', icon: 'ri-truck-line' },
      { path: '/wms/inventory', label: '재고 현황', icon: 'ri-stack-line', active: true },
      { path: '/wms/receiving', label: '입고 관리', icon: 'ri-inbox-line' },
      { path: '/wms/locations', label: '창고 위치', icon: 'ri-map-pin-line' }
    ]
  };

  // Extract nav items for use in NavigationTabs component
  const navItems = headerConfig.navItems;

  const categoryOptions = [
    { value: '전체', label: '전체 카테고리' },
    { value: '완제품', label: '완제품' },
    { value: '원자재', label: '원자재' },
    { value: '부품', label: '부품' },
  ];

  const statusOptions = [
    { value: '전체', label: '전체 상태' },
    { value: '정상', label: '정상' },
    { value: '부족', label: '부족' },
    { value: '위험', label: '위험' },
    { value: '과다', label: '과다' },
  ];

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '전체' || item.category === categoryFilter;
    const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStockMovement = (itemCode: string, type: 'in' | 'out') => {
    console.log('재고 이동 기록:', itemCode, type);
    // ERP로 재고 변경 이벤트 전송
  };

  const handleLocationUpdate = (itemCode: string) => {
    console.log('위치 변경:', itemCode);
  };

  const columns = [
    { key: 'itemCode', title: '품목코드', width: '120px' },
    { key: 'itemName', title: '품목명' },
    { key: 'category', title: '카테고리', width: '100px' },
    {
      key: 'currentStock',
      title: '현재고',
      width: '100px',
      render: (value: number, row: any) => (
        <span className={
          value <= row.safetyStock ? 'text-red-600 font-semibold' :
          value <= row.reorderPoint ? 'text-yellow-600 font-semibold' :
          'text-gray-900'
        }>
          {value.toLocaleString()} {row.unit}
        </span>
      ),
    },
    {
      key: 'reorderPoint',
      title: '재주문점',
      width: '100px',
      render: (value: number, row: any) => `${value} ${row.unit}`,
    },
    { key: 'location', title: '위치', width: '100px' },
    {
      key: 'status',
      title: '상태',
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '정상' ? 'bg-green-100 text-green-800' :
          value === '부족' ? 'bg-yellow-100 text-yellow-800' :
          value === '위험' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'totalValue',
      title: '재고가치',
      width: '120px',
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'actions',
      title: '작업',
      width: '150px',
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleStockMovement(row.itemCode, 'in')}
          >
            입고
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleLocationUpdate(row.itemCode)}
          >
            이동
          </Button>
        </div>
      ),
    },
  ];

  const totalItems = inventoryData.length;
  const lowStockItems = inventoryData.filter(item => item.currentStock <= item.reorderPoint).length;
  const criticalItems = inventoryData.filter(item => item.currentStock <= item.safetyStock).length;
  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs 
          navItems={navItems} 
          moduleColor="bg-purple-500"
        />

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-stack-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 품목</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-alert-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">재주문점 이하</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-error-warning-line text-xl text-red-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">안전재고 이하</p>
                <p className="text-2xl font-bold text-gray-900">{criticalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 재고가치</p>
                <p className="text-2xl font-bold text-gray-900">₩{(totalValue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="품목코드, 품목명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                재고조정
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 재고 현황 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">재고 현황</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 품목
                </span>
                <Button variant="secondary" size="sm">
                  <i className="ri-refresh-line mr-2"></i>
                  새로고침
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Table
              columns={columns}
              data={filteredData}
              emptyText="조건에 맞는 재고가 없습니다"
            />
          </div>
        </div>

        {/* WMS 역할 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
            <div>
              <h3 className="text-sm font-medium text-blue-900">WMS 시스템 역할</h3>
              <p className="text-sm text-blue-700 mt-1">
                WMS는 재고의 물리적 위치와 이동을 관리하며, 재고 변경 사항을 ERP 시스템에 보고합니다. 
                생산 계획 및 구매 결정은 ERP의 MRP 모듈에서 담당합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
