import { useState } from "react";

import type { PartResDto } from "@/shared/api/models";
import { Button, Input, Select, Table } from "@/shared/ui";

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
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "정상"
              ? "bg-green-100 text-green-800"
              : value === "부족"
                ? "bg-yellow-100 text-yellow-800"
                : value === "위험"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
          }`}
        >
          {value}
        </span>
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

  const totalItems = apiResponse?.data!.length;
  const lowStockItems = apiResponse?.data!.filter(
    (item: PartResDto) => (item.quantity || -1) <= (item.rop || 0),
  ).length;
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
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <i className="ri-stack-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 품목</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <i className="ri-alert-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  재주문점 이하
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {lowStockItems}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <i className="ri-error-warning-line text-xl text-red-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  안전재고 이하
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {criticalItems}
                </p>
              </div>
            </div>
          </div> */}

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-money-dollar-circle-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 재고가치</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{(totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="품목코드, 품목명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
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
          </div>
        </div>

        {/* 재고 현황 테이블 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">재고 현황</h2>
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
              emptyText={
                isLoading ? "데이터 로딩 중..." : "조건에 맞는 재고가 없습니다"
              }
              errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
            />
          </div>
        </div>

        {/* WMS 역할 안내 */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-information-line mt-0.5 text-lg text-blue-600"></i>
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                WMS 시스템 역할
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                WMS는 재고의 물리적 위치와 이동을 관리하며, 재고 변경 사항을 ERP
                시스템에 보고합니다. 생산 계획 및 구매 결정은 ERP의 MRP 모듈에서
                담당합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
