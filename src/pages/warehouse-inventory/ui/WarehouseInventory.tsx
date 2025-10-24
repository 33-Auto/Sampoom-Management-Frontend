import { useState } from "react";

import { partInventory } from "@/../mocks";
import { warehouseSidebarItems } from "@/shared/config/sidebar";
import { Button, Input, Select, Table } from "@/shared/ui";
import { PageLayout } from "@/widgets/Layout";

const WarehouseInventory = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const categories = [
    "전체",
    "Engine",
    "Transmission",
    "Brakes",
    "Suspension",
    "Exhaust",
  ];
  const groups = ["전체", "Powertrain", "Safety", "Chassis"];

  const filteredParts = partInventory.filter((part) => {
    const matchesSearch = part.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "전체" ||
      part.category === categoryFilter;
    const matchesGroup =
      !groupFilter || groupFilter === "전체" || part.group === groupFilter;
    return matchesSearch && matchesCategory && matchesGroup;
  });

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { color: "text-error-red", status: "재고 부족" };
    if (current <= min * 1.5)
      return { color: "text-yellow-600", status: "주의" };
    return { color: "text-green-600", status: "충분" };
  };

  const columns = [
    { key: "id", title: "부품 ID" },
    { key: "name", title: "부품명" },
    { key: "category", title: "카테고리" },
    { key: "group", title: "그룹" },
    {
      key: "currentStock",
      title: "현재 재고",
      render: (value: number, row: any) => {
        const status = getStockStatus(value, row.minStock);
        return <span className={status.color}>{value}개</span>;
      },
    },
    {
      key: "status",
      title: "상태",
      render: (_: any, row: any) => {
        const status = getStockStatus(row.currentStock, row.minStock);
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              status.status === "재고 부족"
                ? "bg-error-red/10 text-error-red"
                : status.status === "주의"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {status.status}
          </span>
        );
      },
    },
  ];

  return (
    <PageLayout
      sidebarItems={warehouseSidebarItems}
      userRole="Warehouse Manager"
      pageTitle="부품 재고 관리"
      pageDescription="완성된 부품 재고를 관리하세요"
    >
      {/* Search Section */}
      <div className="mb-6 rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 lg:w-2/3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="ri-search-line text-grey-400 dark:text-grey-500"></i>
              </div>
              <input
                type="text"
                placeholder="부품명으로 검색하세요 (예: Engine, Brake Pad, Transmission...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-grey-200 bg-bg-white py-3 pr-4 pl-10 text-grey-500 placeholder-grey-400 transition-colors duration-200 focus:border-main-500 focus:ring-2 focus:ring-main-500 dark:border-grey-600 dark:bg-bg-black dark:text-grey-100 dark:placeholder-grey-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-grey-400 hover:text-grey-600 dark:text-grey-500 dark:hover:text-grey-300"
                >
                  <i className="ri-close-line"></i>
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:w-1/3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categories.map((cat) => ({
                value: cat === "전체" ? "" : cat,
                label: cat,
              }))}
            />
            <Select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              options={groups.map((group) => ({
                value: group === "전체" ? "" : group,
                label: group,
              }))}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-grey-100 pt-4 dark:border-grey-700">
          <div className="flex items-center space-x-4 text-sm text-grey-400 dark:text-grey-500">
            <span>검색 결과: {filteredParts.length}개</span>
            {searchTerm && <span>"{searchTerm}" 검색 중</span>}
          </div>
          <Button
            variant="default"
            onClick={() => setShowOrderModal(true)}
            className="whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            공장에서 부품 주문
          </Button>
        </div>
      </div>

      {/* Parts Table */}
      <div className="rounded-xl border border-grey-100 bg-bg-card-white shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
        <div className="border-b border-grey-100 p-4 dark:border-grey-700">
          <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
            부품 목록 ({filteredParts.length}개)
          </h3>
        </div>
        <Table data={filteredParts} columns={columns} />
      </div>

      {/* Order Parts Modal */}
      {showOrderModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                공장에서 부품 주문
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-grey-500 dark:text-grey-100">
                  주문할 부품 선택
                </h3>
                <div className="space-y-4">
                  {partInventory.map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between rounded-lg border border-grey-100 bg-bg-white p-4 transition-colors duration-200 dark:border-grey-700 dark:bg-bg-black"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-grey-200 text-main-500 focus:ring-main-500 dark:border-grey-600"
                        />
                        <div>
                          <p className="font-medium text-grey-500 dark:text-grey-100">
                            {part.name}
                          </p>
                          <p className="text-sm text-grey-500 dark:text-grey-300">
                            {part.category} - {part.group}
                          </p>
                          <p className="text-sm text-grey-500 dark:text-grey-300">
                            현재 재고: {part.currentStock}개
                          </p>
                        </div>
                      </div>
                      <div className="w-24">
                        <Input type="number" placeholder="수량" min="1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="예상 납기일" type="date" />
                <Select
                  label="우선순위"
                  options={[
                    { value: "high", label: "높음" },
                    { value: "medium", label: "보통" },
                    { value: "low", label: "낮음" },
                  ]}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-grey-500 dark:text-grey-100">
                  특별 요청사항
                </label>
                <textarea
                  className="w-full resize-none rounded-lg border border-grey-200 bg-bg-card-white px-3 py-2 text-grey-500 transition-colors duration-200 focus:border-main-500 focus:ring-2 focus:ring-main-500 dark:border-grey-600 dark:bg-bg-card-black dark:text-grey-100"
                  rows={3}
                  placeholder="특별한 요청사항이 있으면 입력하세요..."
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  주문 요청
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export { WarehouseInventory };
