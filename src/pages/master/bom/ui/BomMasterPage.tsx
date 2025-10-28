import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { bomMasterData } from "@/mocks/factoryData";
import { Table, Button, Input, Select } from "@/shared/ui";

export const BomMasterPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");

  const filteredData = bomMasterData.filter((bom) => {
    const matchesSearch =
      (bom.bomName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bom.bomId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || bom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "bomId", title: "BOM 코드", width: "120px" },
    { key: "bomName", title: "제품명" },
    { key: "version", title: "버전", width: "80px" },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "활성"
              ? "bg-green-100 text-green-800"
              : value === "검토중"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "totalCost",
      title: "총 비용",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString() || 0}`,
    },
    { key: "lastModified", title: "최종 수정일", width: "120px" },
    {
      key: "actions",
      title: "작업",
      width: "150px",
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Link to={`/master/bom/edit/${row.bomId}`}>
            <Button variant="outline" size="sm">
              <i className="ri-edit-line mr-1"></i>
              편집
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <i className="ri-file-copy-line mr-1"></i>
            복사
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalBoms = bomMasterData.length;
  const activeBoms = bomMasterData.filter(
    (bom) => bom.status === "활성",
  ).length;
  const reviewingBoms = bomMasterData.filter(
    (bom) => bom.status === "검토중",
  ).length;
  const avgCost =
    bomMasterData.reduce(
      (sum, bom) =>
        sum +
        (bom.materials.reduce(
          (sum, material) => sum + (material.unitCost || 0),
          0,
        ) || 0),
      0,
    ) / totalBoms;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="p-6">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <i className="ri-file-list-3-line text-xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 BOM</p>
                <p className="text-2xl font-bold text-gray-900">{totalBoms}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-checkbox-circle-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 BOM</p>
                <p className="text-2xl font-bold text-gray-900">{activeBoms}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <i className="ri-time-line text-xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">검토중</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviewingBoms}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <i className="ri-money-dollar-circle-line text-xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 비용</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{Math.round(avgCost).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOM 관리 테이블 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">BOM 목록</h2>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <i className="ri-download-line mr-2"></i>
                  내보내기
                </Button>
                <Button variant="outline">
                  <i className="ri-printer-line mr-2"></i>
                  인쇄
                </Button>
                <Button onClick={async () => navigate("/master/bom/create")}>
                  <i className="ri-add-line mr-2"></i>새 BOM 생성
                </Button>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="BOM 코드 또는 제품명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                <option value="전체">전체 상태</option>
                <option value="활성">활성</option>
                <option value="검토중">검토중</option>
                <option value="비활성">비활성</option>
              </Select>
            </div>
          </div>

          <Table columns={columns} data={filteredData} className="border-0" />
        </div>
      </div>
    </>
  );
};
