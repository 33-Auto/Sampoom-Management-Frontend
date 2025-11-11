import { useState } from "react";

import { Badge, Button, Input, Select, Table, TableSection } from "@/shared/ui";

import { departmentOptions, getDepartmentText } from "../../shared/utils";

export const HRMPayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const payrollData = [
    {
      id: "EMP-001",
      name: "김철수",
      position: "개발팀장",
      department: "development",
      baseSalary: 5500000,
      allowances: 300000,
      overtime: 150000,
      bonus: 500000,
      totalGross: 6450000,
      tax: 645000,
      insurance: 322500,
      totalDeductions: 967500,
      netPay: 5482500,
      status: "paid",
    },
    {
      id: "EMP-002",
      name: "이영희",
      position: "마케팅 매니저",
      department: "marketing",
      baseSalary: 4800000,
      allowances: 250000,
      overtime: 80000,
      bonus: 300000,
      totalGross: 5430000,
      tax: 543000,
      insurance: 271500,
      totalDeductions: 814500,
      netPay: 4615500,
      status: "paid",
    },
    {
      id: "EMP-003",
      name: "박민수",
      position: "영업 대표",
      department: "sales",
      baseSalary: 4200000,
      allowances: 200000,
      overtime: 120000,
      bonus: 800000,
      totalGross: 5320000,
      tax: 532000,
      insurance: 266000,
      totalDeductions: 798000,
      netPay: 4522000,
      status: "pending",
    },
    {
      id: "EMP-004",
      name: "정수진",
      position: "인사 담당자",
      department: "hr",
      baseSalary: 4500000,
      allowances: 200000,
      overtime: 60000,
      bonus: 200000,
      totalGross: 4960000,
      tax: 496000,
      insurance: 248000,
      totalDeductions: 744000,
      netPay: 4216000,
      status: "paid",
    },
    {
      id: "EMP-005",
      name: "최동욱",
      position: "재무 담당자",
      department: "finance",
      baseSalary: 4000000,
      allowances: 150000,
      overtime: 90000,
      bonus: 150000,
      totalGross: 4390000,
      tax: 439000,
      insurance: 219500,
      totalDeductions: 658500,
      netPay: 3731500,
      status: "pending",
    },
    {
      id: "EMP-006",
      name: "한미래",
      position: "디자이너",
      department: "design",
      baseSalary: 3500000,
      allowances: 100000,
      overtime: 40000,
      bonus: 100000,
      totalGross: 3740000,
      tax: 374000,
      insurance: 187000,
      totalDeductions: 561000,
      netPay: 3179000,
      status: "paid",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "success" | "warning" | "info" | "default" }
    > = {
      paid: { label: "지급완료", variant: "success" },
      pending: { label: "지급대기", variant: "warning" },
      processing: { label: "처리중", variant: "info" },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPayroll = payrollData.filter((payroll) => {
    const matchesDepartment =
      departmentFilter === "all" || payroll.department === departmentFilter;
    return matchesDepartment;
  });

  const handleViewPayroll = (payroll: any) => {
    setSelectedEmployee(payroll);
    setShowPayrollModal(true);
  };

  const handleProcessPayroll = () => {
    // 급여 처리 로직
    alert("급여 처리가 시작되었습니다.");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Filters and Actions */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            급여 관리
          </h2>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              급여명세서 다운로드
            </Button>
            <Button variant="default" size="sm" onClick={handleProcessPayroll}>
              <i className="ri-play-line mr-2"></i>
              급여 처리
            </Button>
          </div>
        </div>
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              label="급여 월"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <Select
              label="부서"
              options={departmentOptions}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            />
            <div className="flex items-end">
              <Button variant="default" size="default" className="w-full">
                <i className="ri-search-line mr-2"></i>
                조회
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll List */}
      <TableSection title="급여 목록">
        <Table
          columns={[
            {
              key: "employee",
              title: "직원",
              render: (_value, record) => (
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {record.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {record.position}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {getDepartmentText(record.department)}
                  </div>
                </div>
              ),
            },
            {
              key: "baseSalary",
              title: "기본급",
              render: (_value, record) => (
                <div className="text-right text-sm text-gray-900 dark:text-white">
                  {record.baseSalary.toLocaleString()}원
                </div>
              ),
            },
            {
              key: "allowances",
              title: "수당",
              render: (_value, record) => (
                <div className="text-right text-sm text-gray-900 dark:text-white">
                  {(record.allowances + record.overtime).toLocaleString()}원
                </div>
              ),
            },
            {
              key: "bonus",
              title: "상여금",
              render: (_value, record) => (
                <div className="text-right text-sm text-gray-900 dark:text-white">
                  {record.bonus.toLocaleString()}원
                </div>
              ),
            },
            {
              key: "totalGross",
              title: "총 지급액",
              render: (_value, record) => (
                <div className="text-right text-sm font-medium text-gray-900 dark:text-white">
                  {record.totalGross.toLocaleString()}원
                </div>
              ),
            },
            {
              key: "totalDeductions",
              title: "공제액",
              render: (_value, record) => (
                <div className="text-right text-sm text-red-600 dark:text-red-400">
                  -{record.totalDeductions.toLocaleString()}원
                </div>
              ),
            },
            {
              key: "netPay",
              title: "실수령액",
              render: (_value, record) => (
                <div className="text-right text-sm font-bold text-green-600 dark:text-green-400">
                  {record.netPay.toLocaleString()}원
                </div>
              ),
            },
            {
              key: "status",
              title: "상태",
              render: (_value, record) => (
                <div className="text-center">
                  {getStatusBadge(record.status)}
                </div>
              ),
            },
            {
              key: "action",
              title: "액션",
              render: (_value, record) => (
                <div className="text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewPayroll(record)}
                  >
                    <i className="ri-eye-line"></i>
                  </Button>
                </div>
              ),
            },
          ]}
          data={filteredPayroll}
          emptyText="급여 데이터가 없습니다"
        />
      </TableSection>

      {/* Payroll Detail Modal */}
      {showPayrollModal && selectedEmployee && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                급여명세서
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowPayrollModal(false);
                  setSelectedEmployee(null);
                }}
              >
                <i className="ri-close-line"></i>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Employee Info */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  직원 정보
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      이름:
                    </span>
                    <span className="ml-2 font-medium dark:text-white">
                      {selectedEmployee.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      직급:
                    </span>
                    <span className="ml-2 font-medium dark:text-white">
                      {selectedEmployee.position}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      부서:
                    </span>
                    <span className="ml-2 font-medium dark:text-white">
                      {getDepartmentText(selectedEmployee.department)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      사번:
                    </span>
                    <span className="ml-2 font-medium dark:text-white">
                      {selectedEmployee.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                  지급 내역
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      기본급
                    </span>
                    <span className="font-medium dark:text-white">
                      {selectedEmployee.baseSalary.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      각종 수당
                    </span>
                    <span className="font-medium dark:text-white">
                      {selectedEmployee.allowances.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      연장근무수당
                    </span>
                    <span className="font-medium dark:text-white">
                      {selectedEmployee.overtime.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      상여금
                    </span>
                    <span className="font-medium dark:text-white">
                      {selectedEmployee.bonus.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-700 dark:text-white">
                    <span>총 지급액</span>
                    <span>
                      {selectedEmployee.totalGross.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                  공제 내역
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      소득세
                    </span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{selectedEmployee.tax.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      4대보험
                    </span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{selectedEmployee.insurance.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-700">
                    <span className="dark:text-white">총 공제액</span>
                    <span className="text-red-600 dark:text-red-400">
                      -{selectedEmployee.totalDeductions.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    실수령액
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedEmployee.netPay.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="default" className="flex-1">
                  <i className="ri-download-line mr-2"></i>
                  PDF 다운로드
                </Button>
                <Button variant="secondary" className="flex-1">
                  <i className="ri-mail-line mr-2"></i>
                  이메일 발송
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
