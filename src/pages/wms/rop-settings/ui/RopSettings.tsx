import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

export function RopSettings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [groupFilter, setGroupFilter] = useState("전체");
  const [autoOrderFilter, setAutoOrderFilter] = useState("전체");

  // 모든 ROP 설정 데이터
  const allRopSettings = [
    {
      id: 1,
      itemCode: "RM-AL-001",
      itemName: "알루미늄 합금 판재",
      category: "기계",
      group: "현가장치",
      unit: "KG",
      supplier: "한국금속공업",
      currentStock: 120,
      reorderPoint: 75,
      leadTime: 5,
      avgConsumption: 15,
      maxStock: 300,
      status: "active",
      lastUpdated: "2024-01-15",
      autoOrder: "false",
    },
    {
      id: 2,
      itemCode: "CP-BEA-001",
      itemName: "볼 베어링",
      category: "기계",
      group: "동력전달",
      unit: "EA",
      supplier: "베어링코리아",
      currentStock: 45,
      reorderPoint: 50,
      leadTime: 7,
      avgConsumption: 8,
      maxStock: 200,
      status: "active",
      lastUpdated: "2024-01-14",
      autoOrder: "true",
    },
    {
      id: 3,
      itemCode: "RM-PL-001",
      itemName: "플라스틱 원료",
      category: "플라스틱",
      group: "외장재",
      unit: "KG",
      supplier: "플라스틱산업",
      currentStock: 200,
      reorderPoint: 100,
      leadTime: 10,
      avgConsumption: 12,
      maxStock: 500,
      status: "active",
      lastUpdated: "2024-01-13",
      autoOrder: "false",
    },
    {
      id: 4,
      itemCode: "FG-PRD-A01",
      itemName: "LED 헤드라이트",
      category: "전자",
      group: "조명",
      unit: "EA",
      supplier: "자체생산",
      currentStock: 80,
      reorderPoint: 60,
      leadTime: 3,
      avgConsumption: 20,
      maxStock: 150,
      status: "inactive",
      lastUpdated: "2024-01-12",
      autoOrder: "false",
    },
    {
      id: 5,
      itemCode: "CS-TOL-001",
      itemName: "브레이크 디스크",
      category: "안전",
      group: "제동",
      unit: "SET",
      supplier: "공구상사",
      currentStock: 25,
      reorderPoint: 30,
      leadTime: 4,
      avgConsumption: 8,
      maxStock: 100,
      status: "active",
      lastUpdated: "2024-01-11",
      autoOrder: "true",
    },
    {
      id: 6,
      itemCode: "RM-ST-002",
      itemName: "스테인리스 볼트",
      category: "기계",
      group: "동력전달",
      unit: "KG",
      supplier: "스테인리스산업",
      currentStock: 180,
      reorderPoint: 100,
      leadTime: 6,
      avgConsumption: 18,
      maxStock: 400,
      status: "active",
      lastUpdated: "2024-01-10",
      autoOrder: "true",
    },
    {
      id: 7,
      itemCode: "CP-GEA-002",
      itemName: "기어 세트",
      category: "기계",
      group: "동력전달",
      unit: "SET",
      supplier: "기어제조",
      currentStock: 35,
      reorderPoint: 40,
      leadTime: 8,
      avgConsumption: 6,
      maxStock: 150,
      status: "active",
      lastUpdated: "2024-01-09",
      autoOrder: "false",
    },
    {
      id: 8,
      itemCode: "FG-PRD-B02",
      itemName: "시트 패드",
      category: "내장",
      group: "시트",
      unit: "EA",
      supplier: "자체생산",
      currentStock: 150,
      reorderPoint: 80,
      leadTime: 4,
      avgConsumption: 25,
      maxStock: 200,
      status: "active",
      lastUpdated: "2024-01-08",
      autoOrder: "true",
    },
    {
      id: 9,
      itemCode: "EL-CTR-001",
      itemName: "전자 제어 모듈",
      category: "전자",
      group: "제어",
      unit: "EA",
      supplier: "전자공업",
      currentStock: 65,
      reorderPoint: 50,
      leadTime: 5,
      avgConsumption: 10,
      maxStock: 180,
      status: "active",
      lastUpdated: "2024-01-07",
      autoOrder: "true",
    },
    {
      id: 10,
      itemCode: "BRK-PAD-001",
      itemName: "브레이크 패드",
      category: "안전",
      group: "제동",
      unit: "SET",
      supplier: "안전부품",
      currentStock: 90,
      reorderPoint: 70,
      leadTime: 6,
      avgConsumption: 12,
      maxStock: 250,
      status: "active",
      lastUpdated: "2024-01-06",
      autoOrder: "false",
    },
  ];

  // 카테고리 옵션 (ReceivingMaterials와 동일)
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

  // 그룹 옵션 (ReceivingMaterials와 동일)
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
    { value: "true", label: "활성" },
    { value: "false", label: "비활성" },
  ];

  // 필터링된 데이터
  const filteredData = allRopSettings.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      item.itemCode.toLowerCase().includes(term) ||
      item.itemName.toLowerCase().includes(term) ||
      item.supplier.toLowerCase().includes(term);
    const matchesCategory =
      categoryFilter === "전체" || item.category === categoryFilter;
    const matchesGroup = groupFilter === "전체" || item.group === groupFilter;
    const matchesStatus =
      autoOrderFilter === "전체" || item.autoOrder === autoOrderFilter;

    return matchesSearch && matchesCategory && matchesGroup && matchesStatus;
  });

  const handleCreateNew = () => {
    navigate("/wms/rop-settings/create");
  };

  const handleEdit = (id: number) => {
    navigate(`/wms/rop-settings/edit/${id}`);
  };

  const handleDelete = (id: number, itemName: string) => {
    if (window.confirm(`"${itemName}" ROP 설정을 삭제하시겠습니까?`)) {
      // 실제로는 API 호출로 삭제 처리
      alert("ROP 설정이 삭제되었습니다.");
    }
  };

  const columns = [
    { key: "itemCode", title: "품목 코드", width: "120px" },
    { key: "itemName", title: "품목명" },
    {
      key: "category",
      title: "카테고리",
      width: "200px",
      render: (_: any, row: any) => `${row.category} > ${row.group}`,
    },
    { key: "unit", title: "단위", width: "80px" },
    {
      key: "currentStock",
      title: "현재 재고",
      width: "100px",
      render: (value: number) => `${value?.toLocaleString() || 0}`,
    },
    {
      key: "reorderPoint",
      title: "재주문점",
      width: "100px",
      render: (value: number) => `${value?.toLocaleString() || 0}`,
    },
    {
      key: "maxStock",
      title: "최대 재고",
      width: "100px",
      render: (value: number) => `${value?.toLocaleString() || 0}`,
    },
    {
      key: "autoOrder",
      title: "자동 발주",
      width: "100px",
      render: (value: string) => (
        <Badge variant={value === "true" ? "success" : "default"}>
          {value === "true" ? "활성" : "비활성"}
        </Badge>
      ),
    },
    {
      key: "leadTime",
      title: "리드타임",
      width: "100px",
      render: (value: number) => `${value || 0}일`,
    },
    { key: "lastUpdated", title: "최종 수정일", width: "120px" },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row.id)}
          >
            <i className="ri-edit-line"></i>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id, row.itemName)}
          >
            <i className="ri-delete-bin-line"></i>
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalSettings = allRopSettings.length;
  const activeSettings = allRopSettings.filter(
    (item) => item.status === "active",
  ).length;
  const autoOrderSettings = allRopSettings.filter(
    (item) => item.autoOrder,
  ).length;
  const lowStockItems = allRopSettings.filter(
    (item) => item.currentStock <= item.reorderPoint,
  ).length;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-file-list-3-line"
            label="전체 설정"
            value={totalSettings}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-checkbox-circle-line"
            label="활성 설정"
            value={activeSettings}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon="ri-robot-line"
            label="자동 발주"
            value={autoOrderSettings}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            icon="ri-alert-line"
            label="발주 필요"
            value={lowStockItems}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

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
          onSearchChange={setSearchTerm}
          searchPlaceholder="품목 코드, 품목명, 공급업체 검색..."
          filters={[
            {
              key: "category",
              value: categoryFilter,
              options: categoryOptions,
              onChange: (value) => {
                setCategoryFilter(value);
                // 카테고리 변경 시 그룹 필터 초기화
                if (value !== categoryFilter) {
                  setGroupFilter("전체");
                }
              },
            },
            {
              key: "group",
              value: groupFilter,
              options: groupOptions.filter((option) => {
                // 카테고리가 선택된 경우 해당 카테고리의 그룹만 표시
                if (categoryFilter === "전체") {
                  return true;
                }
                const filteredGroups = allRopSettings
                  .filter((item) => item.category === categoryFilter)
                  .map((item) => item.group);
                return (
                  option.value === "전체" ||
                  filteredGroups.includes(option.value)
                );
              }),
              onChange: (value) => setGroupFilter(value),
            },
            {
              key: "autoOrder",
              value: autoOrderFilter,
              options: statusOptions,
              onChange: (value) => setAutoOrderFilter(value),
            },
          ]}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("전체");
                setGroupFilter("전체");
                setAutoOrderFilter("전체");
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
          }
        />

        {/* ROP 설정 목록 */}
        <TableSection
          title={`ROP 설정 목록 (${filteredData.length}개)`}
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
            emptyText="ROP 설정이 없습니다."
          />
        </TableSection>

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
