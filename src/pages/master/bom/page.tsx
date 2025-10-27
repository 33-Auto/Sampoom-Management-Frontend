
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';
import { bomMasterData } from '@/mocks/factoryData';

const BomMasterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  // 헤더 설정
  const headerConfig = {
    moduleTitle: '기준정보 관리',
    moduleDescription: 'BOM(Bill of Materials) 구조를 관리하고 원가를 계산합니다',
    moduleIcon: 'ri-file-list-3-line',
    moduleColor: 'bg-main-500',
    userRole: '생산 관리자',
    userEmail: 'production@company.com',
    navItems: [
      { path: '/', label: '홈', icon: 'ri-home-line' },
      { path: '/master/items', label: '품목 마스터', icon: 'ri-database-line' },
      { path: '/master/bom', label: 'BOM 관리', icon: 'ri-file-list-3-line', active: true },
      { path: '/master/partners', label: '거래처 마스터', icon: 'ri-building-line' },
      { path: '/master/workcenters', label: '작업장 마스터', icon: 'ri-tools-line' },
      { path: '/master/routings', label: '공정 마스터', icon: 'ri-route-line' },
    ]
  };

  const filteredData = bomMasterData.filter(bom => {
    const matchesSearch = (bom.bomName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bom.bomId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '전체' || bom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'bomId', title: 'BOM 코드', width: '120px' },
    { key: 'bomName', title: '제품명' },
    { key: 'version', title: '버전', width: '80px' },
    { 
      key: 'status', 
      title: '상태', 
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === '활성' ? 'bg-green-100 text-green-800' :
          value === '검토중' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'totalCost', 
      title: '총 비용', 
      width: '120px',
      render: (value: number) => `₩${value?.toLocaleString() || 0}`
    },
    { key: 'lastModified', title: '최종 수정일', width: '120px' },
    {
      key: 'actions',
      title: '작업',
      width: '150px',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Link to={`/master/bom/edit/${row.bomId}`}>
            <Button variant="outline" size="sm">
              <i className="ri-edit-line mr-1"></i>
              편집
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <i className="ri-file-copy-line mr-1"></i>
            복사
          </Button>
        </div>
      )
    }
  ];

  // 통계 계산
  const totalBoms = bomMasterData.length;
  const activeBoms = bomMasterData.filter(bom => bom.status === '활성').length;
  const reviewingBoms = bomMasterData.filter(bom => bom.status === '검토중').length;
  const avgCost = bomMasterData.reduce((sum, bom) => sum + (bom.totalCost || 0), 0) / totalBoms;

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />

      {/* 메인 컨텐츠 */}
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-3-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 BOM</p>
                <p className="text-2xl font-bold text-gray-900">{totalBoms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 BOM</p>
                <p className="text-2xl font-bold text-gray-900">{activeBoms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">검토중</p>
                <p className="text-2xl font-bold text-gray-900">{reviewingBoms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 비용</p>
                <p className="text-2xl font-bold text-gray-900">₩{Math.round(avgCost).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOM 관리 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">BOM 목록</h2>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <i className="ri-download-line mr-2"></i>
                  내보내기
                </Button>
                <Button variant="outline">
                  <i className="ri-printer-line mr-2"></i>
                  인쇄
                </Button>
                <Link to="/master/bom/create">
                  <Button>
                    <i className="ri-add-line mr-2"></i>
                    새 BOM 생성
                  </Button>
                </Link>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="BOM 코드 또는 제품명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                <option value="전체">전체 상태</option>
                <option value="활성">활성</option>
                <option value="검토중">검토중</option>
                <option value="비활성">비활성</option>
              </Select>
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredData}
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default BomMasterPage;
