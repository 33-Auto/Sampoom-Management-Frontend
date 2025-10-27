
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@/widgets/Header/ModuleHeader';
import NavigationTabs from '@/widgets/Header/NavigationTabs';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';

export default function HRMAttendance() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const headerConfig = {
    moduleTitle: '인사 관리 (HRM)',
    moduleDescription: '직원 정보, 급여, 근태 및 평가 관리를 수행합니다',
    moduleIcon: 'ri-team-line',
    moduleColor: 'bg-teal-600',
    userRole: '인사 담당자',
    userEmail: 'hr@company.com',
    navItems: [
      { path: '/hrm/employees', label: '직원 관리', icon: 'ri-user-line' },
      { path: '/hrm/payroll', label: '급여 관리', icon: 'ri-money-dollar-circle-line' },
      { path: '/hrm/attendance', label: '근태 관리', icon: 'ri-time-line', active: true },
      { path: '/hrm/evaluation', label: '평가 관리', icon: 'ri-star-line' }
    ]
  };

  const navItems = [
    { path: '/hrm/employees', label: '직원 관리', icon: 'ri-user-line' },
    { path: '/hrm/payroll', label: '급여 관리', icon: 'ri-money-dollar-circle-line' },
    { path: '/hrm/attendance', label: '근태 관리', icon: 'ri-time-line', active: true },
    { path: '/hrm/evaluation', label: '평가 관리', icon: 'ri-star-line' }
  ];

  const attendanceData = [
    {
      id: 'EMP-001',
      name: '김철수',
      position: '개발팀장',
      department: 'development',
      checkIn: '08:45',
      checkOut: '18:30',
      workHours: 9.75,
      breakTime: 1,
      overtime: 0.75,
      status: 'present',
      lateMinutes: 15,
      location: '본사'
    },
    {
      id: 'EMP-002',
      name: '이영희',
      position: '마케팅 매니저',
      department: 'marketing',
      checkIn: '09:00',
      checkOut: '18:00',
      workHours: 9,
      breakTime: 1,
      overtime: 0,
      status: 'present',
      lateMinutes: 30,
      location: '본사'
    },
    {
      id: 'EMP-003',
      name: '박민수',
      position: '영업 대표',
      department: 'sales',
      checkIn: '08:30',
      checkOut: '19:00',
      workHours: 10.5,
      breakTime: 1,
      overtime: 1.5,
      status: 'present',
      lateMinutes: 0,
      location: '외근'
    },
    {
      id: 'EMP-004',
      name: '정수진',
      position: '인사 담당자',
      department: 'hr',
      checkIn: '08:30',
      checkOut: '17:30',
      workHours: 9,
      breakTime: 1,
      overtime: 0,
      status: 'present',
      lateMinutes: 0,
      location: '본사'
    },
    {
      id: 'EMP-005',
      name: '최동욱',
      position: '재무 담당자',
      department: 'finance',
      checkIn: null,
      checkOut: null,
      workHours: 0,
      breakTime: 0,
      overtime: 0,
      status: 'annual_leave',
      lateMinutes: 0,
      location: '-'
    },
    {
      id: 'EMP-006',
      name: '한미래',
      position: '디자이너',
      department: 'design',
      checkIn: '09:15',
      checkOut: '18:15',
      workHours: 9,
      breakTime: 1,
      overtime: 0,
      status: 'present',
      lateMinutes: 45,
      location: '본사'
    },
    {
      id: 'EMP-007',
      name: '오성민',
      position: '품질관리 담당자',
      department: 'quality',
      checkIn: null,
      checkOut: null,
      workHours: 0,
      breakTime: 0,
      overtime: 0,
      status: 'sick_leave',
      lateMinutes: 0,
      location: '-'
    },
    {
      id: 'EMP-008',
      name: '신혜진',
      position: '고객서비스 담당자',
      department: 'cs',
      checkIn: '08:30',
      checkOut: null,
      workHours: 0,
      breakTime: 0,
      overtime: 0,
      status: 'working',
      lateMinutes: 0,
      location: '본사'
    }
  ];

  const departmentOptions = [
    { value: 'all', label: '전체 부서' },
    { value: 'development', label: '개발팀' },
    { value: 'marketing', label: '마케팅팀' },
    { value: 'sales', label: '영업팀' },
    { value: 'hr', label: '인사팀' },
    { value: 'finance', label: '재무팀' },
    { value: 'design', label: '디자인팀' },
    { value: 'quality', label: '품질관리팀' },
    { value: 'cs', label: '고객서비스팀' }
  ];

  const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'present', label: '출근' },
    { value: 'working', label: '근무중' },
    { value: 'annual_leave', label: '연차' },
    { value: 'sick_leave', label: '병가' },
    { value: 'absent', label: '결근' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'working': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'annual_leave': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sick_leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return '출근완료';
      case 'working': return '근무중';
      case 'annual_leave': return '연차';
      case 'sick_leave': return '병가';
      case 'absent': return '결근';
      default: return '알 수 없음';
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case 'development': return '개발팀';
      case 'marketing': return '마케팅팀';
      case 'sales': return '영업팀';
      case 'hr': return '인사팀';
      case 'finance': return '재무팀';
      case 'design': return '디자인팀';
      case 'quality': return '품질관리팀';
      case 'cs': return '고객서비스팀';
      default: return department;
    }
  };

  const filteredAttendance = attendanceData.filter(attendance => {
    const matchesDepartment = departmentFilter === 'all' || attendance.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || attendance.status === statusFilter;
    return matchesDepartment && matchesStatus;
  });

  const presentCount = attendanceData.filter(a => a.status === 'present' || a.status === 'working').length;
  const leaveCount = attendanceData.filter(a => a.status === 'annual_leave' || a.status === 'sick_leave').length;
  const lateCount = attendanceData.filter(a => a.lateMinutes > 0).length;
  const totalOvertimeHours = attendanceData.reduce((sum, a) => sum + a.overtime, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs 
        navItems={navItems} 
        moduleColor="bg-teal-600"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">출근 인원</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
                <p className="text-xs text-green-600 mt-1">명</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">휴가 인원</p>
                <p className="text-2xl font-bold text-gray-900">{leaveCount}</p>
                <p className="text-xs text-purple-600 mt-1">명</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-line text-purple-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">지각 인원</p>
                <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
                <p className="text-xs text-yellow-600 mt-1">명</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-yellow-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 연장근무</p>
                <p className="text-2xl font-bold text-gray-900">{totalOvertimeHours}</p>
                <p className="text-xs text-blue-600 mt-1">시간</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-timer-line text-blue-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">근태 현황</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Button variant="secondary" size="default" className="w-full">
                <i className="ri-search-line mr-2"></i>
                조회
              </Button>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">근태 목록</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">출근시간</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">퇴근시간</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">근무시간</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">연장근무</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">지각</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{attendance.name}</div>
                        <div className="text-sm text-gray-500">{attendance.position}</div>
                        <div className="text-xs text-gray-400">{getDepartmentText(attendance.department)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {attendance.checkIn || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {attendance.checkOut || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {attendance.workHours > 0 ? `${attendance.workHours}시간` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {attendance.overtime > 0 ? (
                        <span className="text-blue-600 font-medium">{attendance.overtime}시간</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {attendance.lateMinutes > 0 ? (
                        <span className="text-red-600 font-medium">{attendance.lateMinutes}분</span>
                      ) : (
                        <span className="text-green-600">정시</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {attendance.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(attendance.status)}`}>
                        {getStatusText(attendance.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주간 근태 요약</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">98.5%</div>
              <div className="text-sm text-gray-600">출근율</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">42.5</div>
              <div className="text-sm text-gray-600">평균 근무시간</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">12.5</div>
              <div className="text-sm text-gray-600">총 연장근무시간</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
