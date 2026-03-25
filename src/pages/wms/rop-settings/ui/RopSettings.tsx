import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import { type RopSettings as RopResDto } from "@/entities/rop";
import { useBranchId, useBranchSelectionStore } from "@/features/branch-select";
import {
  type RopSettingsListQueryParams,
  useRopSettingsQuery,
} from "@/pages/wms/rop-settings/api";
import { usePaginationTable } from "@/shared/lib";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  Table,
  PaginationTableSection,
} from "@/shared/ui";

export function RopSettings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, onPageChange, onSizeChange, setPage } =
    usePaginationTable({});

  const { defaultWarehouseId } = useLoaderData() as {
    defaultWarehouseId?: number;
  };
  const selectedWarehouseId = useBranchId("wms");
  const setBranchSelection = useBranchSelectionStore(
    (state) => state.setSelection,
  );
  const warehouseId = selectedWarehouseId
    ? Number(selectedWarehouseId)
    : undefined;

  const queryParams = useMemo<RopSettingsListQueryParams | undefined>(() => {
    if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
      return undefined;
    }
    return {
      warehouseId,
      keyword: searchTerm === "" ? undefined : searchTerm,
      categoryId: categoryFilter === "" ? undefined : Number(categoryFilter),
      groupId: groupFilter === "" ? undefined : Number(groupFilter),
      autoOrderStatus:
        statusFilter === ""
          ? undefined
          : statusFilter === "활성"
            ? "ACTIVE"
            : "INACTIVE",
      page,
      size,
    };
  }, [
    warehouseId,
    searchTerm,
    categoryFilter,
    groupFilter,
    statusFilter,
    page,
    size,
  ]);

  const { data, isLoading, isError, refetch } =
    useRopSettingsQuery(queryParams);

  useEffect(() => {
    if (
      typeof defaultWarehouseId === "number" &&
      Number.isFinite(defaultWarehouseId)
    ) {
      const defaultIdString = String(defaultWarehouseId);
      if (!selectedWarehouseId) {
        setBranchSelection("wms", defaultIdString);
      }
    }
  }, [defaultWarehouseId, selectedWarehouseId, setBranchSelection]);

  useEffect(() => {
    setPage(0);
  }, [warehouseId, setPage]);

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const categoryOptions = usePartCategoryOptions();

  const groupOptions = usePartGroupOptions(
    categoryFilter === "" ? 0 : Number(categoryFilter),
  );

  const statusOptions = [
    { value: "", label: "전체 상태" },
    { value: "ACTIVE", label: "활성" },
    { value: "INACTIVE", label: "비활성" },
  ];

  const handleCreateNew = () => {
    navigate("/wms/rop-settings/process");
  };

  const handleViewDetail = (row: RopResDto) => {
    console.log(row);
    navigate(`/wms/rop-settings/process/${row.ropId}`, {
      state: { ropData: row },
    });
  };

  const keys = createKeyRecord<RopResDto>(data?.data?.content ?? []);
  const columns = [
    { key: keys.partCode, title: "품목 코드", width: "120px" },
    { key: keys.partName, title: "품목명" },
    {
      key: "category",
      title: "카테고리",
      width: "200px",
      render: (_value: string, row: RopResDto) =>
        `${row.categoryName || "-"} > ${row.groupName || "-"}`,
    },
    { key: keys.unit, title: "단위", width: "80px" },
    {
      key: keys.quantity,
      title: "현재 재고",
      width: "100px",
      render: (value: number) => `${value?.toLocaleString() || 0}`,
    },
    {
      key: keys.rop,
      title: "재주문점",
      width: "100px",
      render: (value: number) => `${value?.toLocaleString() || 0}`,
    },
    {
      key: keys.maxStock,
      title: "최대 재고",
      width: "100px",
      render: (value: number) => `${value?.toLocaleString() || "-"}`,
    },
    {
      key: keys.autoOrderStatus,
      title: "자동 발주",
      width: "100px",
      render: (value: string) => {
        return (
          <Badge variant={value === "활성" ? "success" : "default"}>
            {value === "활성" ? "활성" : "비활성"}
          </Badge>
        );
      },
    },
    {
      key: keys.leadTime,
      title: "리드타임",
      width: "100px",
      render: (value: number) => `${value || "-"}일`,
    },
    {
      key: keys.updatedAt,
      title: "최종 수정일",
      width: "120px",
      render: (value: string) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString("ko-KR");
      },
    },
    {
      key: "actions",
      title: "작업",
      width: "100px",
      render: (_value: any, row: RopResDto) => {
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetail(row)}
          >
            상세
          </Button>
        );
      },
    },
  ];

  const ropSettings = data?.data?.content ?? [];

  if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <InfoBox type="info" title="창고 선택 필요">
          <p className="text-sm">
            상단에서 창고를 선택하면 ROP 설정을 확인할 수 있습니다.
          </p>
        </InfoBox>
      </div>
    );
  }

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ROP 자동 계산 섹션 */}
        <InfoBox type="info" title="ROP 자동 계산">
          <div className="flex items-center justify-around">
            <div className="flex-1">
              <p className="text-sm">
                과거 데이터를 기반으로 리드타임과 평균 소비량을 자동으로
                계산합니다.
              </p>
            </div>

            <div className="ml-4 flex space-x-3">
              <Button variant="default" onClick={handleCreateNew}>
                <i className="ri-add-line mr-2"></i>
                신규 ROP 설정
              </Button>
            </div>
          </div>
        </InfoBox>

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            onPageChange(0);
          }}
          searchPlaceholder="품목 코드, 품목명 검색..."
          filters={[
            {
              key: "category",
              value: categoryFilter,
              options: categoryOptions,
              onChange: (e) => {
                setCategoryFilter(e);
                setGroupFilter("");
                onPageChange(0);
              },
            },
            {
              key: "group",
              value: groupFilter,
              options: groupOptions,
              onChange: (e) => {
                setGroupFilter(e);
                onPageChange(0);
              },
              disabled: categoryFilter === "",
            },
            {
              key: "status",
              value: statusFilter,
              options: statusOptions,
              onChange: (e) => {
                setStatusFilter(e);
                onPageChange(0);
              },
            },
          ]}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setGroupFilter("");
                setStatusFilter("");
                onPageChange(0);
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
          }
        />

        {/* ROP 설정 목록 */}
        <PaginationTableSection
          title="ROP 설정 목록"
          totalElements={totalElements}
          page={page}
          totalPages={totalPages}
          size={size}
          onSizeChange={onSizeChange}
          onPageChange={onPageChange}
          showRefresh
          onRefresh={refetch}
        >
          <Table
            columns={columns}
            data={ropSettings}
            loading={isLoading && data === undefined}
            emptyText={
              isLoading && data === undefined
                ? "데이터 로딩 중..."
                : "ROP 설정이 없습니다."
            }
            errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
          />
        </PaginationTableSection>

        {/* ROP 계산 공식 안내 */}
        <InfoBox type="info" title="ROP 계산 공식" className="mt-6">
          <div className="space-y-2 text-sm">
            <p>
              <strong>재주문점(ROP) = 평균 일일 소비량 × 리드 타임</strong>
            </p>
            <p>
              • 평균 일일 소비량: 과거 출고 이력을 기반으로 계산된 하루 평균
              사용량
            </p>
            <p>• 리드 타임: 발주부터 입고까지 소요되는 기간</p>
            <p>• 최대 재고: 발주 시 보유할 최대 수량 (Min-Max 정책)</p>
          </div>
        </InfoBox>
      </div>
    </>
  );
}
