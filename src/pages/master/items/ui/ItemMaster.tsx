import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { materialMasterData } from "@/mocks/factoryData";
import {
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { useItemStats } from "../model/useItemStats";

export const ItemMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedType, setSelectedType] = useState("전체");
  const [selectedProcurement, setSelectedProcurement] = useState("전체");

  const categoryOptions = [
    { value: "전체", label: "전체 카테고리" },
    {
      value: "원자재 > 금속 > 스테인리스",
      label: "원자재 > 금속 > 스테인리스",
    },
    { value: "원자재 > 금속 > 알루미늄", label: "원자재 > 금속 > 알루미늄" },
    { value: "원자재 > 고무 > 실리콘", label: "원자재 > 고무 > 실리콘" },
    { value: "원자재 > 전자부품 > 기판", label: "원자재 > 전자부품 > 기판" },
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
      value: "완제품 > 자동차부품 > 엔진",
      label: "완제품 > 자동차부품 > 엔진",
    },
    { value: "완제품 > 산업기계 > 펌프", label: "완제품 > 산업기계 > 펌프" },
  ];

  const typeOptions = [
    { value: "전체", label: "전체 유형" },
    { value: "원자재", label: "원자재" },
    { value: "부품", label: "부품" },
  ];

  const procurementOptions = [
    { value: "전체", label: "전체 조달 유형" },
    { value: "구매", label: "구매 (External)" },
    { value: "생산", label: "생산 (Internal)" },
    { value: "혼합", label: "혼합 (Both)" },
  ];

  const filteredData = materialMasterData.filter((item) => {
    const matchesSearch =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || true;
    const matchesType =
      selectedType === "전체" || item.itemType === selectedType;
    const matchesProcurement =
      selectedProcurement === "전체" ||
      item.procurementType === selectedProcurement;
    return (
      matchesSearch && matchesCategory && matchesType && matchesProcurement
    );
  });

  const columns = [
    { key: "itemCode", title: "품목 코드", width: "120px" },
    { key: "itemName", title: "품목명" },
    { key: "category", title: "카테고리", width: "200px" },
    {
      key: "itemType",
      title: "품목 유형",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "원자재"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "procurementType",
      title: "조달 유형",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "구매"
              ? "bg-orange-100 text-orange-800"
              : value === "생산"
                ? "bg-teal-100 text-teal-800"
                : "bg-indigo-100 text-indigo-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "leadTime",
      title: "리드 타임",
      width: "120px",
      render: (_: any, row: any) => {
        if (row.procurementType === "구매") {
          return (
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {row.purchaseLeadTime}일
              </div>
              <div className="text-xs text-gray-500">구매</div>
            </div>
          );
        } else if (row.procurementType === "생산") {
          return (
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {row.calculatedProductionLeadTime || row.productionLeadTime}일
              </div>
              <div className="text-xs text-gray-500">
                {row.calculatedProductionLeadTime ? "자동계산" : "수동입력"}
              </div>
            </div>
          );
        } else if (row.procurementType === "혼합") {
          return (
            <div className="text-center">
              <div className="text-xs text-gray-900">
                구매: {row.purchaseLeadTime}일
              </div>
              <div className="text-xs text-gray-900">
                생산:{" "}
                {row.calculatedProductionLeadTime || row.productionLeadTime}일
              </div>
            </div>
          );
        }
        return "-";
      },
    },
    { key: "unit", title: "단위", width: "80px" },
    {
      key: "standardPrice",
      title: "표준 단가",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString() || 0}`,
    },
    {
      key: "currentStock",
      title: "현재고",
      width: "100px",
      render: (value: number, row: any) => `${value || 0} ${row.unit}`,
    },
    {
      key: "status",
      title: "상태",
      width: "80px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "활성"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // 통계 계산 (훅으로 분리)
  const {
    totalItems,
    activeItems,
    purchaseItems,
    productionItems,
    avgPurchaseLeadTime,
    avgProductionLeadTime,
  } = useItemStats(materialMasterData);

  return (
    <>
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-6">
        <StatCard
          icon="ri-database-line"
          label="전체 품목"
          value={totalItems}
          iconBgColor="bg-main-100"
          iconColor="text-main-600"
        />

        <StatCard
          icon="ri-check-line"
          label="활성 품목"
          value={activeItems}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon="ri-shopping-cart-line"
          label="구매 품목"
          value={purchaseItems}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatCard
          icon="ri-tools-line"
          label="생산 품목"
          value={productionItems}
          iconBgColor="bg-teal-100"
          iconColor="text-teal-600"
        />

        <StatCard
          icon="ri-time-line"
          label="평균 구매 L/T"
          value={`${avgPurchaseLeadTime}일`}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-timer-line"
          label="평균 생산 L/T"
          value={`${avgProductionLeadTime}일`}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="품목명 또는 코드 검색..."
        filters={[
          {
            key: "category",
            value: selectedCategory,
            options: categoryOptions,
            onChange: (value) => setSelectedCategory(value),
          },
          {
            key: "type",
            value: selectedType,
            options: typeOptions,
            onChange: (value) => setSelectedType(value),
          },
          {
            key: "procurement",
            value: selectedProcurement,
            options: procurementOptions,
            onChange: (value) => setSelectedProcurement(value),
          },
        ]}
        actions={
          <>
            <Button
              variant="default"
              size="sm"
              onClick={async () => navigate("/master/items/create")}
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

      {/* 리드 타임 관리 안내 */}
      <InfoBox type="info" title="리드 타임 관리 안내">
        <p className="mb-1">
          • <strong>구매 리드 타임:</strong> 발주부터 입고까지의 총 일수 (공급처
          생산 + 운송 + 검사 시간 포함)
        </p>
        <p className="mb-1">
          • <strong>생산 리드 타임:</strong> 생산 지시부터 완성까지의 총 일수
          (Setup + 가공 + 대기 시간 포함)
        </p>
        <p>
          • <strong>MRP 시스템:</strong> 이 리드 타임을 기반으로 역방향 일정
          계획(Backward Scheduling)을 수행합니다
        </p>
      </InfoBox>

      {/* 공정 기반 리드 타임 자동 계산 안내 */}
      <InfoBox type="success" title="공정 기반 리드 타임 자동 계산">
        <p className="mb-1">
          • <strong>생산 리드 타임:</strong> 공정 마스터의 준비시간 + 가공시간 +
          대기시간을 자동 합산
        </p>
        <p className="mb-1">
          • <strong>동적 계산:</strong> 생산 수량에 따라 실시간으로 총 소요시간
          계산
        </p>
        <p>
          • <strong>정확한 일정:</strong> 작업장별 능력을 반영한 정밀한 생산
          스케줄링 지원
        </p>
      </InfoBox>

      {/* 품목 목록 테이블 */}
      <TableSection
        title="품목 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 품목
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
          emptyText="조건에 맞는 품목이 없습니다"
        />
      </TableSection>
    </>
  );
};
