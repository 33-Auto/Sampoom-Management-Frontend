import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  useNavigate,
  // useLoaderData
} from "react-router-dom";

import {
  Button,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { queryOptions as receivingQueryOptions } from "../api/receiving.api";

export function ReceivingMaterials() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedGroup, setSelectedGroup] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [selectedPriority, setSelectedPriority] = useState("전체");

  // useLoaderData : 라우터에서 데이터 처리
  // reactQuery : 컴포넌트 단에서 처리
  // const { receiving: receivingPromise } = useLoaderData() as {
  //   receiving: Promise<{ data: (typeof receivingData)[] }>;
  // }

  const { data, isLoading, isError, error } = useQuery(receivingQueryOptions);

  const filterdData = data?.data?.filter((item: any) => {
    const matchesSearch =
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || item.category === selectedCategory;
    const matchesGroup =
      selectedGroup === "전체" || item.group === selectedGroup;
    const matchesStatus =
      statusFilter === "전체" || item.status === statusFilter;
    const matchesPriority =
      selectedPriority === "전체" || item.priority === selectedPriority;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesGroup &&
      matchesStatus &&
      matchesPriority
    );
  });

  const categoryOptions = [
    { value: "전체", label: "전체 카테고리" },
    { value: "안전", label: "안전" },
    { value: "섀시", label: "섀시" },
    { value: "기계", label: "기계" },
    { value: "전기", label: "전기" },
    { value: "내장", label: "내장" },
    { value: "플라스틱", label: "플라스틱" },
    { value: "전자", label: "전자" },
  ];

  const groupOptions = [
    { value: "전체", label: "전체 그룹" },
    { value: "제동", label: "제동" },
    { value: "현가장치", label: "현가장치" },
    { value: "동력전달", label: "동력전달" },
    { value: "조명", label: "조명" },
    { value: "시트", label: "시트" },
    { value: "외장재", label: "외장재" },
    { value: "제어", label: "제어" },
  ];

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "입고대기", label: "입고 대기" },
    { value: "부분입고", label: "부분 입고" },
    { value: "입고완료", label: "입고 완료" },
  ];

  const priorityOptions = [
    { value: "전체", label: "전체 우선순위" },
    { value: "높음", label: "높음" },
    { value: "보통", label: "보통" },
    { value: "낮음", label: "낮음" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "입고대기":
        return "bg-yellow-100 text-yellow-800";
      case "부분입고":
        return "bg-blue-100 text-blue-800";
      case "입고완료":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음":
        return "bg-red-100 text-red-800";
      case "보통":
        return "bg-yellow-100 text-yellow-800";
      case "낮음":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    { key: "code", title: "입주코드", width: "120px" },
    { key: "name", title: "품목명", width: "250px" },
    {
      key: "category",
      title: "카테고리",
      width: "250px",
      render: (_: any, row: any) => `${row.category} > ${row.group}`,
    },
    { key: "currentStock", title: "현재입고수량", width: "120px" },
    { key: "dates", title: "일정", width: "150px" },
    {
      key: "status",
      title: "상태",
      width: "120px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(value)}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "priority",
      title: "우선순위",
      width: "120px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(value)}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_: any, row: any) => (
        <Button
          variant="default"
          size="sm"
          onClick={async () => navigate(`/wms/receiving/process/${row.id}`)}
        >
          입고처리
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-3-line"
          label="전체 입고건"
          value={100000}
          iconBgColor="bg-main-100"
          iconColor="text-main-600"
        />
        <StatCard
          icon="ri-time-line"
          label="입고 대기"
          value={5000}
          iconBgColor="bg-main-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          icon="ri-stack-line"
          label="부분 입고"
          value={250}
          iconBgColor="bg-main-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-checkbox-circle-line"
          label="입고 완료"
          value={9750}
          iconBgColor="bg-main-100"
          iconColor="text-green-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="품목 코드, 품목명 검색..."
        filters={[
          {
            key: "category",
            value: selectedCategory,
            options: categoryOptions,
            onChange: (value) => setSelectedCategory(value),
          },
          {
            key: "group",
            value: selectedGroup,
            options: groupOptions,
            onChange: (value) => setSelectedGroup(value),
          },
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: (value) => setStatusFilter(value),
          },
          {
            key: "priority",
            value: selectedPriority,
            options: priorityOptions,
            onChange: (value) => setSelectedPriority(value),
          },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("전체");
              setSelectedGroup("전체");
              setStatusFilter("전체");
              setSelectedPriority("전체");
            }}
          >
            <i className="ri-refresh-line mr-2"></i>
            초기화
          </Button>
        }
      />

      {/* 입고 목록 테이블 */}
      <TableSection
        title="입고 목록"
        metaRight={
          <span className="text-sm text-gray-500">총 100000개 입고건</span>
        }
        actionsRight={
          <Button variant={"secondary"} size={"sm"}>
            <i className="ri-refresh-line mr-2"></i>
            새로고침
          </Button>
        }
      >
        <Table
          columns={columns}
          data={filterdData ?? []}
          loading={isLoading}
          errorText={isError ? (error as Error).message : ""}
          emptyText="조건에 맞는 입고건이 없습니다"
        />
      </TableSection>
    </div>
  );
}
