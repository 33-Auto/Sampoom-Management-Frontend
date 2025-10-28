import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { bomMasterData } from "@/mocks/factoryData";
import { Table, Button, Input, Select } from "@/shared/ui";

const BomMasterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedComplexity, setSelectedComplexity] = useState("전체");

  const categoryOptions = [
    { value: "전체", label: "전체 카테고리" },
    {
      value: "부품 > 안전 > 제동 > 브레이크",
      label: "부품 > 안전 > 제동 > 브레이크",
    },
    {
      value: "부품 > 섀시 > 현가장치 > 서스펜션",
      label: "부품 > 섀시 > 현가장치 > 서스펜션",
    },
    {
      value: "부품 > 기계 > 동력전달 > 기어박스",
      label: "부품 > 기계 > 동력전달 > 기어박스",
    },
    {
      value: "부품 > 전기 > 조명 > LED모듈",
      label: "부품 > 전기 > 조명 > LED모듈",
    },
    { value: "부품 > 내장 > 시트 > 쿠션", label: "부품 > 내장 > 시트 > 쿠션" },
    {
      value: "부품 > 플라스틱 > 외장재 > 하우징",
      label: "부품 > 플라스틱 > 외장재 > 하우징",
    },
    {
      value: "부품 > 기계 > 동력전달 > 어셈블리",
      label: "부품 > 기계 > 동력전달 > 어셈블리",
    },
    { value: "부품 > 전자 > 제어 > 모듈", label: "부품 > 전자 > 제어 > 모듈" },
  ];

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "활성", label: "활성" },
    { value: "검토중", label: "검토중" },
    { value: "비활성", label: "비활성" },
    { value: "승인대기", label: "승인대기" },
  ];

  const complexityOptions = [
    { value: "전체", label: "전체 복잡도" },
    { value: "단순", label: "단순 (1-5개 구성품)" },
    { value: "보통", label: "보통 (6-15개 구성품)" },
    { value: "복잡", label: "복잡 (16개 이상 구성품)" },
  ];

  const filteredData = bomMasterData.filter((bom) => {
    const matchesSearch =
      bom.bomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.bomId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || true; // category 필터링은 임시로 비활성화
    const matchesStatus =
      selectedStatus === "전체" || bom.status === selectedStatus;
    const matchesComplexity = selectedComplexity === "전체" || true; // complexity 필터링은 임시로 비활성화
    return (
      matchesSearch && matchesCategory && matchesStatus && matchesComplexity
    );
  });

  const columns = [
    { key: "bomId", title: "BOM 코드", width: "120px" },
    { key: "bomName", title: "제품명" },
    { key: "description", title: "설명", width: "200px" },
    { key: "version", title: "버전", width: "80px" },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "활성"
              ? "bg-green-100 text-green-800"
              : value === "검토중"
                ? "bg-yellow-100 text-yellow-800"
                : value === "승인대기"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "complexity",
      title: "복잡도",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "단순"
              ? "bg-blue-100 text-blue-800"
              : value === "보통"
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "componentCount",
      title: "구성품 수",
      width: "100px",
      render: (value: number) => `${value || 0}개`,
    },
    {
      key: "totalCost",
      title: "총 비용",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString() || 0}`,
    },
    { key: "lastModified", title: "최종 수정일", width: "120px" },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => navigate(`/master/bom/edit/${row.bomId}`)}
          >
            <i className="ri-eye-line"></i>
          </Button>
          <Button variant="secondary" size="sm">
            <i className="ri-edit-line"></i>
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalBoms = bomMasterData.length;
  const activeBoms = bomMasterData.filter(
    (bom) => bom.status === "활성",
  ).length;
  const reviewingBoms = bomMasterData.filter(
    (bom) => bom.status === "검토중",
  ).length;
  const avgCost =
    bomMasterData.reduce(
      (sum, bom) =>
        sum + bom.materials.reduce((s, m) => s + (m.unitCost || 0), 0),
      0,
    ) / totalBoms;
  const avgComponents = Math.round(
    bomMasterData.reduce((sum, bom) => sum + (bom.materials?.length || 0), 0) /
      totalBoms,
  );
  const complexBoms = bomMasterData.filter(
    (bom) => (bom.materials?.length || 0) >= 16,
  ).length;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-main-100">
                <i className="ri-file-list-3-line text-xl text-main-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 BOM</p>
                <p className="text-2xl font-bold text-gray-900">{totalBoms}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-check-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 BOM</p>
                <p className="text-2xl font-bold text-gray-900">{activeBoms}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <i className="ri-time-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">검토중</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviewingBoms}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <i className="ri-money-dollar-circle-line text-xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 비용</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{Math.round(avgCost).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <i className="ri-stack-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 구성품</p>
                <p className="text-2xl font-bold text-gray-900">
                  {avgComponents}개
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <i className="ri-alert-line text-xl text-red-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">복잡 BOM</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complexBoms}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="w-full">
              <Input
                placeholder="BOM 코드 또는 제품명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </div>

            <div className="w-full">
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
            </div>

            <div className="w-full">
              <Select
                options={complexityOptions}
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={async () => navigate("/master/bom/create")}
              >
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

        {/* BOM 관리 안내 */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <i className="ri-information-line text-sm text-blue-600"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">
                BOM 관리 안내
              </h3>
              <div className="mt-2 text-sm text-blue-800">
                <p className="mb-1">
                  • <strong>BOM 구조:</strong> 제품을 구성하는 모든 원자재,
                  부품의 계층적 구조와 수량 정보
                </p>
                <p className="mb-1">
                  • <strong>원가 계산:</strong> 구성품의 표준 단가를 기반으로
                  제품 총 원가 자동 계산
                </p>
                <p>
                  • <strong>생산 계획:</strong> MRP 시스템에서 소요량 계산과
                  생산 일정 수립의 기준 데이터
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 복잡도별 관리 안내 */}
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <i className="ri-check-line text-sm text-green-600"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-900">
                BOM 복잡도 분류
              </h3>
              <div className="mt-2 text-sm text-green-800">
                <p className="mb-1">
                  • <strong>단순 BOM:</strong> 1-5개 구성품, 단일 레벨 구조,
                  빠른 승인 프로세스
                </p>
                <p className="mb-1">
                  • <strong>보통 BOM:</strong> 6-15개 구성품, 2-3 레벨 구조,
                  표준 검토 프로세스
                </p>
                <p>
                  • <strong>복잡 BOM:</strong> 16개 이상 구성품, 다단계 구조,
                  엄격한 승인 프로세스
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOM 목록 테이블 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">BOM 목록</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 BOM
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
              emptyText="조건에 맞는 BOM이 없습니다"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BomMasterPage;
