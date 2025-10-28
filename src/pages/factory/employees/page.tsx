import { useState } from "react";

import { Button, Input, Select } from "@/shared/ui";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

export default function FactoryEmployees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const employees = [
    {
      id: "EMP-001",
      name: "김철수",
      position: "생산팀장",
      department: "production",
      shift: "day",
      status: "working",
      checkIn: "08:00",
      checkOut: null,
      workHours: 6.5,
      targetHours: 8,
      phone: "010-1234-5678",
      email: "kim.cs@factory.com",
      hireDate: "2020-03-15",
      experience: "4년 2개월",
      certifications: ["안전관리자", "품질관리사"],
      currentTask: "LINE-A 엔진 조립 감독",
    },
    {
      id: "EMP-002",
      name: "이영희",
      position: "품질검사원",
      department: "quality",
      shift: "day",
      status: "working",
      checkIn: "08:30",
      checkOut: null,
      workHours: 6,
      targetHours: 8,
      phone: "010-2345-6789",
      email: "lee.yh@factory.com",
      hireDate: "2019-07-22",
      experience: "4년 8개월",
      certifications: ["품질관리기사", "ISO 9001"],
      currentTask: "최종 품질 검사",
    },
    {
      id: "EMP-003",
      name: "박민수",
      position: "기계조작원",
      department: "production",
      shift: "night",
      status: "off_duty",
      checkIn: null,
      checkOut: "06:00",
      workHours: 8,
      targetHours: 8,
      phone: "010-3456-7890",
      email: "park.ms@factory.com",
      hireDate: "2021-11-08",
      experience: "2년 3개월",
      certifications: ["기계조작기능사"],
      currentTask: "야간 근무 완료",
    },
    {
      id: "EMP-004",
      name: "정수진",
      position: "안전관리자",
      department: "safety",
      shift: "day",
      status: "working",
      checkIn: "07:45",
      checkOut: null,
      workHours: 6.75,
      targetHours: 8,
      phone: "010-4567-8901",
      email: "jung.sj@factory.com",
      hireDate: "2018-05-12",
      experience: "5년 9개월",
      certifications: ["산업안전기사", "소방안전관리자"],
      currentTask: "안전점검 순찰",
    },
    {
      id: "EMP-005",
      name: "최동욱",
      position: "설비보전원",
      department: "maintenance",
      shift: "day",
      status: "break",
      checkIn: "08:15",
      checkOut: null,
      workHours: 6.25,
      targetHours: 8,
      phone: "010-5678-9012",
      email: "choi.du@factory.com",
      hireDate: "2022-01-20",
      experience: "2년 1개월",
      certifications: ["전기기능사", "기계정비기능사"],
      currentTask: "LINE-B 정비 작업",
    },
    {
      id: "EMP-006",
      name: "한미래",
      position: "생산관리사",
      department: "production",
      shift: "day",
      status: "working",
      checkIn: "08:00",
      checkOut: null,
      workHours: 6.5,
      targetHours: 8,
      phone: "010-6789-0123",
      email: "han.mr@factory.com",
      hireDate: "2020-09-03",
      experience: "3년 5개월",
      certifications: ["생산관리사", "ERP 정보관리사"],
      currentTask: "생산계획 수립",
    },
    {
      id: "EMP-007",
      name: "오성민",
      position: "자재관리원",
      department: "logistics",
      shift: "day",
      status: "working",
      checkIn: "07:30",
      checkOut: null,
      workHours: 7,
      targetHours: 8,
      phone: "010-7890-1234",
      email: "oh.sm@factory.com",
      hireDate: "2021-06-14",
      experience: "2년 8개월",
      certifications: ["물류관리사", "지게차운전기능사"],
      currentTask: "원자재 입고 검수",
    },
    {
      id: "EMP-008",
      name: "신혜진",
      position: "조립원",
      department: "production",
      shift: "evening",
      status: "off_duty",
      checkIn: null,
      checkOut: null,
      workHours: 0,
      targetHours: 8,
      phone: "010-8901-2345",
      email: "shin.hj@factory.com",
      hireDate: "2023-03-27",
      experience: "10개월",
      certifications: ["조립기능사"],
      currentTask: "오후 근무 대기",
    },
  ];

  const departmentOptions = [
    { value: "all", label: "전체 부서" },
    { value: "production", label: "생산부" },
    { value: "quality", label: "품질관리부" },
    { value: "safety", label: "안전관리부" },
    { value: "maintenance", label: "설비보전부" },
    { value: "logistics", label: "자재관리부" },
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "working", label: "근무중" },
    { value: "break", label: "휴식중" },
    { value: "off_duty", label: "퇴근" },
    { value: "absent", label: "결근" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-800 border-green-200";
      case "break":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "off_duty":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "working":
        return "근무중";
      case "break":
        return "휴식중";
      case "off_duty":
        return "퇴근";
      case "absent":
        return "결근";
      default:
        return "알 수 없음";
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case "production":
        return "생산부";
      case "quality":
        return "품질관리부";
      case "safety":
        return "안전관리부";
      case "maintenance":
        return "설비보전부";
      case "logistics":
        return "자재관리부";
      default:
        return department;
    }
  };

  const getShiftText = (shift: string) => {
    switch (shift) {
      case "day":
        return "주간";
      case "evening":
        return "오후";
      case "night":
        return "야간";
      default:
        return shift;
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalEmployees = employees.length;
  const workingEmployees = employees.filter(
    (e) => e.status === "working",
  ).length;
  const onBreakEmployees = employees.filter((e) => e.status === "break").length;
  const offDutyEmployees = employees.filter(
    (e) => e.status === "off_duty",
  ).length;

  const headerConfig = {
    moduleTitle: "생산 관리",
    moduleDescription: "생산 라인, 주문 및 품질을 관리합니다",
    moduleIcon: "ri-factory-line",
    moduleColor: "bg-blue-600",
    userRole: "생산 관리자",
    userEmail: "factory@company.com",
    navItems: [],
  };

  const navItems = [
    {
      path: "/factory/dashboard",
      label: "생산 대시보드",
      icon: "ri-dashboard-line",
    },
    { path: "/factory/orders", label: "주문 관리", icon: "ri-file-list-line" },
    { path: "/factory/materials", label: "원자재 재고", icon: "ri-stack-line" },
    { path: "/factory/bom", label: "BOM 관리", icon: "ri-settings-3-line" },
    {
      path: "/factory/employees",
      label: "직원 관리",
      icon: "ri-team-line",
      active: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-blue-600" />
      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  총 직원 수
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalEmployees}
                </p>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  등록된 직원
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <i className="ri-team-line text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  현재 근무중
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {workingEmployees}
                </p>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  활동 중
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <i className="ri-user-line text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  휴식중
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {onBreakEmployees}
                </p>
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  일시 중단
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <i className="ri-pause-circle-line text-yellow-600 dark:text-yellow-400"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  퇴근
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {offDutyEmployees}
                </p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  근무 종료
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                <i className="ri-logout-circle-line text-gray-600 dark:text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="이름, 직급, 사번 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={departmentOptions}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Button variant="secondary" size="default">
              <i className="ri-qr-scan-line mr-2"></i>
              출입 기록
            </Button>
          </div>
        </div>

        {/* Employees List */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              직원 목록
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {employee.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({employee.id})
                        </span>
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(employee.status)}`}
                        >
                          {getStatusText(employee.status)}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {getShiftText(employee.shift)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            직급
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {employee.position}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            부서
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {getDepartmentText(employee.department)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            경력
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {employee.experience}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            현재 업무
                          </p>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {employee.currentTask}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm">
                        <i className="ri-phone-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <i className="ri-mail-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <i className="ri-edit-line"></i>
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        출근 시간
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {employee.checkIn || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        퇴근 시간
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {employee.checkOut || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        근무 시간
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {employee.workHours}h / {employee.targetHours}h
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">연락처</p>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {employee.phone}
                      </p>
                    </div>
                  </div>

                  {/* Work Progress */}
                  {employee.status === "working" && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>근무 진행률</span>
                        <span>
                          {Math.round(
                            (employee.workHours / employee.targetHours) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                        <div
                          className="h-2 rounded-full bg-green-500 transition-all duration-300"
                          style={{
                            width: `${Math.min((employee.workHours / employee.targetHours) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  <div className="mt-3">
                    <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                      보유 자격증
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {employee.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
