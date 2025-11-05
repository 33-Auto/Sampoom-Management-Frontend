import { useState } from "react";

import {
  useWarehouseInventoryQuery,
  useMaterialCategoryQuery,
  useMaterialGroupQuery,
} from "@/pages/wms/inventory/api";
import type { InventoryStatus, PartResDto } from "@/pages/wms/inventory/model";
import { QUANTITY_STATUS } from "@/pages/wms/inventory/model";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

export const InventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading, isError } = useWarehouseInventoryQuery({
    warehouseId: 40,
    keyword: searchTerm === "" ? undefined : searchTerm,
    categoryId: categoryFilter === "" ? undefined : Number(categoryFilter),
    groupId: groupFilter === "" ? undefined : Number(groupFilter),
    quantityStatus:
      statusFilter === "" ? undefined : (statusFilter as InventoryStatus),
  });

  const { data: categoryData } = useMaterialCategoryQuery();

  const categoryOptions = [
    { value: "", label: "전체 카테고리" },
    ...(categoryData?.data?.map((item) => {
      return { value: String(item.categoryId), label: item.categoryName ?? "" };
    }) ?? []),
  ];

  const { data: groupData } =
    useMaterialGroupQuery(Number(categoryFilter)) || [];
  const groupOptions = [
    { value: "", label: "전체 그룹" },
    ...(groupData?.data?.map((item) => {
      return { value: String(item.groupId), label: item.groupName ?? "" };
    }) ?? []),
  ];

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(QUANTITY_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        return { value: value as string, label: key };
      }),
  ];

  // const filteredData =
  //   apiResponse?.data?.filter((item: PartResDto) => {
  //     const matchesSearch =
  //       item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.name?.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesCategory =
  //       categoryFilter === "전체" || item.category === categoryFilter;
  //     const matchesStatus =
  //       statusFilter === "전체" || item.status === statusFilter;
  //     return matchesSearch && matchesCategory && matchesStatus;
  //   }) || [];

  const keys = createKeyRecord<PartResDto>(data?.data?.content ?? []);
  const columns = [
    { key: keys.code, title: "품목코드", width: "120px" },
    { key: keys.name, title: "품목명" },
    {
      key: "category",
      title: "카테고리",
      width: "250px",
      render: (_value: string, row: PartResDto) =>
        `${row.category || "-"} > ${row.group || "-"}`,
    },
    {
      key: keys.quantity,
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
      key: keys.rop,
      title: "재주문점",
      width: "100px",
      render: (value: number, row: PartResDto) =>
        `${value} ${row.unit || "EA"}`,
    },
    {
      key: keys.status,
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
      key: keys.partValue,
      title: "재고가치",
      width: "120px",
      render: (value: number) => `₩${Number(value).toLocaleString()}`,
    },
    // {
    //   key: "actions",
    //   title: "작업",
    //   width: "150px",
    //   render: (value: any, row: PartResDto) => (
    //     <div className="flex space-x-1">
    //       <Button
    //         variant="default"
    //         size="sm"
    //         onClick={() => handleStockMovement(row.code || "Error", "in")}
    //       >
    //         입고
    //       </Button>
    //       {/* <Button
    //         variant="secondary"
    //         size="sm"
    //         onClick={() => handleLocationUpdate(row.code || "Error")}
    //       >
    //         이동
    //       </Button> */}
    //     </div>
    //   ),
    // },
  ];

  // const totalItems = apiResponse?.data?.length ?? 0;
  // const lowStockItems =
  //   apiResponse?.data?.filter(
  //     (item: PartResDto) => (item.quantity || -1) <= (item.rop || 0),
  //   ).length ?? 0;
  // const criticalItems = apiResponse?.data!.filter(
  //   (item) => item.currentStock <= item.safetyStock,
  // ).length;
  // const totalValue =
  //   apiResponse?.data!.reduce(
  //     (sum, item) => sum + Number(item.partValue!),
  //     0,
  //   ) || 0;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-stack-line"
            label="전체 품목"
            value={0}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-alert-line"
            label="재주문점 이하"
            value={0}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="총 재고가치"
            value={`₩${(0 / 1000000).toFixed(1)}M`}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            console.log("value", value);
            setSearchTerm(value);
          }}
          searchPlaceholder="품목코드, 품목명 검색..."
          filters={[
            {
              key: "category",
              value: categoryFilter,
              options: categoryOptions,
              onChange: (e) => {
                setCategoryFilter(e);
                setGroupFilter("");
              },
            },
            {
              key: "group",
              value: groupFilter,
              options: groupOptions,
              onChange: setGroupFilter,
              disabled: categoryFilter === "",
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
                초기화
              </Button>
            </div>
          }
        />

        {/* 재고 현황 테이블 */}
        <TableSection
          title="재고 현황"
          metaRight={
            <span className="text-sm text-gray-500">
              총 {data?.data?.content?.length ?? 0}개 품목
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
            data={data?.data?.content ?? []}
            loading={isLoading && data === undefined}
            emptyText={
              isLoading && data === undefined
                ? "데이터 로딩 중..."
                : "조건에 맞는 재고가 없습니다"
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
