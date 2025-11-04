import { useState } from "react";

import type { PartResDto } from "@/shared/model/models";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { useWarehouseInventoryQuery } from "../api/inventory.api";

export const InventoryDashboard = () => {
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useWarehouseInventoryQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const categoryOptions = [
    { value: "전체", label: "전체 카테고리" },
    { value: "완제품", label: "완제품" },
    { value: "원자재", label: "원자재" },
    { value: "부품", label: "부품" },
  ];

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "정상", label: "정상" },
    { value: "부족", label: "부족" },
    { value: "위험", label: "위험" },
    { value: "과다", label: "과다" },
  ];

  // const inventoryData: PartResDto[] = (apiResponse?.data || []).map((item) => ({
  //   ...item,
  //   itemCode: item.code,
  //   itemName: item.name,
  //   currentStock: item.quantity || 0,
  //   reorderPoint: Number(item.rop || 0), // Placeholder
  //   safetyStock: 5, // Placeholder
  //   unit: "EA", // Placeholder
  //   totalValue: Number(item.partValue || 0), // Placeholder
  //   location: "A-1", // Placeholder
  // }));

  const filteredData =
    apiResponse?.data?.filter((item: PartResDto) => {
      const matchesSearch =
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "전체" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "전체" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    }) || [];

  const handleStockMovement = (itemCode: string, type: "in" | "out") => {
    console.log("재고 이동 기록:", itemCode, type);
    // ERP로 재고 변경 이벤트 전송
  };

  // const handleLocationUpdate = (itemCode: string) => {
  //   console.log("위치 변경:", itemCode);
  // };

  const columns = [
    { key: "code", title: "품목코드", width: "120px" },
    { key: "name", title: "품목명" },
    {
      key: "category",
      title: "카테고리",
      width: "250px",
      render: (_value: string, row: PartResDto) =>
        `${row.category || "-"} > ${row.group || "-"}`,
    },
    {
      key: "quantity",
      title: "현재고",
      width: "100px",
      render: (value: number, row: PartResDto) => (
        <span
          className={
            value <= Number(row.rop!)
              ? "font-semibold text-red-600"
              : value <= Number(row.rop!) * 1.2
                ? "font-semibold text-yellow-600"
                : "text-black dark:text-white"
          }
        >
          {value} {row.unit || "EA"}
        </span>
      ),
    },
    {
      key: "rop",
      title: "재주문점",
      width: "100px",
      render: (value: number, row: PartResDto) =>
        `${value} ${row.unit || "EA"}`,
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => (
        <Badge
          variant={
            value === "정상"
              ? "success"
              : value === "부족"
                ? "warning"
                : value === "위험"
                  ? "error"
                  : "info"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "partValue",
      title: "재고가치",
      width: "120px",
      render: (value: number) => `₩${Number(value).toLocaleString()}`,
    },
    {
      key: "actions",
      title: "작업",
      width: "150px",
      render: (value: any, row: PartResDto) => (
        <div className="flex space-x-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleStockMovement(row.code || "Error", "in")}
          >
            입고
          </Button>
          {/* <Button
            variant="secondary"
            size="sm"
            onClick={() => handleLocationUpdate(row.code || "Error")}
          >
            이동
          </Button> */}
        </div>
      ),
    },
  ];

  const totalItems = apiResponse?.data?.length ?? 0;
  const lowStockItems =
    apiResponse?.data?.filter(
      (item: PartResDto) => (item.quantity || -1) <= (item.rop || 0),
    ).length ?? 0;
  // const criticalItems = apiResponse?.data!.filter(
  //   (item) => item.currentStock <= item.safetyStock,
  // ).length;
  const totalValue =
    apiResponse?.data!.reduce(
      (sum, item) => sum + Number(item.partValue!),
      0,
    ) || 0;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-stack-line"
            label="전체 품목"
            value={totalItems}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-alert-line"
            label="재주문점 이하"
            value={lowStockItems}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="총 재고가치"
            value={`₩${(totalValue / 1000000).toFixed(1)}M`}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="품목코드, 품목명 검색..."
          filters={[
            {
              key: "category",
              value: categoryFilter,
              options: categoryOptions,
              onChange: setCategoryFilter,
            },
            {
              key: "status",
              value: statusFilter,
              options: statusOptions,
              onChange: setStatusFilter,
            },
          ]}
          actions={
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                재고조정
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          }
        />

        {/* 재고 현황 테이블 */}
        <TableSection
          title="재고 현황"
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
            emptyText={
              isLoading ? "데이터 로딩 중..." : "조건에 맞는 재고가 없습니다"
            }
            errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
          />
        </TableSection>

        {/* WMS 역할 안내 */}
        <InfoBox type="info" title="WMS 시스템 역할">
          <p className="mt-1 text-sm">
            WMS는 재고의 물리적 위치와 이동을 관리하며, 재고 변경 사항을 ERP
            시스템에 보고합니다. 생산 계획 및 구매 결정은 ERP의 MRP 모듈에서
            담당합니다.
          </p>
        </InfoBox>
      </div>
    </>
  );
};
