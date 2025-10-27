
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { Table } from '@/shared/ui';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';
import { routingMasterData } from '@/mocks/factoryData';

export default function RoutingMaster() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedRouting, setSelectedRouting] = useState<any>(null);

  // 헤더 설정
  const headerConfig = {
    moduleTitle: '기준정보 관리',
    moduleDescription: '품목, BOM, 거래처, 작업장, 공정 등 기준 정보를 관리합니다',
    moduleIcon: 'ri-route-line',
    moduleColor: 'bg-main-500',
    userRole: '시스템 관리자',
    userEmail: 'admin@company.com',
    navItems: [
      { path: '/', label: '홈', icon: 'ri-home-line' },
      { path: '/master/items', label: '품목 마스터', icon: 'ri-database-line' },
      { path: '/master/bom', label: 'BOM 관리', icon: 'ri-file-list-3-line' },
      { path: '/master/partners', label: '거래처 마스터', icon: 'ri-building-line' },
      { path: '/master/workcenters', label: '작업장 마스터', icon: 'ri-tools-line' },
      { path: '/master/routings', label: '공정 마스터', icon: 'ri-route-line', active: true },
    ]
  };

  const statusOptions = [
    { value: '전체', label: '전체 상태' },
    { value: '활성', label: '활성' },
    { value: '검토중', label: '검토중' },
    { value: '비활성', label: '비활성' },
  ];

  const filteredData = routingMasterData.filter(item => {
    const matchesSearch = item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.routingCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'routingCode', title: '공정 코드', width: '120px' },
    { key: 'itemCode', title: '품목 코드', width: '120px' },
    { key: 'itemName', title: '품목명' },
    { key: 'version', title: '버전', width: '80px' },
    {
      key: 'totalLeadTime',
      title: '총 리드타임',
      width: '120px',
      render: (value: number) => `${value}시간`,
    },
    {
      key: 'operationCount',
      title: '공정 수',
      width: '80px',
      render: (value: number) => `${value}개`,
    },
    {
      key: 'status',
      title: '상태',
      width: '80px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '활성' ? 'bg-green-100 text-green-800' :
          value === '검토중' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      title: '작업',
      width: '150px',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedRouting(row)}
          >
            <i className="ri-eye-line mr-1"></i>
            상세
          </Button>
          <Button variant="outline" size="sm">
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalRoutings = routingMasterData.length;
  const activeRoutings = routingMasterData.filter(item => item.status === '활성').length;
  const avgLeadTime = Math.round(
    routingMasterData.reduce((sum, item) => sum + item.totalLeadTime, 0) / totalRoutings
  );
  const avgOperations = Math.round(
    routingMasterData.reduce((sum, item) => sum + item.operationCount, 0) / totalRoutings
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />

      {/* 메인 컨텐츠 */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 공정 목록 */}
          <div className="lg:col-span-2">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-main-100 rounded-lg flex items-center justify-center">
                    <i className="ri-route-line text-xl text-main-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">전체 공정</p>
                    <p className="text-2xl font-bold text-gray-900">{totalRoutings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-check-line text-xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">활성 공정</p>
                    <p className="text-2xl font-bold text-gray-900">{activeRoutings}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-time-line text-xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">평균 리드타임</p>
                    <p className="text-2xl font-bold text-gray-900">{avgLeadTime}h</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-list-check text-xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">평균 공정수</p>
                    <p className="text-2xl font-bold text-gray-900">{avgOperations}개</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 필터 및 검색 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="품목명, 코드 또는 공정 코드 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="md:col-span-2"
                />
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/master/routings/create')}
                >
                  <i className="ri-add-line mr-2"></i>
                  신규 등록
                </Button>
              </div>
            </div>

            {/* 공정 목록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">공정 목록</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      총 {filteredData.length}개 공정
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
                  emptyText="조건에 맞는 공정이 없습니다"
                />
              </div>
            </div>
          </div>

          {/* 우측: 공정 상세 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">공정 상세 정보</h3>
              </div>
              <div className="p-6">
                {selectedRouting ? (
                  <div className="space-y-6">
                    {/* 기본 정보 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">기본 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">공정 코드:</span>
                          <span className="font-medium">{selectedRouting.routingCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">품목 코드:</span>
                          <span className="font-medium">{selectedRouting.itemCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">품목명:</span>
                          <span className="font-medium">{selectedRouting.itemName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">버전:</span>
                          <span className="font-medium">{selectedRouting.version}</span>
                        </div>
                      </div>
                    </div>

                    {/* 공정 순서 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">공정 순서</h4>
                      <div className="space-y-3">
                        {selectedRouting.operations?.map((op: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {op.operationNumber}. {op.operationName}
                              </span>
                              <span className="text-xs text-gray-500">{op.workCenterCode}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="block text-gray-500">준비시간</span>
                                <span className="font-medium">{op.setupTime}분</span>
                              </div>
                              <div>
                                <span className="block text-gray-500">가공시간</span>
                                <span className="font-medium">{op.processTime}분</span>
                              </div>
                              <div>
                                <span className="block text-gray-500">대기시간</span>
                                <span className="font-medium">{op.waitTime}분</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 총 시간 요약 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">시간 요약</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">총 준비시간:</span>
                          <span className="font-medium">
                            {selectedRouting.operations?.reduce((sum: number, op: any) => sum + op.setupTime, 0)}분
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">총 가공시간:</span>
                          <span className="font-medium">
                            {selectedRouting.operations?.reduce((sum: number, op: any) => sum + op.processTime, 0)}분
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">총 대기시간:</span>
                          <span className="font-medium">
                            {selectedRouting.operations?.reduce((sum: number, op: any) => sum + op.waitTime, 0)}분
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-900 font-medium">총 리드타임:</span>
                          <span className="font-bold text-main-600">{selectedRouting.totalLeadTime}시간</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-route-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">공정을 선택하면 상세 정보가 표시됩니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 공정 관리 안내 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <i className="ri-lightbulb-line text-sm text-green-600"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-900">공정 기반 리드 타임 자동 계산</h3>
              <div className="mt-2 text-sm text-green-800">
                <p className="mb-1">• <strong>동적 계산:</strong> 생산 수량 × 단위당 가공시간 + 준비시간 + 대기시간</p>
                <p className="mb-1">• <strong>작업장 연계:</strong> 각 공정의 작업장 능력을 반영한 정확한 스케줄링</p>
                <p>• <strong>실시간 업데이트:</strong> 공정 변경 시 품목 마스터의 생산 리드 타임 자동 갱신</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
