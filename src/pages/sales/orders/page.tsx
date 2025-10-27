
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { Table } from '@/shared/ui';

// 판매 주문 데이터
const salesOrderData = [
  {
    orderId: 'SO-2024-001',
    orderDate: '2024-01-15',
    customerName: '서울대리점',
    customerCode: 'CUST-001',
    productName: '엔진 어셈블리 A-Type',
    quantity: 5,
    unitPrice: 2500000,
    totalAmount: 12500000,
    status: '신규',
    priority: '높음',
    requestedDate: '2024-01-20',
    salesManager: '김영업',
  },
  {
    orderId: 'SO-2024-002',
    orderDate: '2024-01-15',
    customerName: '부산대리점',
    customerCode: 'CUST-002',
    productName: '브레이크 시스템',
    quantity: 10,
    unitPrice: 850000,
    totalAmount: 8500000,
    status: '승인',
    priority: '보통',
    requestedDate: '2024-01-22',
    salesManager: '이판매',
  },
  {
    orderId: 'SO-2024-003',
    orderDate: '2024-01-14',
    customerName: '대구대리점',
    customerCode: 'CUST-003',
    productName: '전자제어 모듈',
    quantity: 8,
    unitPrice: 1200000,
    totalAmount: 9600000,
    status: '출고대기',
    priority: '높음',
    requestedDate: '2024-01-18',
    salesManager: '박영업',
  },
  {
    orderId: 'SO-2024-004',
    orderDate: '2024-01-14',
    customerName: '광주대리점',
    customerCode: 'CUST-004',
    productName: '서스펜션 키트',
    quantity: 3,
    unitPrice: 1800000,
    totalAmount: 5400000,
    status: '완료',
    priority: '보통',
    requestedDate: '2024-01-16',
    salesManager: '최판매',
  },
];

export default function SalesOrders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [priorityFilter, setPriorityFilter] = useState('전체');

  const headerConfig = {
    moduleTitle: '판매 관리',
    moduleDescription: '대리점 주문 접수 및 승인을 관리합니다',
    moduleIcon: 'ri-shopping-cart-line',
    moduleColor: 'bg-green-500',
    userRole: '판매 관리자',
    userEmail: 'sales@company.com',
    navItems: [
      { path: '/sales/orders', label: '판매 주문', icon: 'ri-shopping-cart-line', active: true },
      { path: '/sales/customers', label: '고객 관리', icon: 'ri-user-line' },
      { path: '/sales/analytics', label: '판매 분석', icon: 'ri-bar-chart-line' }
    ]
  };

  // 기존 코드 유지
  const navItems = [
    { path: '/', label: '홈', icon: 'ri-home-line' },
    { path: '/sales/orders', label: '판매 주문', icon: 'ri-shopping-cart-line', active: true },
    { path: '/sales/customers', label: '고객 관리', icon: 'ri-user-line' },
    { path: '/sales/analytics', label: '판매 분석', icon: 'ri-bar-chart-line' },
  ];

  const statusOptions = [
    { value: '전체', label: '전체 상태' },
    { value: '신규', label: '신규' },
    { value: '승인', label: '승인' },
    { value: '출고대기', label: '출고대기' },
    { value: '완료', label: '완료' },
    { value: '취소', label: '취소' },
  ];

  const priorityOptions = [
    { value: '전체', label: '전체 우선순위' },
    { value: '높음', label: '높음' },
    { value: '보통', label: '보통' },
    { value: '낮음', label: '낮음' },
  ];

  const filteredData = salesOrderData.filter(order => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || order.status === statusFilter;
    const matchesPriority = priorityFilter === '전체' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleApprove = (orderId: string) => {
    console.log('주문 승인:', orderId);
  };

  const handleReject = (orderId: string) => {
    console.log('주문 반려:', orderId);
  };

  const columns = [
    { key: 'orderId', title: '주문번호', width: '120px' },
    { key: 'orderDate', title: '주문일', width: '100px' },
    { key: 'customerName', title: '고객사' },
    { key: 'productName', title: '제품명' },
    {
      key: 'quantity',
      title: '수량',
      width: '80px',
      render: (value: number) => `${value}개`,
    },
    {
      key: 'totalAmount',
      title: '총액',
      width: '120px',
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'priority',
      title: '우선순위',
      width: '100px',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === '높음'
              ? 'bg-red-100 text-red-800'
              : value === '보통'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: '상태',
      width: '100px',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === '신규'
              ? 'bg-blue-100 text-blue-800'
              : value === '승인'
              ? 'bg-green-100 text-green-800'
              : value === '출고대기'
              ? 'bg-yellow-100 text-yellow-800'
              : value === '완료'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      title: '작업',
      width: '150px',
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          {row.status === '신규' && (
            <>
              <Button variant="default" size="sm" onClick={() => handleApprove(row.orderId)}>
                승인
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleReject(row.orderId)}>
                반려
              </Button>
            </>
          )}
          {row.status === '승인' && <Button variant="secondary" size="sm">출고지시</Button>}
          <Button variant="secondary" size="sm">
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalOrders = salesOrderData.length;
  const newOrders = salesOrderData.filter(order => order.status === '신규').length;
  const pendingOrders = salesOrderData.filter(order => order.status === '출고대기').length;
  const totalAmount = salesOrderData.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs 
        navItems={navItems} 
        moduleColor="bg-green-500"
      />

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 주문</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-notification-line text-xl text-red-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">신규 주문</p>
                <p className="text-2xl font-bold text-gray-900">{newOrders}</p>
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
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 주문액</p>
                <p className="text-2xl font-bold text-gray-900">₩{(totalAmount / 1000000).toFixed(0)}M</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="주문번호, 고객사, 제품명 검색..."
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
                수동 주문
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 주문 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">판매 주문 목록</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 주문
                </span>
                <Button variant="secondary" size="sm">
                  <i className="ri-refresh-line mr-2"></i>
                  새로고침
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Table columns={columns} data={filteredData} emptyText="조건에 맞는 주문이 없습니다" />
          </div>
        </div>
      </div>
    </div>
  );
}
