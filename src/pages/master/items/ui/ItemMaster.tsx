import { useNavigate } from "react-router-dom";import { useMaterialCategoryOptions } from "@/entities/material";import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";import { MasterListLayout, useMasterListControls } from "@/features/master-list";import { Button, InfoBox } from "@/shared/ui";import { useItemsMasterQuery } from "../api/items.api";import type { ItemResponseDTO } from "../model";import { createItemColumns, createItemFilters } from "./masterListConfig";export const ItemMaster = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    pagination,
  } = useMasterListControls([
    { key: "type", initialValue: "전체" },
    { key: "category" },
    { key: "group" },
  ]);

  const selectedType = (filters.type as "전체" | "원자재" | "부품") ?? "전체";
  const selectedCategoryId = filters.category ?? "";
  const selectedGroupId = filters.group ?? "";
  const { page, size, onPageChange, onSizeChange } = pagination;

  const materialCategoryOptions = useMaterialCategoryOptions();
  const partCategoryOptions = usePartCategoryOptions();
  const partGroupOptions = usePartGroupOptions(
    selectedType === "부품" && selectedCategoryId
      ? Number(selectedCategoryId)
      : 0,
  );

  const { data, isError, isLoading, refetch } = useItemsMasterQuery({
    type:
      selectedType === "전체"
        ? "ALL"
        : selectedType === "원자재"
          ? "MATERIAL"
          : "PART",
    keyword: searchTerm || undefined,
    materialCategoryId:
      selectedType === "원자재" && selectedCategoryId
        ? Number(selectedCategoryId)
        : undefined,
    partCategoryId:
      selectedType === "부품" && selectedCategoryId
        ? Number(selectedCategoryId)
        : undefined,
    partGroupId:
      selectedType === "부품" && selectedGroupId
        ? Number(selectedGroupId)
        : undefined,
    page,
    size,
  });

  const items = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? 0;

  const handleCreateNew = () => {
    const defaultType =
      selectedType === "원자재"
        ? "MATERIAL"
        : selectedType === "부품"
          ? "PART"
          : undefined;

    navigate("/master/items/process", {
      state: {
        itemType: defaultType,
        categoryId:
          defaultType === "MATERIAL" && selectedCategoryId
            ? Number(selectedCategoryId)
            : defaultType === "PART" && selectedCategoryId
              ? Number(selectedCategoryId)
              : undefined,
        categoryName: undefined,
        groupId:
          defaultType === "PART" && selectedGroupId
            ? Number(selectedGroupId)
            : undefined,
        groupName: undefined,
      },
    });
  };

  const handleEditItem = (row: ItemResponseDTO) => {
    const itemType = row.type === "MATERIAL" ? "MATERIAL" : "PART";
    navigate(`/master/items/process/${row.id}`, {
      state: {
        itemType,
        categoryId: row.categoryId ?? undefined,
        categoryName: row.categoryName ?? undefined,
        groupId: row.groupId ?? undefined,
        groupName: row.groupName ?? undefined,
        item: row,
      },
    });
  };

  const columns = createItemColumns({
    onEdit: handleEditItem,
  });

  const filtersConfig = createItemFilters({
    selectedType,
    categoryValue: selectedCategoryId,
    groupValue: selectedGroupId,
    materialCategoryOptions,
    partCategoryOptions,
    partGroupOptions,
    onTypeChange: (value) => {
      handleFilterChange("type", value);
      handleFilterChange("category", "");
      handleFilterChange("group", "");
    },
    onCategoryChange: (value) => {
      handleFilterChange("category", value);
      handleFilterChange("group", "");
    },
    onGroupChange: (value) => handleFilterChange("group", value),
  });

  return (
    <MasterListLayout
      title="품목 목록"
      headerSlot={
        <div className="space-y-4">
          {isError && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              데이터를 불러오는데 실패했습니다.
              <Button
                className="ml-2"
                variant="default"
                size="sm"
                onClick={async () => {
                  await refetch();
                }}
              >
                다시 시도
              </Button>
            </div>
          )}
          <InfoBox type="info" title="리드 타임 관리 안내">
            <p className="mb-1">
              • <strong>구매 리드 타임:</strong> 발주부터 입고까지의 총 일수
              (공급처 생산 + 운송 + 검사 시간 포함)
            </p>
            <p className="mb-1">
              • <strong>생산 리드 타임:</strong> 생산 지시부터 완성까지의 총
              일수 (Setup + 가공 + 대기 시간 포함)
            </p>
            <p>
              • <strong>MRP 시스템:</strong> 이 리드 타임을 기반으로 역방향 일정
              계획(Backward Scheduling)을 수행합니다
            </p>
          </InfoBox>
          <InfoBox type="success" title="공정 기반 리드 타임 자동 계산">
            <p className="mb-1">
              • <strong>생산 리드 타임:</strong> 공정 마스터의 준비시간 +
              가공시간 + 대기시간을 자동 합산
            </p>
            <p className="mb-1">
              • <strong>동적 계산:</strong> 생산 수량에 따라 실시간으로 총
              소요시간 계산
            </p>
            <p>
              • <strong>정확한 일정:</strong> 작업장별 능력을 반영한 정밀한 생산
              스케줄링 지원
            </p>
          </InfoBox>
        </div>
      }
      search={{
        term: searchTerm,
        onChange: handleSearchChange,
        placeholder: "품목 코드, 품목명 검색...",
      }}
      filters={filtersConfig}
      actions={
        <Button variant="default" size="sm" onClick={handleCreateNew}>
          <i className="ri-add-line mr-2"></i>
          신규 등록
        </Button>
      }
      table={{
        columns,
        data: items,
        loading: isLoading && data === undefined,
        emptyText: "조건에 맞는 품목이 없습니다",
        errorText: isError ? "데이터 로딩 중 오류가 발생했습니다." : "",
      }}
      pagination={{
        totalElements,
        page,
        totalPages,
        size,
        onPageChange,
        onSizeChange,
        showRefresh: true,
        onRefresh: refetch,
      }}
    />
  );
};
