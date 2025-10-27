
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { Table } from '@/shared/ui';

// 출고 지시 데이터
const shippingTodoData = [
  {
    shippingId: 'SH-2024-001',
    orderId: 'SO-2024-001',
    orderDate: '2024-01-15',
    customerName: '서울대리점',
    productName: '엔진 어셈블리 A-Type',
    productCode: 'PROD-001',
    requestedQty: 5,
    availableStock: 3,
    warehouseLocation: 'A-01-05',
    priority: '높음',
    requestedDate: '2024-01-20',
    status: '출고대기',
    warehouseManager: '김창고',
  },
  {
    shippingId: 'SH-2024-002',
    orderId: 'SO-2024-002',
    orderDate: '2024-01-15',
    customerName: '부산대리점',
    productName: '브레이크 시스템',
    productCode: 'PROD-002',
    requestedQty: 10,
    availableStock: 15,
    warehouseLocation: 'B-02-03',
    priority: '보통',
    requestedDate: '2024-01-22',
    status: '출고대기',
    warehouseManager: '이창고',
  },
  {
    shippingId: 'SH-2024-003',
    orderId: 'SO-2024-003',
    orderDate: '2024-01-14',
    customerName: '대구대리점',
    productName: '전자제어 모듈',
    productCode: 'PROD-003',
    requestedQty: 8,
    availableStock: 2,
    warehouseLocation: 'C-01-02',
    priority: '높음',
    requestedDate: '2024-01-18',
    status: '재고부족',
    warehouseManager: '박창고',
  },
];

export default function ShippingTodos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [priorityFilter, setPriorityFilter] = useState('전체');

  const statusOptions = [
    { value: '전체', label: '전체 상태' },
    { value: '출고대기', label: '출고대기' },
    { value: '출고진행', label: '출고진행' },
    { value: '출고완료', label: '출고완료' },
    { value: '재고부족', label: '재고부족' },
  ];

  const priorityOptions = [
    { value: '전체', label: '전체 우선순위' },
    { value: '높음', label: '높음' },
    { value: '보통', label: '보통' },
    { value: '낮음', label: '낮음' },
  ];

  const filteredData = shippingTodoData.filter(item => {
    const matchesSearch = item.shippingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
    const matchesPriority = priorityFilter === '전체' || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleShipConfirm = (shippingId: string) => {
    console.log('출고 확정:', shippingId);
  };

  // 생산 요청 기능 제거 - WMS는 보고만 담당
  const handleStockAlert = (shippingId: string) => {
    console.log('재고 부족 알림 전송:', shippingId);
    // ERP 시스템으로 재고 부족 이벤트 전송
  };

  const columns = [
    { key: 'shippingId', title: '출고번호', width: '120px' },
    { key: 'orderId', title: '주문번호', width: '120px' },
    { key: 'customerName', title: '고객사', width: '120px' },
    { key: 'productName', title: '제품명' },
    {
      key: 'requestedQty',
      title: '요청수량',
      width: '80px',
      render: (value: number) => `${value}개`,
    },
    {
      key: 'availableStock',
      title: '가용재고',
      width: '80px',
      render: (value: number, row: any) => (
        <span className={value >= row.requestedQty ? 'text-green-600' : 'text-red-600'}>
          {value}개
        </span>
      ),
    },
    { key: 'warehouseLocation', title: '창고위치', width: '100px' },
    {
      key: 'priority',
      title: '우선순위',
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '높음' ? 'bg-red-100 text-red-800' :
          value === '보통' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: '상태',
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '출고대기' ? 'bg-blue-100 text-blue-800' :
          value === '출고진행' ? 'bg-yellow-100 text-yellow-800' :
          value === '출고완료' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      title: '작업',
      width: '180px',
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          {row.status === '출고대기' && row.availableStock >= row.requestedQty && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleShipConfirm(row.shippingId)}
            >
              출고확정
            </Button>
          )}
          {row.status === '재고부족' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStockAlert(row.shippingId)}
            >
              재고알림
            </Button>
          )}
          <Button variant="secondary" size="sm">
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalShipping = shippingTodoData.length;
  const pendingShipping = shippingTodoData.filter(item => item.status === '출고대기').length;
  const stockShortage = shippingTodoData.filter(item => item.status === '재고부족').length;
  const urgentShipping = shippingTodoData.filter(item => item.priority === '높음').length;

  return (
    <>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-truck-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 출고지시</p>
                <p className="text-2xl font-bold text-gray-900">{totalShipping}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">출고 대기</p>
                <p className="text-2xl font-bold text-gray-900">{pendingShipping}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-alert-line text-xl text-red-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">재고 부족</p>
                <p className="text-2xl font-bold text-gray-900">{stockShortage}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-fire-line text-xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">긴급 출고</p>
                <p className="text-2xl font-bold text-gray-900">{urgentShipping}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="출고번호, 주문번호, 고객사 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                수동 출고
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 출고 지시 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">출고 지시 목록</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 출고지시
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
              emptyText="조건에 맞는 출고지시가 없습니다"
            />
          </div>
        </div>
      </div>
    </>
  );
}
