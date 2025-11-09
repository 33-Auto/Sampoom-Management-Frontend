import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMaterialCategoryOptions } from "@/entities/material";
import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import {
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  Badge,
} from "@/shared/ui";

import { useItemsMasterQuery } from "../api/items.api";
import type { ItemResponseDTO } from "../model";

export const ItemMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"전체" | "원자재" | "부품">(
    "전체",
  );
  // 조달 유형/카테고리 필터는 제거

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, setPage, onPageChange, onSizeChange } =
    usePaginationTable({});

  // API 호출
  // 현재 백엔드 API는 두개가 다른 API 엔드포인트를 가지지만
  // 프론트에서는 동시에 표현해야하기 때문에 하나인 것 처럼 동작하기 위해
  // 설정함
  const { data, isError, refetch } = useItemsMasterQuery({
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

  // API 응답 구조: data?.data?.content, data?.data?.totalPages 등
  const items = data?.data?.content || [];
  const totalPages = data?.data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? 0;

  // 필터 옵션 (유형에 따라 다름)
  const materialCategoryOptions = useMaterialCategoryOptions();
  const partCategoryOptions = usePartCategoryOptions();
  const partGroupOptions = usePartGroupOptions(
    selectedType === "부품" && selectedCategoryId
      ? Number(selectedCategoryId)
      : 0,
  );

  const typeOptions = [
    { value: "전체", label: "전체 유형" },
    { value: "원자재", label: "원자재" },
    { value: "부품", label: "부품" },
  ];

  const columns = [
    { key: "code", title: "품목 코드", width: "120px" },
    { key: "name", title: "품목명" },
    {
      key: "categoryName",
      title: "카테고리",
      width: "200px",
      render: (value: string, row: ItemResponseDTO) =>
        `${row.categoryName}` + `${row.groupName ? " > " + row.groupName : ""}`,
    },
    {
      key: "type",
      title: "품목 유형",
      width: "100px",
      render: (value: string) => {
        const displayType =
          value === "MATERIAL" ? "원자재" : value === "PART" ? "부품" : value;
        return (
          <Badge variant={displayType === "원자재" ? "info" : "success"}>
            {displayType}
          </Badge>
        );
      },
    },
    {
      key: "baseQuantity",
      title: "기준 수량",
      width: "100px",
      render: (value: number) => value || 0,
    },
    { key: "unit", title: "단위", width: "80px" },
    {
      key: "leadTime",
      title: "리드 타임",
      width: "100px",
      render: (value: number) => (value ? `${value}일` : "-"),
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="cursor-pointer"
            aria-label="편집"
            onClick={(e) => {
              e.stopPropagation();
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
            }}
          >
            <i className="ri-edit-line" />
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산 (실제 데이터에서 계산)
  const totalItems = totalElements;
  const materialCount = items.filter((item) => item.type === "MATERIAL").length;
  const partCount = items.filter((item) => item.type === "PART").length;
  const leadTimes = items
    .map((item) => item.leadTime)
    .filter((lt): lt is number => lt !== undefined && lt !== null);
  const avgLeadTime =
    leadTimes.length > 0
      ? Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length)
      : 0;

  return (
    <div>
      {isError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          데이터를 불러오는데 실패했습니다.
          <Button
            className="ml-2"
            variant="default"
            size="sm"
            onClick={async () => refetch()}
          >
            다시 시도
          </Button>
        </div>
      )}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-database-line"
          label="전체 품목"
          value={totalItems}
          iconBgColor="bg-main-100"
          iconColor="text-main-600"
        />

        <StatCard
          icon="ri-instance-line"
          label="원자재"
          value={materialCount}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-tools-line"
          label="부품"
          value={partCount}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon="ri-time-line"
          label="평균 리드 타임"
          value={`${avgLeadTime}일`}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>
      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setPage(0); // 검색 변경 시 1페이지로 이동
        }}
        searchPlaceholder="품목 코드, 품목명 검색..."
        filters={(() => {
          const filters = [
            {
              key: "type",
              value: selectedType,
              options: typeOptions,
              onChange: (value: string) => {
                setSelectedType(value as "전체" | "원자재" | "부품");
                setSelectedCategoryId("");
                setSelectedGroupId("");
                setPage(0);
              },
            },
            {
              key: "category",
              value: selectedCategoryId,
              options:
                selectedType === "원자재"
                  ? materialCategoryOptions
                  : selectedType === "부품"
                    ? partCategoryOptions
                    : [{ value: "", label: "전체 카테고리" }],
              onChange: (value: string) => {
                setSelectedCategoryId(value);
                setSelectedGroupId("");
                setPage(0);
              },
              disabled: selectedType === "전체",
            },
            {
              key: "group",
              value: selectedGroupId,
              options: partGroupOptions,
              onChange: (value: string) => {
                setSelectedGroupId(value);
                setPage(0);
              },
              disabled: selectedType !== "부품" || selectedCategoryId === "",
            },
          ];

          return filters;
        })()}
        actions={
          <>
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer"
              onClick={async () => {
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
              }}
            >
              <i className="ri-add-line mr-2"></i>
              신규 등록
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
      <PaginationTableSection
        title="품목 목록"
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
          data={items}
          emptyText="조건에 맞는 품목이 없습니다"
        />
      </PaginationTableSection>
    </div>
  );
};
