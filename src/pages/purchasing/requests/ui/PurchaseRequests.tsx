import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

// 구매 요청 데이터
const purchaseRequestData = [
  {
    requestId: "PR-2024-001",
    requestDate: "2024-01-15",
    itemName: "알루미늄 합금",
    itemCode: "RAW-001",
    requestedQty: 500,
    unit: "KG",
    urgency: "높음",
    requestedBy: "김생산",
    department: "생산부",
    reason: "생산지시 WO-2024-001",
    requiredDate: "2024-01-20",
    estimatedPrice: 2500000,
    status: "승인대기",
    supplier: "대한금속",
  },
  {
    requestId: "PR-2024-002",
    requestDate: "2024-01-15",
    itemName: "고무 시일링",
    itemCode: "RAW-002",
    requestedQty: 200,
    unit: "EA",
    urgency: "보통",
    requestedBy: "이생산",
    department: "생산부",
    reason: "재고 보충",
    requiredDate: "2024-01-25",
    estimatedPrice: 800000,
    status: "승인",
    supplier: "한국고무",
  },
  {
    requestId: "PR-2024-003",
    requestDate: "2024-01-14",
    itemName: "전자 센서",
    itemCode: "COMP-003",
    requestedQty: 50,
    unit: "EA",
    urgency: "높음",
    requestedBy: "박품질",
    department: "품질관리부",
    reason: "불량품 교체",
    requiredDate: "2024-01-18",
    estimatedPrice: 1500000,
    status: "발주완료",
    supplier: "전자부품코리아",
  },
];

export const PurchaseRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [urgencyFilter, setUrgencyFilter] = useState("전체");

  // 헤더 설정
  // 네비게이션 탭 설정
  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "승인대기", label: "승인대기" },
    { value: "승인", label: "승인" },
    { value: "발주완료", label: "발주완료" },
    { value: "반려", label: "반려" },
  ];

  const urgencyOptions = [
    { value: "전체", label: "전체 긴급도" },
    { value: "높음", label: "높음" },
    { value: "보통", label: "보통" },
    { value: "낮음", label: "낮음" },
  ];

  const filteredData = purchaseRequestData.filter((request) => {
    const matchesSearch =
      request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || request.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "전체" || request.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleApprove = (requestId: string) => {
    console.log("구매 요청 승인:", requestId);
  };

  const handleReject = (requestId: string) => {
    console.log("구매 요청 반려:", requestId);
  };

  const handleCreatePO = (requestId: string) => {
    navigate(`/purchasing/orders?from=${requestId}`);
  };

  const columns = [
    { key: "requestId", title: "요청번호", width: "120px" },
    { key: "requestDate", title: "요청일", width: "100px" },
    { key: "itemName", title: "품목명" },
    {
      key: "requestedQty",
      title: "요청수량",
      width: "100px",
      render: (value: number, row: any) => `${value} ${row.unit}`,
    },
    { key: "requestedBy", title: "요청자", width: "100px" },
    { key: "requiredDate", title: "필요일", width: "100px" },
    {
      key: "urgency",
      title: "긴급도",
      width: "100px",
      render: (value: string) => {
        const getUrgencyVariant = (
          urgency: string,
        ): "error" | "warning" | "success" | "default" => {
          switch (urgency) {
            case "높음":
              return "error";
            case "보통":
              return "warning";
            case "낮음":
              return "success";
            default:
              return "default";
          }
        };
        return <Badge variant={getUrgencyVariant(value)}>{value}</Badge>;
      },
    },
    {
      key: "estimatedPrice",
      title: "예상금액",
      width: "120px",
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => {
        const getStatusVariant = (
          status: string,
        ): "info" | "success" | "default" | "error" => {
          switch (status) {
            case "승인대기":
              return "info";
            case "승인":
              return "success";
            case "발주완료":
              return "default";
            case "반려":
              return "error";
            default:
              return "default";
          }
        };
        return <Badge variant={getStatusVariant(value)}>{value}</Badge>;
      },
    },
    {
      key: "actions",
      title: "작업",
      width: "180px",
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          {row.status === "승인대기" && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApprove(row.requestId)}
              >
                승인
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(row.requestId)}
              >
                반려
              </Button>
            </>
          )}
          {row.status === "승인" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleCreatePO(row.requestId)}
            >
              발주생성
            </Button>
          )}
          <Button variant="secondary" size="sm">
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalRequests = purchaseRequestData.length;
  const pendingApproval = purchaseRequestData.filter(
    (req) => req.status === "승인대기",
  ).length;
  const approved = purchaseRequestData.filter(
    (req) => req.status === "승인",
  ).length;
  const totalAmount = purchaseRequestData.reduce(
    (sum, req) => sum + req.estimatedPrice,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-line"
          label="전체 요청"
          value={totalRequests}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-time-line"
          label="승인 대기"
          value={pendingApproval}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-check-line"
          label="승인 완료"
          value={approved}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-money-dollar-circle-line"
          label="총 요청액"
          value={`₩${(totalAmount / 1000000).toFixed(0)}M`}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="요청번호, 품목명, 요청자 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
          {
            key: "urgency",
            value: urgencyFilter,
            options: urgencyOptions,
            onChange: setUrgencyFilter,
          },
        ]}
        actions={
          <>
            <Button variant="default" size="sm">
              <i className="ri-add-line mr-2"></i>
              신규 요청
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </>
        }
      />

      {/* 구매 요청 목록 테이블 */}
      <TableSection
        title="구매 요청 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 요청
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
          data={filteredData}
          emptyText="조건에 맞는 구매요청이 없습니다"
        />
      </TableSection>
    </div>
  );
};
