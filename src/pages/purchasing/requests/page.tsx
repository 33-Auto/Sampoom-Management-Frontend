
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { Table } from '@/shared/ui';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';

// 구매 요청 데이터
const purchaseRequestData = [
  {
    requestId: 'PR-2024-001',
    requestDate: '2024-01-15',
    itemName: '알루미늄 합금',
    itemCode: 'RAW-001',
    requestedQty: 500,
    unit: 'KG',
    urgency: '높음',
    requestedBy: '김생산',
    department: '생산부',
    reason: '생산지시 WO-2024-001',
    requiredDate: '2024-01-20',
    estimatedPrice: 2500000,
    status: '승인대기',
    supplier: '대한금속',
  },
  {
    requestId: 'PR-2024-002',
    requestDate: '2024-01-15',
    itemName: '고무 시일링',
    itemCode: 'RAW-002',
    requestedQty: 200,
    unit: 'EA',
    urgency: '보통',
    requestedBy: '이생산',
    department: '생산부',
    reason: '재고 보충',
    requiredDate: '2024-01-25',
    estimatedPrice: 800000,
    status: '승인',
    supplier: '한국고무',
  },
  {
    requestId: 'PR-2024-003',
    requestDate: '2024-01-14',
    itemName: '전자 센서',
    itemCode: 'COMP-003',
    requestedQty: 50,
    unit: 'EA',
    urgency: '높음',
    requestedBy: '박품질',
    department: '품질관리부',
    reason: '불량품 교체',
    requiredDate: '2024-01-18',
    estimatedPrice: 1500000,
    status: '발주완료',
    supplier: '전자부품코리아',
  },
];

export default function PurchaseRequests() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [urgencyFilter, setUrgencyFilter] = useState('전체');

  // 헤더 설정
  const headerConfig = {
    moduleTitle: '구매 관리',
    moduleDescription: '구매 요청, 주문 및 공급업체를 관리합니다',
    moduleIcon: 'ri-shopping-bag-line',
    moduleColor: 'bg-orange-500',
    userRole: '구매 담당자',
    userEmail: 'purchasing@company.com'
  };

  // 네비게이션 탭 설정
  const navItems = [
    { path: '/', label: '홈', icon: 'ri-home-line' },
    { path: '/purchasing/requests', label: '구매 요청', icon: 'ri-file-text-line', active: true },
    { path: '/purchasing/orders', label: '구매 주문', icon: 'ri-shopping-bag-line' },
    { path: '/purchasing/suppliers', label: '공급업체', icon: 'ri-building-line' },
    { path: '/purchasing/analytics', label: '구매 분석', icon: 'ri-bar-chart-line' },
  ];

  const statusOptions = [
    { value: '전체', label: '전체 상태' },
    { value: '승인대기', label: '승인대기' },
    { value: '승인', label: '승인' },
    { value: '발주완료', label: '발주완료' },
    { value: '반려', label: '반려' },
  ];

  const urgencyOptions = [
    { value: '전체', label: '전체 긴급도' },
    { value: '높음', label: '높음' },
    { value: '보통', label: '보통' },
    { value: '낮음', label: '낮음' },
  ];

  const filteredData = purchaseRequestData.filter(request => {
    const matchesSearch = request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === '전체' || request.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleApprove = (requestId: string) => {
    console.log('구매 요청 승인:', requestId);
  };

  const handleReject = (requestId: string) => {
    console.log('구매 요청 반려:', requestId);
  };

  const handleCreatePO = (requestId: string) => {
    navigate(`/purchasing/orders?from=${requestId}`);
  };

  const columns = [
    { key: 'requestId', title: '요청번호', width: '120px' },
    { key: 'requestDate', title: '요청일', width: '100px' },
    { key: 'itemName', title: '품목명' },
    {
      key: 'requestedQty',
      title: '요청수량',
      width: '100px',
      render: (value: number, row: any) => `${value} ${row.unit}`,
    },
    { key: 'requestedBy', title: '요청자', width: '100px' },
    { key: 'requiredDate', title: '필요일', width: '100px' },
    {
      key: 'urgency',
      title: '긴급도',
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
      key: 'estimatedPrice',
      title: '예상금액',
      width: '120px',
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'status',
      title: '상태',
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '승인대기' ? 'bg-blue-100 text-blue-800' :
          value === '승인' ? 'bg-green-100 text-green-800' :
          value === '발주완료' ? 'bg-gray-100 text-gray-800' :
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
          {row.status === '승인대기' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApprove(row.requestId)}
              >
                승인
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(row.requestId)}
              >
                반려
              </Button>
            </>
          )}
          {row.status === '승인' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleCreatePO(row.requestId)}
            >
              발주생성
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
  const totalRequests = purchaseRequestData.length;
  const pendingApproval = purchaseRequestData.filter(req => req.status === '승인대기').length;
  const approved = purchaseRequestData.filter(req => req.status === '승인').length;
  const totalAmount = purchaseRequestData.reduce((sum, req) => sum + req.estimatedPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs 
        navItems={navItems} 
        moduleColor="bg-orange-500"
      />
      {/* 메인 컨텐츠 */}
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 요청</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인 대기</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApproval}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-check-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인 완료</p>
                <p className="text-2xl font-bold text-gray-900">{approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 요청액</p>
                <p className="text-2xl font-bold text-gray-900">₩{(totalAmount / 1000000).toFixed(0)}M</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="요청번호, 품목명, 요청자 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={urgencyOptions}
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                신규 요청
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 구매 요청 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">구매 요청 목록</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 요청
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
              emptyText="조건에 맞는 구매요청이 없습니다"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
