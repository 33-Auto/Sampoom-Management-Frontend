import { useState } from "react";
import { Sidebar } from "@/widgets/Sidebar";
import { Button, Input, Select, Table } from "@/shared/ui";
import { rawMaterials } from "@/../mocks";

export default function MaterialInventory() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const sidebarItems = [
    {
      path: "/factory/dashboard",
      label: "대시보드",
      icon: "ri-dashboard-line",
    },
    { path: "/factory/orders", label: "주문 관리", icon: "ri-file-list-line" },
    { path: "/factory/materials", label: "원자재 재고", icon: "ri-stack-line" },
    { path: "/factory/bom", label: "BOM 관리", icon: "ri-settings-3-line" },
    { path: "/factory/employees", label: "직원 관리", icon: "ri-team-line" },
  ];

  const categories = ["전체", "Metal", "Rubber", "Electronics"];

  const filteredMaterials = rawMaterials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "전체" ||
      material.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { color: "text-error-red", status: "재고 부족" };
    if (current <= min * 1.5)
      return { color: "text-yellow-600", status: "주의" };
    return { color: "text-green-600", status: "충분" };
  };

  const columns = [
    { key: "id", title: "원자재 ID" },
    { key: "name", title: "원자재명" },
    { key: "category", title: "카테고리" },
    {
      key: "currentStock",
      title: "현재 재고",
      render: (value: number, row: any) => {
        const status = getStockStatus(value, row.minStock);
        return (
          <span className={status.color}>
            {value} {row.unit}
          </span>
        );
      },
    },
    {
      key: "minStock",
      title: "최소 재고",
      render: (value: number, row: any) => `${value} ${row.unit}`,
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
    <div className="flex min-h-screen bg-bg-white transition-colors duration-200 dark:bg-bg-black">
      <Sidebar items={sidebarItems} userRole="Factory Manager" />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-grey-500 dark:text-grey-100">
            원자재 재고 관리
          </h1>
          <p className="text-grey-400 dark:text-grey-300">
            생산에 필요한 원자재 재고를 관리하세요
          </p>
        </div>

        {/* Search Section - 개선된 검색 영역 */}
        <div className="mb-6 rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-6 w-6 items-center justify-center text-grey-400 dark:text-grey-300">
                <i className="ri-search-line"></i>
              </div>
              <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
                원자재 검색 및 필터
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Input
                  placeholder="원자재명을 입력하세요 (예: Steel, Rubber, Aluminum...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // icon="ri-search-line"
                  className="text-base"
                />
              </div>
              <div>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={categories.map((cat) => ({
                    value: cat === "전체" ? "" : cat,
                    label: cat,
                  }))}
                  // placeholder="카테고리 선택"
                />
              </div>
            </div>

            {searchTerm && (
              <div className="flex items-center space-x-2 text-sm text-grey-400 dark:text-grey-300">
                <i className="ri-information-line"></i>
                <span>
                  "{searchTerm}"에 대한 검색 결과: {filteredMaterials.length}개
                </span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 text-main-500 hover:text-main-600"
                >
                  검색 초기화
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            // variant="primary"
            onClick={() => setShowOrderModal(true)}
            className="flex items-center space-x-2"
          >
            <i className="ri-add-line"></i>
            <span>원자재 주문</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowStockModal(true)}
            className="flex items-center space-x-2"
          >
            <i className="ri-inbox-line"></i>
            <span>입고 처리</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <i className="ri-download-line"></i>
            <span>재고 보고서</span>
          </Button>
        </div>

        {/* Materials Table */}
        <div className="rounded-xl border border-grey-100 bg-bg-card-white shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
          <div className="border-b border-grey-100 p-6 dark:border-grey-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
                원자재 목록
              </h3>
              <div className="text-sm text-grey-400 dark:text-grey-300">
                총 {filteredMaterials.length}개 원자재
              </div>
            </div>
          </div>
          <Table data={filteredMaterials} columns={columns} />
        </div>

        {/* Order Material Modal */}
        {showOrderModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="mx-4 w-full max-w-md rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                  원자재 주문
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form className="space-y-4">
                <Select
                  label="원자재 선택"
                  options={rawMaterials.map((material) => ({
                    value: material.id,
                    label: material.name,
                  }))}
                  // placeholder="원자재를 선택하세요"
                />
                <Input
                  label="주문 수량"
                  type="number"
                  placeholder="수량을 입력하세요"
                />
                <Input label="공급업체" placeholder="공급업체명을 입력하세요" />
                <Input label="예상 납기일" type="date" />
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

        {/* Process Incoming Stock Modal */}
        {showStockModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="mx-4 w-full max-w-md rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                  입고 처리
                </h2>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form className="space-y-4">
                <Select
                  label="원자재 선택"
                  options={rawMaterials.map((material) => ({
                    value: material.id,
                    label: material.name,
                  }))}
                  // placeholder="입고할 원자재를 선택하세요"
                />
                <Input
                  label="입고 수량"
                  type="number"
                  placeholder="입고 수량을 입력하세요"
                />
                <Input
                  label="입고일"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
                <Input label="공급업체" placeholder="공급업체명을 입력하세요" />
                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="default" className="flex-1">
                    입고 처리
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowStockModal(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
