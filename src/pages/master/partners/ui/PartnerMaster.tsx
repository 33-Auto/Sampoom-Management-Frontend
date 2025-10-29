import { useState } from "react";

import { partnerMasterData } from "@/mocks/factoryData";
import {
  Button,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { usePartnerStats } from "../model/usePartnerStats";

export const PartnerMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const typeOptions = [
    { value: "전체", label: "전체 유형" },
    { value: "고객사", label: "고객사" },
    { value: "공급업체", label: "공급업체" },
  ];

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "활성", label: "활성" },
    { value: "비활성", label: "비활성" },
  ];

  const filteredData = partnerMasterData.filter((partner) => {
    const matchesSearch =
      partner.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.partnerCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "전체" || partner.partnerType === typeFilter;
    const matchesStatus =
      statusFilter === "전체" || partner.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    { key: "partnerCode", title: "거래처 코드", width: "120px" },
    { key: "partnerName", title: "거래처명" },
    {
      key: "partnerType",
      title: "유형",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "고객사"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "businessNumber", title: "사업자번호", width: "130px" },
    { key: "representative", title: "대표자", width: "100px" },
    { key: "contact", title: "연락처", width: "150px" },
    { key: "phone", title: "전화번호", width: "130px" },
    {
      key: "status",
      title: "상태",
      width: "80px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "활성"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // 통계 계산 (훅으로 분리)
  const { totalPartners, activePartners, customers, suppliers } =
    usePartnerStats(partnerMasterData);

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-building-line"
          label="전체 거래처"
          value={totalPartners}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-check-line"
          label="활성 거래처"
          value={activePartners}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon="ri-user-line"
          label="고객사"
          value={customers}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          icon="ri-truck-line"
          label="공급업체"
          value={suppliers}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="거래처명 또는 코드 검색..."
        filters={[
          {
            key: "type",
            value: typeFilter,
            options: typeOptions,
            onChange: setTypeFilter,
          },
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
        ]}
        actions={
          <>
            <Button variant="default" size="sm">
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

      {/* 거래처 목록 테이블 */}
      <TableSection
        title="거래처 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 거래처
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
          emptyText="조건에 맞는 거래처가 없습니다"
        />
      </TableSection>
    </>
  );
};
