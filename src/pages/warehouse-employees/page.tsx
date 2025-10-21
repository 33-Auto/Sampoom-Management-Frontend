import { useState } from "react";

import { warehouseEmployees } from "@/../mocks";
import { Button, Input, Table } from "@/shared/ui";
import { Sidebar } from "@/widgets/Sidebar";

export default function WarehouseEmployees() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sidebarItems = [
    {
      path: "/warehouse/dashboard",
      label: "대시보드",
      icon: "ri-dashboard-line",
    },
    {
      path: "/warehouse/orders",
      label: "주문 관리",
      icon: "ri-file-list-line",
    },
    {
      path: "/warehouse/inventory",
      label: "부품 재고",
      icon: "ri-archive-line",
    },
    { path: "/warehouse/employees", label: "직원 관리", icon: "ri-team-line" },
  ];

  const filteredEmployees = warehouseEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const columns = [
    { key: "id", title: "직원 ID" },
    { key: "name", title: "이름" },
    { key: "position", title: "직책" },
    { key: "contact", title: "이메일" },
    { key: "phone", title: "전화번호" },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: any) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleEditEmployee(row)}
        >
          편집
        </Button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-bg-white transition-colors duration-200 dark:bg-bg-black">
      <Sidebar items={sidebarItems} userRole="Warehouse Manager" />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-grey-500 dark:text-grey-100">
            직원 관리
          </h1>
          <p className="text-grey-400 dark:text-grey-300">
            창고 직원 정보를 관리하세요
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="직원 이름 또는 직책으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // icon="ri-search-line"
            />
          </div>
          <Button variant="default">+ 새 직원 추가</Button>
        </div>

        {/* Employees Table */}
        <div className="rounded-xl border border-grey-100 bg-bg-card-white shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
          <div className="border-b border-grey-100 p-6 dark:border-grey-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
                직원 목록
              </h3>
              <div className="text-sm text-grey-500 dark:text-grey-300">
                총 {filteredEmployees.length}명
              </div>
            </div>
          </div>
          <Table data={filteredEmployees} columns={columns} />
        </div>

        {/* Edit Employee Modal */}
        {showEditModal && selectedEmployee && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="mx-4 w-full max-w-md rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                  직원 정보 편집
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form className="space-y-4">
                <Input label="직원 ID" value={selectedEmployee.id} disabled />
                <Input label="이름" defaultValue={selectedEmployee.name} />
                <Input label="직책" defaultValue={selectedEmployee.position} />
                <Input
                  label="이메일"
                  type="email"
                  defaultValue={selectedEmployee.contact}
                />
                <Input label="전화번호" defaultValue={selectedEmployee.phone} />
                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="default" className="flex-1">
                    변경사항 저장
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedEmployee(null);
                    }}
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
