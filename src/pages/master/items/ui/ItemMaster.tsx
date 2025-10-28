import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { materialMasterData } from "@/mocks/factoryData";
import { Button, Input, Select, Table } from "@/shared/ui";

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

  // 통계 계산
  const totalItems = materialMasterData.length;
  const activeItems = materialMasterData.filter(
    (item) => item.status === "활성",
  ).length;
  const purchaseItems = materialMasterData.filter(
    (item) => item.procurementType === "구매",
  ).length;
  const productionItems = materialMasterData.filter(
    (item) => item.procurementType === "생산",
  ).length;
  const avgPurchaseLeadTime = Math.round(
    materialMasterData
      .filter(
        (item) => item.procurementType === "구매" && item.purchaseLeadTime,
      )
      .reduce((sum, item) => sum + (item.purchaseLeadTime || 0), 0) /
      materialMasterData.filter(
        (item) => item.procurementType === "구매" && item.purchaseLeadTime,
      ).length,
  );
  const avgProductionLeadTime = Math.round(
    materialMasterData
      .filter(
        (item) => item.procurementType === "생산" && item.productionLeadTime,
      )
      .reduce((sum, item) => sum + (item.productionLeadTime || 0), 0) /
      materialMasterData.filter(
        (item) => item.procurementType === "생산" && item.productionLeadTime,
      ).length,
  );

  return (
    <>
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-main-100">
              <i className="ri-database-line text-xl text-main-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 품목</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 품목</p>
              <p className="text-2xl font-bold text-gray-900">{activeItems}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <i className="ri-shopping-cart-line text-xl text-orange-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">구매 품목</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchaseItems}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
              <i className="ri-tools-line text-xl text-teal-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">생산 품목</p>
              <p className="text-2xl font-bold text-gray-900">
                {productionItems}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <i className="ri-time-line text-xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 구매 L/T</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgPurchaseLeadTime}일
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <i className="ri-timer-line text-xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 생산 L/T</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgProductionLeadTime}일
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input
            placeholder="품목명 또는 코드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
          <Select
            options={procurementOptions}
            value={selectedProcurement}
            onChange={(e) => setSelectedProcurement(e.target.value)}
          />
          <div className="flex space-x-2">
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
          </div>
        </div>
      </div>

      {/* 리드 타임 관리 안내 */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <i className="ri-information-line text-sm text-blue-600"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-900">
              리드 타임 관리 안내
            </h3>
            <div className="mt-2 text-sm text-blue-800">
              <p className="mb-1">
                • <strong>구매 리드 타임:</strong> 발주부터 입고까지의 총 일수
                (공급처 생산 + 운송 + 검사 시간 포함)
              </p>
              <p className="mb-1">
                • <strong>생산 리드 타임:</strong> 생산 지시부터 완성까지의 총
                일수 (Setup + 가공 + 대기 시간 포함)
              </p>
              <p>
                • <strong>MRP 시스템:</strong> 이 리드 타임을 기반으로 역방향
                일정 계획(Backward Scheduling)을 수행합니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 공정 기반 리드 타임 자동 계산 안내 */}
      <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-start">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
            <i className="ri-check-line text-sm text-green-600"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-900">
              공정 기반 리드 타임 자동 계산
            </h3>
            <div className="mt-2 text-sm text-green-800">
              <p className="mb-1">
                • <strong>생산 리드 타임:</strong> 공정 마스터의 준비시간 +
                가공시간 + 대기시간을 자동 합산
              </p>
              <p className="mb-1">
                • <strong>동적 계산:</strong> 생산 수량에 따라 실시간으로 총
                소요시간 계산
              </p>
              <p>
                • <strong>정확한 일정:</strong> 작업장별 능력을 반영한 정밀한
                생산 스케줄링 지원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 품목 목록 테이블 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">품목 목록</h2>
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
            emptyText="조건에 맞는 품목이 없습니다"
          />
        </div>
      </div>
    </>
  );
};
