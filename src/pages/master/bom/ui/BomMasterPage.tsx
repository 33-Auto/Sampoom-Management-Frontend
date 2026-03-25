import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import { useBomsQuery } from "@/pages/master/bom/api";
import type { BomResponseDTO } from "@/pages/master/bom/model";
import { BOM_COMPLEXITY, BOM_STATUS } from "@/pages/master/bom/model";
import { usePaginationTable } from "@/shared/lib";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  SearchFilterBar,
  PaginationTableSection,
  InfoBox,
  Table,
} from "@/shared/ui";

export const BomMasterPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryIdFilter, setCategoryIdFilter] = useState<string>("");
  const [groupIdFilter, setGroupIdFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [complexityFilter, setComplexityFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const { data, isLoading, isError, refetch } = useBomsQuery({
    keyword: searchTerm === "" ? undefined : searchTerm,
    categoryId: categoryIdFilter === "" ? undefined : Number(categoryIdFilter),
    groupId: groupIdFilter === "" ? undefined : Number(groupIdFilter),
    status:
      statusFilter === ""
        ? undefined
        : (statusFilter as
            | "ACTIVE"
            | "REVIEWING"
            | "INACTIVE"
            | "PENDING_APPROVAL"),
    complexity:
      complexityFilter === ""
        ? undefined
        : (complexityFilter as "SIMPLE" | "NORMAL" | "COMPLEX"),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const categoryOptions = usePartCategoryOptions();
  const groupOptions = usePartGroupOptions(
    categoryIdFilter ? Number(categoryIdFilter) : 0,
  );
  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(BOM_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "활성",
          REVIEWING: "검토중",
          INACTIVE: "비활성",
          PENDING_APPROVAL: "승인대기",
        };
        return {
          value: value as string,
          label: statusLabels[key] || key,
        };
      }),
  ];

  const complexityOptions = [
    { value: "", label: "전체 복잡도" },
    ...Object.entries(BOM_COMPLEXITY)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const complexityLabels: Record<string, string> = {
          SIMPLE: "단순",
          NORMAL: "보통",
          COMPLEX: "복잡",
        };
        return {
          value: value as string,
          label: complexityLabels[key] || key,
        };
      }),
  ];

  const handleCreateNew = () => {
    navigate("/master/bom/process");
  };

  const handleViewDetail = (row: BomResponseDTO) => {
    navigate(`/master/bom/process/${row.id}`, {
      state: { bomData: row },
    });
  };

  const keys = createKeyRecord<BomResponseDTO>(data?.data?.content ?? []);

  const columns = [
    { key: keys.bomCode, title: "BOM 코드", width: "120px" },
    { key: keys.partName, title: "제품명" },
    { key: keys.categoryName, title: "카테고리", width: "150px" },
    { key: keys.groupName, title: "그룹", width: "120px" },
    { key: keys.version, title: "버전", width: "80px" },
    {
      key: keys.status,
      title: "상태",
      width: "100px",
      render: (value: string) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "활성",
          REVIEWING: "검토중",
          INACTIVE: "비활성",
          PENDING_APPROVAL: "승인대기",
        };
        const getStatusVariant = (
          status: string,
        ): "success" | "default" | "error" | "warning" => {
          switch (status) {
            case "ACTIVE":
              return "success";
            case "REVIEWING":
              return "warning";
            case "PENDING_APPROVAL":
              return "default";
            case "INACTIVE":
              return "default";
            default:
              return "default";
          }
        };
        return (
          <Badge variant={getStatusVariant(value)}>
            {statusLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: keys.complexity,
      title: "복잡도",
      width: "100px",
      render: (value: string) => {
        const complexityLabels: Record<string, string> = {
          SIMPLE: "단순",
          NORMAL: "보통",
          COMPLEX: "복잡",
        };
        const getComplexityVariant = (
          complexity: string,
        ): "success" | "default" | "error" | "warning" => {
          switch (complexity) {
            case "SIMPLE":
              return "success";
            case "NORMAL":
              return "warning";
            case "COMPLEX":
              return "error";
            default:
              return "default";
          }
        };
        return (
          <Badge variant={getComplexityVariant(value)}>
            {complexityLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: keys.componentCount,
      title: "구성품 수",
      width: "100px",
      render: (value: number) => `${value || 0}개`,
    },
    {
      key: keys.totalCost,
      title: "총 비용",
      width: "120px",
      render: (value: number) =>
        value ? `₩${Number(value).toLocaleString()}` : "-",
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_value: any, row: BomResponseDTO) => {
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetail(row)}
          >
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        );
      },
    },
  ];

  const boms = data?.data?.content ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* BOM 관리 안내 */}
      <InfoBox type="info" title="BOM 관리 안내">
        <p className="mb-1">
          • <strong>BOM 구조:</strong> 제품을 구성하는 모든 원자재, 부품의
          계층적 구조와 수량 정보
        </p>
        <p className="mb-1">
          • <strong>원가 계산:</strong> 구성품의 표준 단가를 기반으로 제품 총
          원가 자동 계산
        </p>
        <p>
          • <strong>생산 계획:</strong> MRP 시스템에서 소요량 계산과 생산 일정
          수립의 기준 데이터
        </p>
      </InfoBox>

      {/* 복잡도별 관리 안내 */}
      <InfoBox type="success" title="BOM 복잡도 분류" className="mt-4">
        <p className="mb-1">
          • <strong>단순 BOM:</strong> 1-5개 구성품, 단일 레벨 구조, 빠른 승인
          프로세스
        </p>
        <p className="mb-1">
          • <strong>보통 BOM:</strong> 6-15개 구성품, 2-3 레벨 구조, 표준 검토
          프로세스
        </p>
        <p>
          • <strong>복잡 BOM:</strong> 16개 이상 구성품, 다단계 구조, 엄격한
          승인 프로세스
        </p>
      </InfoBox>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="BOM 코드 또는 제품명 검색..."
        filters={[
          {
            key: "categoryId",
            value: categoryIdFilter,
            options: categoryOptions,
            onChange: (e) => {
              setCategoryIdFilter(e);
              setGroupIdFilter(""); // 카테고리 변경 시 그룹 초기화
              onPageChange(0);
            },
          },
          {
            key: "groupId",
            value: groupIdFilter,
            options: groupOptions,
            onChange: (e) => {
              setGroupIdFilter(e);
              onPageChange(0);
            },
            disabled: !categoryIdFilter, // 카테고리 선택 전에는 비활성화
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
          {
            key: "complexity",
            value: complexityFilter,
            options: complexityOptions,
            onChange: (e) => {
              setComplexityFilter(e);
              onPageChange(0);
            },
          },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm("");
                setCategoryIdFilter("");
                setGroupIdFilter("");
                setStatusFilter("");
                setComplexityFilter("");
                onPageChange(0);
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
            <Button variant="default" onClick={handleCreateNew}>
              <i className="ri-add-line mr-2"></i>
              신규 등록
            </Button>
          </>
        }
      />

      {/* BOM 목록 테이블 */}
      <PaginationTableSection
        title="BOM 목록"
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
          data={boms}
          loading={isLoading && data === undefined}
          emptyText={
            isLoading && data === undefined
              ? "데이터 로딩 중..."
              : "조건에 맞는 BOM이 없습니다"
          }
          errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
        />
      </PaginationTableSection>
    </div>
  );
};
