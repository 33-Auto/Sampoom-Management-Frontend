import { useState } from "react";

import { Button, Input, Select } from "@/shared/ui";

export default function HRMPayroll() {
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

  const departmentOptions = [
    { value: "all", label: "전체 부서" },
    { value: "development", label: "개발팀" },
    { value: "marketing", label: "마케팅팀" },
    { value: "sales", label: "영업팀" },
    { value: "hr", label: "인사팀" },
    { value: "finance", label: "재무팀" },
    { value: "design", label: "디자인팀" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "지급완료";
      case "pending":
        return "지급대기";
      case "processing":
        return "처리중";
      default:
        return "알 수 없음";
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case "development":
        return "개발팀";
      case "marketing":
        return "마케팅팀";
      case "sales":
        return "영업팀";
      case "hr":
        return "인사팀";
      case "finance":
        return "재무팀";
      case "design":
        return "디자인팀";
      default:
        return department;
    }
  };

  const filteredPayroll = payrollData.filter((payroll) => {
    const matchesDepartment =
      departmentFilter === "all" || payroll.department === departmentFilter;
    return matchesDepartment;
  });

  const totalGrossPay = filteredPayroll.reduce(
    (sum, p) => sum + p.totalGross,
    0,
  );
  const totalNetPay = filteredPayroll.reduce((sum, p) => sum + p.netPay, 0);
  const totalDeductions = filteredPayroll.reduce(
    (sum, p) => sum + p.totalDeductions,
    0,
  );
  const paidCount = filteredPayroll.filter((p) => p.status === "paid").length;

  const handleViewPayroll = (payroll: any) => {
    setSelectedEmployee(payroll);
    setShowPayrollModal(true);
  };

  const handleProcessPayroll = () => {
    // 급여 처리 로직
    alert("급여 처리가 시작되었습니다.");
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 지급액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalGrossPay.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-blue-600">원</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <i className="ri-money-dollar-circle-line text-blue-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">실수령액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalNetPay.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-green-600">원</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-wallet-line text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 공제액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalDeductions.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-red-600">원</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <i className="ri-subtract-line text-red-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">지급 완료</p>
                <p className="text-2xl font-bold text-gray-900">{paidCount}</p>
                <p className="mt-1 text-xs text-teal-600">명</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                <i className="ri-check-line text-teal-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">급여 관리</h2>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                급여명세서 다운로드
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleProcessPayroll}
              >
                <i className="ri-play-line mr-2"></i>
                급여 처리
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <Button variant="secondary" size="default" className="w-full">
                <i className="ri-search-line mr-2"></i>
                조회
              </Button>
            </div>
          </div>
        </div>

        {/* Payroll List */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">급여 목록</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    직원
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    기본급
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    수당
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    상여금
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    총 지급액
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    공제액
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    실수령액
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPayroll.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payroll.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payroll.position}
                        </div>
                        <div className="text-xs text-gray-400">
                          {getDepartmentText(payroll.department)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                      {payroll.baseSalary.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                      {(payroll.allowances + payroll.overtime).toLocaleString()}
                      원
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                      {payroll.bonus.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-900">
                      {payroll.totalGross.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-red-600">
                      -{payroll.totalDeductions.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap text-green-600">
                      {payroll.netPay.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(payroll.status)}`}
                      >
                        {getStatusText(payroll.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewPayroll(payroll)}
                      >
                        <i className="ri-eye-line"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payroll Detail Modal */}
        {showPayrollModal && selectedEmployee && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  급여명세서
                </h2>
                <button
                  onClick={() => {
                    setShowPayrollModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="hover:text-gray-5 text-gray-400"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    직원 정보
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">이름:</span>
                      <span className="ml-2 font-medium">
                        {selectedEmployee.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">직급:</span>
                      <span className="ml-2 font-medium">
                        {selectedEmployee.position}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">부서:</span>
                      <span className="ml-2 font-medium">
                        {getDepartmentText(selectedEmployee.department)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">사번:</span>
                      <span className="ml-2 font-medium">
                        {selectedEmployee.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    지급 내역
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">기본급</span>
                      <span className="font-medium">
                        {selectedEmployee.baseSalary.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">각종 수당</span>
                      <span className="font-medium">
                        {selectedEmployee.allowances.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연장근무수당</span>
                      <span className="font-medium">
                        {selectedEmployee.overtime.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상여금</span>
                      <span className="font-medium">
                        {selectedEmployee.bonus.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>총 지급액</span>
                      <span>
                        {selectedEmployee.totalGross.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    공제 내역
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">소득세</span>
                      <span className="font-medium text-red-600">
                        -{selectedEmployee.tax.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">4대보험</span>
                      <span className="font-medium text-red-600">
                        -{selectedEmployee.insurance.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>총 공제액</span>
                      <span className="text-red-600">
                        -{selectedEmployee.totalDeductions.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      실수령액
                    </span>
                    <span className="text-2xl font-bold text-green-600">
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
    </>
  );
}
