import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  Card,
  Input,
  SearchFilterBar,
  Select,
  StatCard,
} from "@/shared/ui";

import { departmentOptions, getDepartmentText } from "../../shared/utils";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  level: string;
  status: string;
  hireDate: string;
  salary: number;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  education: string;
  skills: string[];
  performance: string;
  annualLeave: number;
  usedLeave: number;
}

export const HRMEmployees = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // ------------------------------------------------------------
  // 헬퍼 함수 : 입사일을 기준으로 년차를 계산하는 함수 ( 에러 핸들링 처리 )
  // ------------------------------------------------------------
  const getYearsOfService = (hireDateStr: string): string => {
    try {
      const hireDate = new Date(hireDateStr);
      if (isNaN(hireDate.getTime())) {
        // Invalid date string – fallback to unknown
        return "알 수 없음";
      }
      const diffMs = new Date().getTime() - hireDate.getTime();
      const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
      return `${years}`;
    } catch (error) {
      // Defensive programming – in case something unexpected occurs
      console.error("Failed to calculate years of service:", error);
      return "알 수 없음";
    }
  };

  const employees: Employee[] = [
    {
      id: "EMP-001",
      name: "김철수",
      position: "개발팀장",
      department: "development",
      level: "차장",
      status: "active",
      hireDate: "2020-03-15",
      salary: 5500000,
      phone: "010-1234-5678",
      email: "kim.cs@company.com",
      address: "서울시 강남구 테헤란로 123",
      emergencyContact: "010-9876-5432",
      education: "컴퓨터공학 학사",
      skills: ["Java", "Spring", "React"],
      performance: "A",
      annualLeave: 15,
      usedLeave: 8,
    },
    {
      id: "EMP-002",
      name: "이영희",
      position: "마케팅 매니저",
      department: "marketing",
      level: "과장",
      status: "active",
      hireDate: "2019-07-22",
      salary: 4800000,
      phone: "010-2345-6789",
      email: "lee.yh@company.com",
      address: "서울시 서초구 서초대로 456",
      emergencyContact: "010-8765-4321",
      education: "경영학 석사",
      skills: ["디지털마케팅", "SNS운영", "브랜딩"],
      performance: "A",
      annualLeave: 15,
      usedLeave: 12,
    },
    {
      id: "EMP-003",
      name: "박민수",
      position: "영업 대표",
      department: "sales",
      level: "대리",
      status: "active",
      hireDate: "2021-11-08",
      salary: 4200000,
      phone: "010-3456-7890",
      email: "park.ms@company.com",
      address: "서울시 마포구 월드컵로 789",
      emergencyContact: "010-7654-3210",
      education: "경영학 학사",
      skills: ["B2B영업", "고객관리", "제안서작성"],
      performance: "B",
      annualLeave: 15,
      usedLeave: 5,
    },
    {
      id: "EMP-004",
      name: "정수진",
      position: "인사 담당자",
      department: "hr",
      level: "과장",
      status: "active",
      hireDate: "2018-05-12",
      salary: 4500000,
      phone: "010-4567-8901",
      email: "jung.sj@company.com",
      address: "서울시 용산구 한강대로 321",
      emergencyContact: "010-6543-2109",
      education: "심리학 학사",
      skills: ["채용", "교육기획", "노무관리"],
      performance: "A",
      annualLeave: 15,
      usedLeave: 10,
    },
    {
      id: "EMP-005",
      name: "최동욱",
      position: "재무 담당자",
      department: "finance",
      level: "대리",
      status: "active",
      hireDate: "2022-01-20",
      salary: 4000000,
      phone: "010-5678-9012",
      email: "choi.du@company.com",
      address: "서울시 종로구 종로 654",
      emergencyContact: "010-5432-1098",
      education: "회계학 학사",
      skills: ["회계", "세무", "예산관리"],
      performance: "B",
      annualLeave: 15,
      usedLeave: 3,
    },
    {
      id: "EMP-006",
      name: "한미래",
      position: "디자이너",
      department: "design",
      level: "사원",
      status: "active",
      hireDate: "2023-03-15",
      salary: 3500000,
      phone: "010-6789-0123",
      email: "han.mr@company.com",
      address: "서울시 홍대입구 와우산로 987",
      emergencyContact: "010-4321-0987",
      education: "시각디자인 학사",
      skills: ["Photoshop", "Illustrator", "Figma"],
      performance: "B",
      annualLeave: 15,
      usedLeave: 7,
    },
    {
      id: "EMP-007",
      name: "오성민",
      position: "품질관리 담당자",
      department: "quality",
      level: "대리",
      status: "leave",
      hireDate: "2021-06-14",
      salary: 4100000,
      phone: "010-7890-1234",
      email: "oh.sm@company.com",
      address: "서울시 강서구 화곡로 147",
      emergencyContact: "010-3210-9876",
      education: "산업공학 학사",
      skills: ["품질관리", "ISO인증", "프로세스개선"],
      performance: "A",
      annualLeave: 15,
      usedLeave: 15,
    },
    {
      id: "EMP-008",
      name: "신혜진",
      position: "고객서비스 담당자",
      department: "cs",
      level: "사원",
      status: "active",
      hireDate: "2023-08-01",
      salary: 3200000,
      phone: "010-8901-2345",
      email: "shin.hj@company.com",
      address: "서울시 송파구 올림픽로 258",
      emergencyContact: "010-2109-8765",
      education: "국어국문학 학사",
      skills: ["고객상담", "클레임처리", "서비스기획"],
      performance: "B",
      annualLeave: 15,
      usedLeave: 2,
    },
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "active", label: "재직중" },
    { value: "leave", label: "휴직중" },
    { value: "resigned", label: "퇴사" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "success" | "warning" | "error" | "default" }
    > = {
      active: { label: "재직중", variant: "success" },
      leave: { label: "휴직중", variant: "warning" },
      resigned: { label: "퇴사", variant: "error" },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPerformanceBadge = (performance: string) => {
    const performanceConfig: Record<
      string,
      { variant: "success" | "info" | "warning" | "error" }
    > = {
      A: { variant: "success" },
      B: { variant: "info" },
      C: { variant: "warning" },
      D: { variant: "error" },
    };

    const config = performanceConfig[performance];
    if (!config) return null;

    return <Badge variant={config.variant}>평가: {performance}</Badge>;
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
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onLeaveEmployees = employees.filter((e) => e.status === "leave").length;
  const avgSalary = Math.round(
    employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length,
  );

  const handleAddEmployee = () => {
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    // 실제로는 API 호출
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
    setSelectedEmployee(null);
    // 실제로는 API 호출
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-team-line"
          label="총 직원 수"
          value={totalEmployees}
          iconBgColor="bg-teal-100"
          iconColor="text-teal-600"
        />
        <StatCard
          icon="ri-user-line"
          label="재직 중"
          value={activeEmployees}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-pause-circle-line"
          label="휴직 중"
          value={onLeaveEmployees}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-money-dollar-circle-line"
          label="평균 급여"
          value={`${avgSalary.toLocaleString()}원`}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {/* Filters and Actions */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="이름, 직급, 사번 검색..."
        filters={[
          {
            key: "department",
            value: departmentFilter,
            options: departmentOptions,
            onChange: setDepartmentFilter,
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
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => navigate("/hrm/attendance")}
            >
              <i className="ri-time-line mr-2"></i>
              근태 현황
            </Button>
            <Button variant="default" size="sm" onClick={handleAddEmployee}>
              <i className="ri-user-add-line mr-2"></i>
              직원 등록
            </Button>
          </>
        }
      />

      {/* Employee List */}
      <div className="space-y-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {employee.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-white">
                    ({employee.id})
                  </span>
                  {getStatusBadge(employee.status)}
                  {getPerformanceBadge(employee.performance)}
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-gray-600 dark:text-white">직급/부서</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.level} · {employee.position}
                    </p>
                    <p className="text-gray-600 dark:text-white">
                      {getDepartmentText(employee.department)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-white">입사일/경력</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.hireDate}
                    </p>
                    <p className="text-gray-600 dark:text-white">
                      {getYearsOfService(employee.hireDate)}년차
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-white">급여</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.salary.toLocaleString()}원
                    </p>
                    <p className="text-gray-600 dark:text-white">월급</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-white">연차 사용</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.usedLeave}/{employee.annualLeave}일
                    </p>
                    <p className="text-gray-600 dark:text-white">
                      잔여: {employee.annualLeave - employee.usedLeave}일
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
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditEmployee(employee)}
                >
                  <i className="ri-edit-line"></i>
                </Button>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div>
                <p className="text-gray-600 dark:text-white">연락처</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.phone}
                </p>
                <p className="text-gray-600 dark:text-white">
                  {employee.email}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">주소</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.address}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-white">비상연락처</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.emergencyContact}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="mb-1 text-gray-600 dark:text-white">학력</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.education}
                </p>
              </div>
              <div>
                <p className="mb-1 text-gray-600 dark:text-white">보유 스킬</p>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-teal-100 px-3 py-1.5 text-sm font-medium text-teal-800 dark:bg-teal-700 dark:text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                직원 등록
              </h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitAdd}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="이름" placeholder="이름을 입력하세요" />
                  <Input label="직급" placeholder="직급을 입력하세요" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select label="부서" options={departmentOptions} />
                  <Input label="입사일" type="date" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="급여"
                    type="number"
                    placeholder="급여를 입력하세요"
                  />
                  <Input label="연락처" placeholder="연락처를 입력하세요" />
                </div>
                <Input
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력하세요"
                />
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCloseAddModal}
                >
                  취소
                </Button>
                <Button variant="default" type="submit">
                  등록
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                직원 정보 수정
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="이름"
                    placeholder="이름을 입력하세요"
                    value={selectedEmployee.name}
                    onChange={() => {}}
                  />
                  <Input
                    label="직급"
                    placeholder="직급을 입력하세요"
                    value={selectedEmployee.position}
                    onChange={() => {}}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select
                    label="부서"
                    options={departmentOptions}
                    value={selectedEmployee.department}
                    onChange={() => {}}
                  />
                  <Input
                    label="입사일"
                    type="date"
                    value={selectedEmployee.hireDate}
                    onChange={() => {}}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="급여"
                    type="number"
                    placeholder="급여를 입력하세요"
                    value={selectedEmployee.salary}
                    onChange={() => {}}
                  />
                  <Input
                    label="연락처"
                    placeholder="연락처를 입력하세요"
                    value={selectedEmployee.phone}
                    onChange={() => {}}
                  />
                </div>
                <Input
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={selectedEmployee.email}
                  onChange={() => {}}
                />
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCloseEditModal}
                >
                  취소
                </Button>
                <Button variant="default" type="submit">
                  저장
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
