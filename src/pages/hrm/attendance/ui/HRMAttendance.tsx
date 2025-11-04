import { useState } from "react";

import {
  Badge,
  Button,
  Input,
  Select,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { departmentOptions, getDepartmentText } from "../../shared/utils";

export const HRMAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const attendanceData = [
    {
      id: "EMP-001",
      name: "김철수",
      position: "개발팀장",
      department: "development",
      checkIn: "08:45",
      checkOut: "18:30",
      workHours: 9.75,
      breakTime: 1,
      overtime: 0.75,
      status: "present",
      lateMinutes: 15,
      location: "본사",
    },
    {
      id: "EMP-002",
      name: "이영희",
      position: "마케팅 매니저",
      department: "marketing",
      checkIn: "09:00",
      checkOut: "18:00",
      workHours: 9,
      breakTime: 1,
      overtime: 0,
      status: "present",
      lateMinutes: 30,
      location: "본사",
    },
    {
      id: "EMP-003",
      name: "박민수",
      position: "영업 대표",
      department: "sales",
      checkIn: "08:30",
      checkOut: "19:00",
      workHours: 10.5,
      breakTime: 1,
      overtime: 1.5,
      status: "present",
      lateMinutes: 0,
      location: "외근",
    },
    {
      id: "EMP-004",
      name: "정수진",
      position: "인사 담당자",
      department: "hr",
      checkIn: "08:30",
      checkOut: "17:30",
      workHours: 9,
      breakTime: 1,
      overtime: 0,
      status: "present",
      lateMinutes: 0,
      location: "본사",
    },
    {
      id: "EMP-005",
      name: "최동욱",
      position: "재무 담당자",
      department: "finance",
      checkIn: null,
      checkOut: null,
      workHours: 0,
      breakTime: 0,
      overtime: 0,
      status: "annual_leave",
      lateMinutes: 0,
      location: "-",
    },
    {
      id: "EMP-006",
      name: "한미래",
      position: "디자이너",
      department: "design",
      checkIn: "09:15",
      checkOut: "18:15",
      workHours: 9,
      breakTime: 1,
      overtime: 0,
      status: "present",
      lateMinutes: 45,
      location: "본사",
    },
    {
      id: "EMP-007",
      name: "오성민",
      position: "품질관리 담당자",
      department: "quality",
      checkIn: null,
      checkOut: null,
      workHours: 0,
      breakTime: 0,
      overtime: 0,
      status: "sick_leave",
      lateMinutes: 0,
      location: "-",
    },
    {
      id: "EMP-008",
      name: "신혜진",
      position: "고객서비스 담당자",
      department: "cs",
      checkIn: "08:30",
      checkOut: null,
      workHours: 0,
      breakTime: 0,
      overtime: 0,
      status: "working",
      lateMinutes: 0,
      location: "본사",
    },
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "present", label: "출근" },
    { value: "working", label: "근무중" },
    { value: "annual_leave", label: "연차" },
    { value: "sick_leave", label: "병가" },
    { value: "absent", label: "결근" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        variant: "success" | "info" | "warning" | "error" | "default";
      }
    > = {
      present: { label: "출근완료", variant: "success" },
      working: { label: "근무중", variant: "info" },
      annual_leave: { label: "연차", variant: "warning" },
      sick_leave: { label: "병가", variant: "warning" },
      absent: { label: "결근", variant: "error" },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredAttendance = attendanceData.filter((attendance) => {
    const matchesDepartment =
      departmentFilter === "all" || attendance.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || attendance.status === statusFilter;
    return matchesDepartment && matchesStatus;
  });

  const presentCount = attendanceData.filter(
    (a) => a.status === "present" || a.status === "working",
  ).length;
  const leaveCount = attendanceData.filter(
    (a) => a.status === "annual_leave" || a.status === "sick_leave",
  ).length;
  const lateCount = attendanceData.filter((a) => a.lateMinutes > 0).length;
  const totalOvertimeHours = attendanceData.reduce(
    (sum, a) => sum + a.overtime,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-user-line"
          label="출근 인원"
          value={presentCount}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-calendar-line"
          label="휴가 인원"
          value={leaveCount}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          icon="ri-time-line"
          label="지각 인원"
          value={lateCount}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-timer-line"
          label="총 연장근무"
          value={`${totalOvertimeHours}시간`}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            근태 현황
          </h2>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              근태 리포트
            </Button>
            <Button variant="default" size="sm">
              <i className="ri-add-line mr-2"></i>
              수동 출퇴근
            </Button>
          </div>
        </div>
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              label="조회 날짜"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Select
              label="부서"
              options={departmentOptions}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            />
            <Select
              label="상태"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* Attendance List */}
      <TableSection title="근태 목록">
        <Table
          columns={[
            {
              key: "employee",
              title: "직원",
              render: (_value: any, record: any) => (
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
              key: "checkIn",
              title: "출근시간",
              render: (_value: any, record: any) => (
                <div className="text-center text-sm text-gray-900 dark:text-white">
                  {record.checkIn || "-"}
                </div>
              ),
            },
            {
              key: "checkOut",
              title: "퇴근시간",
              render: (_value: any, record: any) => (
                <div className="text-center text-sm text-gray-900 dark:text-white">
                  {record.checkOut || "-"}
                </div>
              ),
            },
            {
              key: "workHours",
              title: "근무시간",
              render: (_value: any, record: any) => (
                <div className="text-center text-sm text-gray-900 dark:text-white">
                  {record.workHours > 0 ? `${record.workHours}시간` : "-"}
                </div>
              ),
            },
            {
              key: "overtime",
              title: "연장근무",
              render: (_value: any, record: any) => (
                <div className="text-center text-sm">
                  {record.overtime > 0 ? (
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {record.overtime}시간
                    </span>
                  ) : (
                    "-"
                  )}
                </div>
              ),
            },
            {
              key: "lateMinutes",
              title: "지각",
              render: (_value: any, record: any) => (
                <div className="text-center text-sm">
                  {record.lateMinutes > 0 ? (
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {record.lateMinutes}분
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">
                      정시
                    </span>
                  )}
                </div>
              ),
            },
            {
              key: "location",
              title: "근무지",
              render: (_value: any, record: any) => (
                <div className="text-center text-sm text-gray-900 dark:text-white">
                  {record.location}
                </div>
              ),
            },
            {
              key: "status",
              title: "상태",
              render: (_value: any, record: any) => (
                <div className="text-center">
                  {getStatusBadge(record.status)}
                </div>
              ),
            },
          ]}
          data={filteredAttendance}
          emptyText="근태 데이터가 없습니다"
        />
      </TableSection>

      {/* Weekly Summary */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-bg-card-black">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          주간 근태 요약
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <div className="mb-1 text-2xl font-bold text-green-600 dark:text-green-400">
              98.5%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              출근율
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <div className="mb-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
              42.5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              평균 근무시간
            </div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
            <div className="mb-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              12.5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              총 연장근무시간
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
