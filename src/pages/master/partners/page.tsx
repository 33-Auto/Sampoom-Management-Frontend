
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { Table } from '@/shared/ui';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';
import { partnerMasterData } from '@/mocks/factoryData';

export default function PartnerMaster() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');

  // 헤더 설정
  const headerConfig = {
    moduleTitle: '기준정보 관리',
    moduleDescription: '품목, BOM, 거래처, 작업장, 공정 등 기준 정보를 관리합니다',
    moduleIcon: 'ri-building-line',
    moduleColor: 'bg-main-500',
    userRole: '시스템 관리자',
    userEmail: 'admin@company.com',
    navItems: [
      { path: '/', label: '홈', icon: 'ri-home-line' },
      { path: '/master/items', label: '품목 마스터', icon: 'ri-database-line' },
      { path: '/master/bom', label: 'BOM 관리', icon: 'ri-file-list-3-line' },
      { path: '/master/partners', label: '거래처 마스터', icon: 'ri-building-line', active: true },
      { path: '/master/workcenters', label: '작업장 마스터', icon: 'ri-tools-line' },
      { path: '/master/routings', label: '공정 마스터', icon: 'ri-route-line' },
    ]
  };

  const typeOptions = [
    { value: '전체', label: '전체 유형' },
    { value: '고객사', label: '고객사' },
    { value: '공급업체', label: '공급업체' },
  ];

  const statusOptions = [
    { value: '전체', label: '전체 상태' },
    { value: '활성', label: '활성' },
    { value: '비활성', label: '비활성' },
  ];

  const filteredData = partnerMasterData.filter(partner => {
    const matchesSearch = partner.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.partnerCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === '전체' || partner.partnerType === typeFilter;
    const matchesStatus = statusFilter === '전체' || partner.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    { key: 'partnerCode', title: '거래처 코드', width: '120px' },
    { key: 'partnerName', title: '거래처명' },
    {
      key: 'partnerType',
      title: '유형',
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '고객사' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      ),
    },
    { key: 'businessNumber', title: '사업자번호', width: '130px' },
    { key: 'representative', title: '대표자', width: '100px' },
    { key: 'contactPerson', title: '담당자', width: '100px' },
    { key: 'phone', title: '연락처', width: '130px' },
    {
      key: 'status',
      title: '상태',
      width: '80px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '활성' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  // 통계 계산
  const totalPartners = partnerMasterData.length;
  const activePartners = partnerMasterData.filter(partner => partner.status === '활성').length;
  const customers = partnerMasterData.filter(partner => partner.partnerType === '고객사').length;
  const suppliers = partnerMasterData.filter(partner => partner.partnerType === '공급업체').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />

      {/* 메인 컨텐츠 */}
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 거래처</p>
                <p className="text-2xl font-bold text-gray-900">{totalPartners}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-check-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 거래처</p>
                <p className="text-2xl font-bold text-gray-900">{activePartners}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">고객사</p>
                <p className="text-2xl font-bold text-gray-900">{customers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-truck-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">공급업체</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="거래처명 또는 코드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                신규 등록
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 거래처 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">거래처 목록</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 거래처
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
              emptyText="조건에 맞는 거래처가 없습니다"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
