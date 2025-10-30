import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { useGetItemsMasterQuery } from "../api/items.api";
import {
  useMaterialCategoriesQuery,
  usePartCategoriesQuery,
  usePartGroupsQuery,
} from "../create/api/create.api";
import { useItemStats } from "../model/useItemStats";
// Modal-based components removed; using page navigation instead

export const ItemMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"전체" | "원자재" | "부품">(
    "전체",
  );
  // 조달 유형/카테고리 필터는 제거
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  // API 호출
  const { data, /* isLoading: _isLoading, */ isError, refetch } =
    useGetItemsMasterQuery({
      type: selectedType === "전체" ? "ALL" : selectedType,
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

  const items = data?.items || [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  // category/group filter options based on type
  const { data: materialCategories } = useMaterialCategoriesQuery();
  const { data: partCategories } = usePartCategoriesQuery();
  const { data: partGroups } = usePartGroupsQuery(
    selectedType === "부품" && selectedCategoryId
      ? Number(selectedCategoryId)
      : undefined,
  );

  // 카테고리 옵션 제거

  const typeOptions = [
    { value: "전체", label: "전체 유형" },
    { value: "원자재", label: "원자재" },
    { value: "부품", label: "부품" },
  ];

  // 조달 유형 옵션 제거

  // 서버 검색/필터를 사용하므로 클라이언트 필터는 제거
  const filteredData = items;

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
              : "bg-teal-100 text-teal-800"
          }`}
        >
          {value}
        </span>
      ),
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
      render: (_: any, row: any) => {
        let leadTime: number | null = null;
        if (row.procurementType === "구매") {
          leadTime = row.purchaseLeadTime;
        } else if (row.procurementType === "생산") {
          leadTime = row.calculatedProductionLeadTime ?? row.productionLeadTime;
        }
        return leadTime ? `${leadTime}일` : "-";
      },
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
            aria-label="편집"
            onClick={(e) => {
              e.stopPropagation();
              const type = row.itemType === "원자재" ? "MATERIAL" : "PART";
              navigate(`/master/items/${type}/${row.id}/edit`, {
                state: { item: row },
              });
            }}
          >
            <i className="ri-edit-line" />
          </Button>
        </div>
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
  } = useItemStats(items as any);

  return (
    <>
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
        onSearchChange={(v) => {
          setSearchTerm(v);
          setPage(0); // 검색 변경 시 1페이지로 이동
        }}
        searchPlaceholder="키워드(코드/이름) 검색..."
        filters={(() => {
          const list: any[] = [
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
          ];

          // Unified Category filter (options depend on type)
          const categoryOptionsDynamic =
            selectedType === "원자재"
              ? [{ value: "", label: "전체 카테고리" }].concat(
                  (materialCategories || []).map(
                    (c: { id: number; name: string }) => ({
                      value: String(c.id),
                      label: c.name,
                    }),
                  ),
                )
              : selectedType === "부품"
                ? [{ value: "", label: "전체 카테고리" }].concat(
                    (partCategories || []).map(
                      (c: { categoryId: number; categoryName: string }) => ({
                        value: String(c.categoryId),
                        label: c.categoryName,
                      }),
                    ),
                  )
                : [{ value: "", label: "카테고리 (유형을 먼저 선택)" }];

          list.push({
            key: "category",
            value: selectedCategoryId,
            options: categoryOptionsDynamic,
            onChange: (v: string) => {
              setSelectedCategoryId(v);
              setSelectedGroupId("");
              setPage(0);
            },
            disabled: selectedType === "전체",
          });

          // Group filter (only meaningful for PART)
          const partGrpOptions = [{ value: "", label: "전체 그룹" }].concat(
            (partGroups || []).map(
              (g: { groupId: number; groupName: string }) => ({
                value: String(g.groupId),
                label: g.groupName,
              }),
            ),
          );
          list.push({
            key: "group",
            value: selectedGroupId,
            options: partGrpOptions,
            onChange: (v: string) => {
              setSelectedGroupId(v);
              setPage(0);
            },
            disabled: !(selectedType === "부품" && selectedCategoryId),
          });

          return list;
        })()}
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
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>
              총 {totalElements}개 / 페이지 {page + 1} /{" "}
              {Math.max(totalPages, 1)}
            </span>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              {[10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}/page
                </option>
              ))}
            </select>
          </div>
        }
        actionsRight={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={async () => refetch()}>
              <i className="ri-refresh-line mr-2"></i>
              새로고침
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0}
              >
                이전
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    totalPages ? Math.min(totalPages - 1, p + 1) : p + 1,
                  )
                }
                disabled={totalPages ? page >= totalPages - 1 : false}
              >
                다음
              </Button>
            </div>
          </div>
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
