
import { useState, useEffect } from 'react';
import Sidebar from '../../../components/feature/Sidebar';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Select from '../../../components/base/Select';
import { useNotification } from '../../../contexts/NotificationContext';

export default function WarehouseEmployees() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sidebarItems = [
    { path: '/warehouse/dashboard', label: '대시보드', icon: 'ri-dashboard-line' },
    { path: '/warehouse/orders', label: '주문 관리', icon: 'ri-file-list-line' },
    { path: '/warehouse/inventory', label: '부품 재고', icon: 'ri-archive-line' },
    { path: '/warehouse/employees', label: '직원 관리', icon: 'ri-team-line' }
  ];

  const employees = [
    {
      id: 'WH-001',
      name: '김수현',
      position: '창고팀장',
      department: 'management',
      shift: 'day',
      status: 'working',
      checkIn: '08:00',
      checkOut: null,
      workHours: 6.5,
      targetHours: 8,
      phone: '010-1111-2222',
      email: 'kim.sh@warehouse.com',
      hireDate: '2019-05-10',
      experience: '4년 8개월',
      certifications: ['물류관리사', '지게차운전기능사'],
      currentTask: '일일 재고 점검 지시'
    },
    {
      id: 'WH-002',
      name: '박지훈',
      position: '입출고담당',
      department: 'logistics',
      shift: 'day',
      status: 'working',
      checkIn: '07:45',
      checkOut: null,
      workHours: 6.75,
      targetHours: 8,
      phone: '010-2222-3333',
      email: 'park.jh@warehouse.com',
      hireDate: '2020-11-15',
      experience: '3년 2개월',
      certifications: ['지게차운전기능사', '물류관리사'],
      currentTask: '대리점 출고 준비'
    },
    {
      id: 'WH-003',
      name: '이민정',
      position: '재고관리원',
      department: 'inventory',
      shift: 'day',
      status: 'break',
      checkIn: '08:30',
      checkOut: null,
      workHours: 6,
      targetHours: 8,
      phone: '010-3333-4444',
      email: 'lee.mj@warehouse.com',
      hireDate: '2021-03-22',
      experience: '2년 10개월',
      certifications: ['재고관리사', 'ERP 정보관리사'],
      currentTask: '부품 재고 실사'
    },
    {
      id: 'WH-004',
      name: '최영수',
      position: '지게차운전원',
      department: 'logistics',
      shift: 'day',
      status: 'working',
      checkIn: '08:15',
      checkOut: null,
      workHours: 6.25,
      targetHours: 8,
      phone: '010-4444-5555',
      email: 'choi.ys@warehouse.com',
      hireDate: '2022-07-01',
      experience: '1년 6개월',
      certifications: ['지게차운전기능사', '크레인운전기능사'],
      currentTask: '대형 부품 이동 작업'
    },
    {
      id: 'WH-005',
      name: '정하늘',
      position: '품질검사원',
      department: 'quality',
      shift: 'day',
      status: 'working',
      checkIn: '08:00',
      checkOut: null,
      workHours: 6.5,
      targetHours: 8,
      phone: '010-5555-6666',
      email: 'jung.hn@warehouse.com',
      hireDate: '2020-09-14',
      experience: '3년 4개월',
      certifications: ['품질관리기사', 'ISO 9001'],
      currentTask: '입고 부품 품질 검사'
    },
    {
      id: 'WH-006',
      name: '한도윤',
      position: '포장담당',
      department: 'packaging',
      shift: 'evening',
      status: 'off_duty',
      checkIn: null,
      checkOut: null,
      workHours: 0,
      targetHours: 8,
      phone: '010-6666-7777',
      email: 'han.dy@warehouse.com',
      hireDate: '2023-01-16',
      experience: '11개월',
      certifications: ['포장기사'],
      currentTask: '오후 근무 대기'
    },
    {
      id: 'WH-007',
      name: '오세진',
      position: '배송준비원',
      department: 'shipping',
      shift: 'night',
      status: 'off_duty',
      checkIn: null,
      checkOut: '06:30',
      workHours: 8,
      targetHours: 8,
      phone: '010-7777-8888',
      email: 'oh.sj@warehouse.com',
      hireDate: '2021-12-05',
      experience: '2년 1개월',
      certifications: ['물류관리사'],
      currentTask: '야간 근무 완료'
    },
    {
      id: 'WH-008',
      name: '신예린',
      position: '데이터입력원',
      department: 'administration',
      shift: 'day',
      status: 'working',
      checkIn: '09:00',
      checkOut: null,
      workHours: 5.5,
      targetHours: 8,
      phone: '010-8888-9999',
      email: 'shin.yr@warehouse.com',
      hireDate: '2022-04-11',
      experience: '1년 9개월',
      certifications: ['컴활 1급', 'ERP 정보관리사'],
      currentTask: '재고 데이터 업데이트'
    }
  ];

  const departmentOptions = [
    { value: 'all', label: '전체 부서' },
    { value: 'management', label: '관리부' },
    { value: 'logistics', label: '물류부' },
    { value: 'inventory', label: '재고관리부' },
    { value: 'quality', label: '품질관리부' },
    { value: 'packaging', label: '포장부' },
    { value: 'shipping', label: '배송부' },
    { value: 'administration', label: '사무부' }
  ];

  const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'working', label: '근무중' },
    { value: 'break', label: '휴식중' },
    { value: 'off_duty', label: '퇴근' },
    { value: 'absent', label: '결근' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800 border-green-200';
      case 'break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'off_duty': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working': return '근무중';
      case 'break': return '휴식중';
      case 'off_duty': return '퇴근';
      case 'absent': return '결근';
      default: return '알 수 없음';
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case 'management': return '관리부';
      case 'logistics': return '물류부';
      case 'inventory': return '재고관리부';
      case 'quality': return '품질관리부';
      case 'packaging': return '포장부';
      case 'shipping': return '배송부';
      case 'administration': return '사무부';
      default: return department;
    }
  };

  const getShiftText = (shift: string) => {
    switch (shift) {
      case 'day': return '주간';
      case 'evening': return '오후';
      case 'night': return '야간';
      default: return shift;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalEmployees = employees.length;
  const workingEmployees = employees.filter(e => e.status === 'working').length;
  const onBreakEmployees = employees.filter(e => e.status === 'break').length;
  const offDutyEmployees = employees.filter(e => e.status === 'off_duty').length;

  // Button handlers
  const handleShowSchedule = () => {
    setShowScheduleModal(true);
    addNotification('근무표를 불러오고 있습니다...', 'info');
  };

  const handleAddEmployee = () => {
    setShowAddEmployeeModal(true);
  };

  const handleShowAttendance = () => {
    setShowAttendanceModal(true);
    addNotification('출입 기록을 조회하고 있습니다...', 'info');
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleCallEmployee = (employee: any) => {
    addNotification(`${employee.name}님에게 전화를 걸고 있습니다...`, 'info');
    setTimeout(() => {
      addNotification(`${employee.name}님과 통화가 연결되었습니다.`, 'success');
    }, 2000);
  };

  const handleEmailEmployee = (employee: any) => {
    addNotification(`${employee.name}님에게 이메일을 발송했습니다.`, 'success');
  };

  const handleSubmitAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddEmployeeModal(false);
    addNotification('새 직원이 등록되었습니다.', 'success');
  };

  const handleSubmitEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
    addNotification(`${selectedEmployee?.name}님의 정보가 수정되었습니다.`, 'success');
    setSelectedEmployee(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar items={sidebarItems} userRole="Warehouse Manager" />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">직원 관리</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {currentTime.toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })} {currentTime.toLocaleTimeString('ko-KR')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" onClick={handleShowSchedule}>
                <i className="ri-calendar-line mr-2"></i>
                근무표
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddEmployee}>
                <i className="ri-user-add-line mr-2"></i>
                직원 등록
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs 
          navItems={navItems} 
          moduleColor="bg-indigo-600"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 직원 수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">등록된 직원</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">현재 근무중</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workingEmployees}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">활동 중</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">휴식중</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{onBreakEmployees}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">일시 중단</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <i className="ri-pause-circle-line text-yellow-600 dark:text-yellow-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">퇴근</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{offDutyEmployees}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">근무 종료</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <i className="ri-logout-circle-line text-gray-600 dark:text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Button variant="secondary" size="md" onClick={handleShowAttendance}>
              <i className="ri-qr-scan-line mr-2"></i>
              출입 기록
            </Button>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">직원 목록</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{employee.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">({employee.id})</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                          {getStatusText(employee.status)}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {getShiftText(employee.shift)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">직급</p>
                          <p className="font-medium text-gray-900 dark:text-white">{employee.position}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">부서</p>
                          <p className="font-medium text-gray-900 dark:text-white">{getDepartmentText(employee.department)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">경력</p>
                          <p className="font-medium text-gray-900 dark:text-white">{employee.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">현재 업무</p>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">{employee.currentTask}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => handleCallEmployee(employee)}>
                        <i className="ri-phone-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEmailEmployee(employee)}>
                        <i className="ri-mail-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEditEmployee(employee)}>
                        <i className="ri-edit-line"></i>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">출근 시간</p>
                      <p className="font-medium text-gray-900 dark:text-white">{employee.checkIn || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">퇴근 시간</p>
                      <p className="font-medium text-gray-900 dark:text-white">{employee.checkOut || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">근무 시간</p>
                      <p className="font-medium text-gray-900 dark:text-white">{employee.workHours}h / {employee.targetHours}h</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">연락처</p>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{employee.phone}</p>
                    </div>
                  </div>

                  {/* Work Progress */}
                  {employee.status === 'working' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>근무 진행률</span>
                        <span>{Math.round((employee.workHours / employee.targetHours) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((employee.workHours / employee.targetHours) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">보유 자격증</p>
                    <div className="flex flex-wrap gap-1">
                      {employee.certifications.map((cert, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
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

        {/* Add Employee Modal */}
        {showAddEmployeeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">직원 등록</h2>
                <button
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitAddEmployee} className="space-y-4">
                <Input
                  label="이름"
                  placeholder="직원 이름을 입력하세요"
                  required
                />
                <Input
                  label="직책"
                  placeholder="직책을 입력하세요"
                  required
                />
                <Select
                  label="부서"
                  options={departmentOptions.filter(opt => opt.value !== 'all')}
                  required
                />
                <Input
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  required
                />
                <Input
                  label="전화번호"
                  placeholder="전화번호를 입력하세요"
                  required
                />
                <Input
                  label="입사일"
                  type="date"
                  required
                />
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    직원 등록
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddEmployeeModal(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {showEditModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">직원 정보 편집</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitEditEmployee} className="space-y-4">
                <Input
                  label="직원 ID"
                  value={selectedEmployee.id}
                  disabled
                />
                <Input
                  label="이름"
                  defaultValue={selectedEmployee.name}
                />
                <Input
                  label="직책"
                  defaultValue={selectedEmployee.position}
                />
                <Input
                  label="이메일"
                  type="email"
                  defaultValue={selectedEmployee.email}
                />
                <Input
                  label="전화번호"
                  defaultValue={selectedEmployee.phone}
                />
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
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

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">주간 근무표</h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3 text-gray-900 dark:text-white">직원</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">월</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">화</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">수</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">목</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">금</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">토</th>
                      <th className="text-center p-3 text-gray-900 dark:text-white">일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 5).map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-3 text-gray-900 dark:text-white font-medium">{employee.name}</td>
                        <td className="p-3 text-center text-gray-600 dark:text-gray-300">08:00-17:00</td>
                        <td className="p-3 text-center text-gray-600 dark:text-gray-300">08:00-17:00</td>
                        <td className="p-3 text-center text-gray-600 dark:text-gray-300">08:00-17:00</td>
                        <td className="p-3 text-center text-gray-600 dark:text-gray-300">08:00-17:00</td>
                        <td className="p-3 text-center text-gray-600 dark:text-gray-300">08:00-17:00</td>
                        <td className="p-3 text-center text-red-600 dark:text-red-400">휴무</td>
                        <td className="p-3 text-center text-red-600 dark:text-red-400">휴무</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowScheduleModal(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {showAttendanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">출입 기록</h2>
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {employees.filter(e => e.checkIn).map((employee, index) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <i className="ri-login-circle-line text-green-600 dark:text-green-400 text-sm"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{employee.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">출근: {employee.checkIn}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {employee.checkOut ? `퇴근: ${employee.checkOut}` : '근무중'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowAttendanceModal(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
