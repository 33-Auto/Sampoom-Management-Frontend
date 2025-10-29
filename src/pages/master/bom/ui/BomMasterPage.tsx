import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { bomMasterData } from "@/mocks/factoryData";
import { useTableFilter } from "@/shared/lib/hooks";
import {
  Table,
  Button,
  StatCard,
  InfoBox,
  SearchFilterBar,
  TableSection,
} from "@/shared/ui";

import { useBomStats } from "../model/useBomStats";

export const BomMasterPage = () => {
  const navigate = useNavigate();
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

  //! data에 대해서 filter를 적용하는 것을 추상화함 ( 커스텀 훅 )
  //! 이것을 다른 페이지까지 확장해서 추상화 하는 것은 아직 보류
  //! 서버사이드에서 해결할 수 있는 문제가 있기 때문
  const { searchTerm, setSearchTerm, filteredData } = useTableFilter({
    data: bomMasterData,
    searchFields: ["bomId", "bomName"],
    filters: [
      {
        key: "status",
        state: selectedStatus,
        setState: setSelectedStatus,
        options: statusOptions,
        matchFn: (item, value) => value === "전체" || item.status === value,
      },
    ],
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

  // 통계 계산 (훅으로 분리)
  const {
    totalBoms,
    activeBoms,
    reviewingBoms,
    avgCost,
    avgComponents,
    complexBoms,
  } = useBomStats(bomMasterData);

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-6">
          <StatCard
            icon="ri-file-list-3-line"
            label="전체 BOM"
            value={totalBoms}
            iconBgColor="bg-main-100"
            iconColor="text-main-600"
          />

          <StatCard
            icon="ri-check-line"
            label="활성 BOM"
            value={activeBoms}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <StatCard
            icon="ri-time-line"
            label="검토중"
            value={reviewingBoms}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />

          <StatCard
            icon="ri-money-dollar-circle-line"
            label="평균 비용"
            value={`₩${Math.round(avgCost).toLocaleString()}`}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatCard
            icon="ri-stack-line"
            label="평균 구성품"
            value={`${avgComponents}개`}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            icon="ri-alert-line"
            label="복잡 BOM"
            value={complexBoms}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="BOM 코드 또는 제품명 검색..."
          filters={[
            {
              key: "category",
              value: selectedCategory,
              options: categoryOptions,
              onChange: setSelectedCategory,
            },
            {
              key: "status",
              value: selectedStatus,
              options: statusOptions,
              onChange: setSelectedStatus,
            },
            {
              key: "complexity",
              value: selectedComplexity,
              options: complexityOptions,
              onChange: setSelectedComplexity,
            },
          ]}
          actions={
            <>
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
            </>
          }
        />

        {/* BOM 관리 안내 */}
        <InfoBox type="info" title="BOM 관리 안내">
          <p className="mb-1">
            • <strong>BOM 구조:</strong> 제품을 구성하는 모든 원자재, 부품의
            계층적 구조와 수량 정보
          </p>
          <p className="mb-1">
            • <strong>원가 계산:</strong> 구성품의 표준 단가를 기반으로 제품 총
            원가 자동 계산
          </p>
          <p>
            • <strong>생산 계획:</strong> MRP 시스템에서 소요량 계산과 생산 일정
            수립의 기준 데이터
          </p>
        </InfoBox>

        {/* 복잡도별 관리 안내 */}
        <InfoBox type="success" title="BOM 복잡도 분류">
          <p className="mb-1">
            • <strong>단순 BOM:</strong> 1-5개 구성품, 단일 레벨 구조, 빠른 승인
            프로세스
          </p>
          <p className="mb-1">
            • <strong>보통 BOM:</strong> 6-15개 구성품, 2-3 레벨 구조, 표준 검토
            프로세스
          </p>
          <p>
            • <strong>복잡 BOM:</strong> 16개 이상 구성품, 다단계 구조, 엄격한
            승인 프로세스
          </p>
        </InfoBox>

        {/* BOM 목록 테이블 */}
        <TableSection
          title="BOM 목록"
          metaRight={
            <span className="text-sm text-gray-500">
              총 {filteredData.length}개 BOM
            </span>
          }
          actionsRight={
            <Button variant="secondary" size="sm">
              <i className="ri-refresh-line mr-2"></i>
              새로고침
            </Button>
          }
        >
          <Table
            columns={columns}
            data={filteredData}
            emptyText="조건에 맞는 BOM이 없습니다"
          />
        </TableSection>
      </div>
    </>
  );
};
