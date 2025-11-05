import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  usePurchaseOrderQuery,
  useMaterialCategoryQuery,
  useMaterialGroupQuery,
} from "@/pages/wms/purchase-orders/api";
import type {
  PurchaseOrderStatus,
  POResDto,
} from "@/pages/wms/purchase-orders/model";
import { PURCHASE_ORDER_STATUS } from "@/pages/wms/purchase-orders/model";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  Table,
  StatCard,
  InfoBox,
  SearchFilterBar,
  TableSection,
} from "@/shared/ui";

export function WmsPurchaseOrders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const { data, isLoading, isError } = usePurchaseOrderQuery({
    warehouseId: 40,
    keyword: searchTerm === "" ? undefined : searchTerm,
    categoryId: selectedCategory === "" ? undefined : Number(selectedCategory),
    groupId: selectedGroup === "" ? undefined : Number(selectedGroup),
    status:
      statusFilter === "" ? undefined : (statusFilter as PurchaseOrderStatus),
  });

  const { data: categoryData } = useMaterialCategoryQuery();

  const categoryOptions = [
    { value: "", label: "전체 카테고리" },
    ...(categoryData?.data?.map((item) => {
      return { value: String(item.categoryId), label: item.categoryName ?? "" };
    }) ?? []),
  ];

  const { data: groupData } = useMaterialGroupQuery(Number(selectedCategory));
  const groupOptions = [
    { value: "", label: "전체 그룹" },
    ...(groupData?.data?.map((item) => {
      return { value: String(item.groupId), label: item.groupName ?? "" };
    }) ?? []),
  ];

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(PURCHASE_ORDER_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        return { value: value as string, label: key };
      }),
  ];

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig: Record<
      string,
      { label: string; variant: "success" | "info" | "error" | "default" }
    > = {
      PENDING: {
        label: "대기",
        variant: "default",
      },
      CONFIRMED: {
        label: "확인됨",
        variant: "info",
      },
      SHIPPING: {
        label: "배송중",
        variant: "info",
      },
      DELAYED: {
        label: "지연",
        variant: "error",
      },
      PRODUCING: {
        label: "생산중",
        variant: "info",
      },
      ARRIVED: {
        label: "도착",
        variant: "info",
      },
      COMPLETED: {
        label: "완료",
        variant: "success",
      },
      CANCELED: {
        label: "취소",
        variant: "error",
      },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewDetails = (orderNumber?: string) => {
    if (orderNumber) {
      navigate(`/wms/purchase-orders/detail/${orderNumber}`);
    }
  };

  const keys = createKeyRecord<POResDto>(data?.data?.content ?? []);
  const columns = [
    {
      key: keys.orderNumber,
      title: "발주번호",
      width: "120px",
      render: (value: string) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-grey-100">
            {value || "-"}
          </div>
        </div>
      ),
    },
    {
      key: keys.partCode,
      title: "품목코드",
      render: (value: string) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-grey-100">
            {value || "-"}
          </div>
        </div>
      ),
    },
    // {
    //   key: keys.partName,
    //   title: "품목명",
    //   render: (value: string, row: POResDto) => (
    //     <div>
    //       <div className="font-medium text-gray-900 dark:text-grey-100">
    //         {value || "-"}
    //       </div>
    //       <div className="text-xs text-gray-400 dark:text-grey-400">
    //         현재: {row.currQuantity || 0} / ROP: {row.rop || 0}
    //       </div>
    //     </div>
    //   ),
    // },
    {
      key: keys.partName,
      title: "품목명",
      // render: (value: string, row: POResDto) => (
      //   <div>
      //     <div className="font-medium text-gray-900 dark:text-grey-100">
      //       {value || "-"}
      //     </div>
      //     <div className="text-xs text-gray-400 dark:text-grey-400">
      //       현재: {row.currQuantity || 0} / ROP: {row.rop || 0}
      //     </div>
      //   </div>
      // ),
    },
    {
      key: "category",
      title: "카테고리",
      width: "250px",
      render: (_: any, row: POResDto) =>
        `${row.categoryName || "-"} > ${row.groupName || "-"}`,
    },
    {
      key: keys.orderQuantity,
      title: "발주수량",
      width: "100px",
      render: (value: number, row: POResDto) =>
        `${(value || 0).toLocaleString()} ${row.unit || ""}`,
    },
    {
      key: keys.inboundQuantity,
      title: "입고수량",
      width: "100px",
      render: (value: number, row: POResDto) => (
        <span
          className={
            (value || 0) > 0
              ? "font-medium text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-grey-300"
          }
        >
          {(value || 0).toLocaleString()} {row.unit || ""}
        </span>
      ),
    },
    {
      key: keys.restQuantity,
      title: "미입고수량",
      width: "100px",
      render: (value: number, row: POResDto) => {
        const restQty = value || 0;
        return (
          <span
            className={
              restQty > 0
                ? "font-medium text-orange-600 dark:text-orange-400"
                : "text-gray-500 dark:text-grey-300"
            }
          >
            {restQty.toLocaleString()} {row.unit || ""}
          </span>
        );
      },
    },
    {
      key: keys.price,
      title: "발주금액",
      width: "120px",
      render: (value: number) => `₩${(value || 0).toLocaleString()}`,
    },
    {
      key: keys.createdAt,
      title: "처리일",
      width: "100px",
      render: (value: string | null) => (
        <div>
          {value ? (
            <div className="text-sm text-gray-900 dark:text-grey-100">
              {new Date(value).toLocaleDateString()}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-grey-300">-</div>
          )}
        </div>
      ),
    },
    {
      key: keys.orderStatus,
      title: "상태",
      width: "100px",
      render: (_: any, row: POResDto) => getStatusBadge(row.orderStatus),
    },
    {
      key: "actions",
      title: "작업",
      width: "100px",
      render: (_: any, row: POResDto) => (
        <div className="flex space-x-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetails(row.orderNumber)}
          >
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const purchaseOrdersData = data?.data?.content ?? [];
  const completedCount = purchaseOrdersData.filter(
    (item) => item.orderStatus === "COMPLETED",
  ).length;
  const canceledCount = purchaseOrdersData.filter(
    (item) => item.orderStatus === "CANCELED",
  ).length;
  const totalAmount = purchaseOrdersData.reduce(
    (sum, item) => sum + (item.price || 0),
    0,
  );

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 자동화 현황 대시보드 */}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-file-list-line"
            label="전체 발주"
            value={purchaseOrdersData.length}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-check-line"
            label="완료"
            value={completedCount}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon="ri-close-line"
            label="취소"
            value={canceledCount}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="총 발주액"
            value={`₩${(totalAmount / 1000000).toFixed(1)}M`}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* 실시간 모니터링 알림 */}
        <InfoBox
          type="info"
          title="발주 관리 시스템"
          children={
            <div className="flex-1">
              <p className="mt-1 text-sm">
                발주 현황을 모니터링하고 관리할 수 있습니다.
              </p>
            </div>
          }
        />

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            console.log("value", value);
            setSearchTerm(value);
          }}
          searchPlaceholder="발주번호, 품목명 검색..."
          filters={[
            {
              key: "category",
              value: selectedCategory,
              options: categoryOptions,
              onChange: (e) => {
                setSelectedCategory(e);
                setSelectedGroup("");
              },
            },
            {
              key: "group",
              value: selectedGroup,
              options: groupOptions,
              onChange: setSelectedGroup,
              disabled: selectedCategory === "",
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedGroup("");
                  setStatusFilter("");
                }}
              >
                <i className="ri-refresh-line mr-2"></i>
                초기화
              </Button>
            </div>
          }
        />

        {/* 발주 모니터링 테이블 */}

        <TableSection
          title="발주 모니터링"
          metaRight={
            <span className="text-sm text-gray-500">
              총 {data?.data?.content?.length ?? 0}개 발주건
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
                : "조건에 맞는 발주서가 없습니다"
            }
            errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
          />
        </TableSection>
      </div>
    </>
  );
}
