import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { workCenterMasterData } from "@/mocks/factoryData";
import { Button, Input, Select, Table } from "@/shared/ui";

export default function WorkCenterMaster() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const typeOptions = [
    { value: "전체", label: "전체 유형" },
    { value: "내부 설비", label: "내부 설비" },
    { value: "외주 가공처", label: "외주 가공처" },
    { value: "검사 설비", label: "검사 설비" },
  ];

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "가동", label: "가동" },
    { value: "정비", label: "정비" },
    { value: "중단", label: "중단" },
  ];

  const filteredData = workCenterMasterData.filter((item) => {
    const matchesSearch =
      item.workCenterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.workCenterCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "전체" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "전체" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    { key: "workCenterCode", title: "작업장 코드", width: "120px" },
    { key: "workCenterName", title: "작업장명" },
    {
      key: "type",
      title: "유형",
      width: "120px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "내부 설비"
              ? "bg-blue-100 text-blue-800"
              : value === "외주 가공처"
                ? "bg-orange-100 text-orange-800"
                : "bg-purple-100 text-purple-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "dailyCapacity",
      title: "일일 가용시간",
      width: "120px",
      render: (value: number) => `${value}시간`,
    },
    {
      key: "efficiency",
      title: "효율",
      width: "80px",
      render: (value: number) => `${value}%`,
    },
    {
      key: "hourlyRate",
      title: "시간당 비용",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString()}`,
    },
    {
      key: "status",
      title: "상태",
      width: "80px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "가동"
              ? "bg-green-100 text-green-800"
              : value === "정비"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalWorkCenters = workCenterMasterData.length;
  const activeWorkCenters = workCenterMasterData.filter(
    (item) => item.status === "가동",
  ).length;
  const internalWorkCenters = workCenterMasterData.filter(
    (item) => item.type === "내부 설비",
  ).length;
  const externalWorkCenters = workCenterMasterData.filter(
    (item) => item.type === "외주 가공처",
  ).length;
  const totalCapacity = workCenterMasterData
    .filter((item) => item.status === "가동")
    .reduce(
      (sum, item) => sum + (item.dailyCapacity * item.efficiency) / 100,
      0,
    );
  const avgHourlyRate = Math.round(
    workCenterMasterData.reduce((sum, item) => sum + item.hourlyRate, 0) /
      totalWorkCenters,
  );

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-main-100">
              <i className="ri-tools-line text-xl text-main-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 작업장</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalWorkCenters}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <i className="ri-play-circle-line text-xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">가동 중</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeWorkCenters}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <i className="ri-building-line text-xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">내부 설비</p>
              <p className="text-2xl font-bold text-gray-900">
                {internalWorkCenters}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <i className="ri-truck-line text-xl text-orange-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">외주 가공처</p>
              <p className="text-2xl font-bold text-gray-900">
                {externalWorkCenters}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <i className="ri-time-line text-xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 가용능력</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(totalCapacity)}h
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
              <i className="ri-money-dollar-circle-line text-xl text-teal-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                평균 시간당 비용
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₩{avgHourlyRate.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input
            placeholder="작업장명 또는 코드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <div></div>
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={async () => navigate("/master/workcenters/create")}
            >
              <i className="ri-add-line mr-2"></i>
              신규 등록
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </div>
        </div>
      </div>

      {/* 작업장 능력 관리 안내 */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <i className="ri-information-line text-sm text-blue-600"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-900">
              작업장 능력 관리 안내
            </h3>
            <div className="mt-2 text-sm text-blue-800">
              <p className="mb-1">
                • <strong>가용 능력:</strong> 일일 최대 가동 시간 × 효율(%) =
                실제 생산 가능 시간
              </p>
              <p className="mb-1">
                • <strong>시간당 비용:</strong> 노무비 + 제조경비 + 설비
                감가상각비 포함
              </p>
              <p>
                • <strong>생산 스케줄링:</strong> 각 작업장의 능력을 기반으로
                최적 일정 계획 수립
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 작업장 목록 테이블 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">작업장 목록</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                총 {filteredData.length}개 작업장
              </span>
              <Button variant="secondary" size="sm">
                <i className="ri-refresh-line mr-2"></i>
                새로고침
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredData}
            emptyText="조건에 맞는 작업장이 없습니다"
          />
        </div>
      </div>
    </>
  );
}
