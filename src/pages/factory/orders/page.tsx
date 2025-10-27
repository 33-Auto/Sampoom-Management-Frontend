
import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';

export default function FactoryOrders() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const orders = [
    {
      id: 'PO-2024-0115-A',
      customer: '현대자동차',
      product: '엔진 어셈블리 A-Type',
      quantity: 120,
      completed: 87,
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-01-20',
      assignedLine: 'LINE-A',
      startDate: '2024-01-15',
      estimatedCompletion: '2024-01-19'
    },
    {
      id: 'PO-2024-0115-B',
      customer: '기아자동차',
      product: '브레이크 시스템 B-Type',
      quantity: 80,
      completed: 0,
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-25',
      assignedLine: 'LINE-B',
      startDate: '2024-01-18',
      estimatedCompletion: '2024-01-24'
    },
    {
      id: 'PO-2024-0115-C',
      customer: '삼성전자',
      product: '전자 제어 모듈',
      quantity: 200,
      completed: 156,
      priority: 'urgent',
      status: 'in_progress',
      dueDate: '2024-01-18',
      assignedLine: 'LINE-C',
      startDate: '2024-01-14',
      estimatedCompletion: '2024-01-17'
    },
    {
      id: 'PO-2024-0115-D',
      customer: 'LG전자',
      product: '필터 어셈블리',
      quantity: 150,
      completed: 150,
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-16',
      assignedLine: 'LINE-D',
      startDate: '2024-01-12',
      estimatedCompletion: '2024-01-16'
    },
    {
      id: 'PO-2024-0115-E',
      customer: '포스코',
      product: '금속 부품 세트',
      quantity: 300,
      completed: 0,
      priority: 'high',
      status: 'scheduled',
      dueDate: '2024-01-30',
      assignedLine: 'LINE-A',
      startDate: '2024-01-22',
      estimatedCompletion: '2024-01-28'
    }
  ];

  const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'pending', label: '대기중' },
    { value: 'scheduled', label: '예정됨' },
    { value: 'in_progress', label: '진행중' },
    { value: 'completed', label: '완료' },
    { value: 'delayed', label: '지연' }
  ];

  const priorityOptions = [
    { value: 'all', label: '전체 우선순위' },
    { value: 'urgent', label: '긴급' },
    { value: 'high', label: '높음' },
    { value: 'medium', label: '보통' },
    { value: 'low', label: '낮음' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-green/10 text-success-green border-success-green/20';
      case 'in_progress': return 'bg-main-100 text-main-700 border-main-200';
      case 'pending': return 'bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20';
      case 'scheduled': return 'bg-main-200/50 text-main-800 border-main-300';
      case 'delayed': return 'bg-error-red/10 text-error-red border-error-red/20';
      default: return 'bg-grey-100 text-grey-400 border-grey-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in_progress': return '진행중';
      case 'pending': return '대기중';
      case 'scheduled': return '예정됨';
      case 'delayed': return '지연';
      default: return '알 수 없음';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error-red/10 text-error-red border-error-red/20';
      case 'high': return 'bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20';
      case 'medium': return 'bg-main-100 text-main-700 border-main-200';
      case 'low': return 'bg-grey-100 text-grey-400 border-grey-200';
      default: return 'bg-grey-100 text-grey-400 border-grey-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '긴급';
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
  const urgentOrders = orders.filter(o => o.priority === 'urgent').length;

  return (
    <div className=" min-h-screen bg-bg-white dark:bg-bg-black transition-colors duration-200">

      <div className="-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-bg-black dark:text-bg-card-white mb-1">생산 주문 관리</h1>
              <p className="text-grey-400 dark:text-grey-300">
                {currentTime.toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })} {currentTime.toLocaleTimeString('ko-KR')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                새 주문
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-400 dark:text-grey-300">총 주문</p>
                <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{totalOrders}</p>
                <p className="text-xs text-main-600 mt-1">활성 주문</p>
              </div>
              <div className="w-10 h-10 bg-main-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-line text-main-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-400 dark:text-grey-300">완료된 주문</p>
                <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{completedOrders}</p>
                <p className="text-xs text-success-green mt-1">이번 주</p>
              </div>
              <div className="w-10 h-10 bg-success-green/10 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-success-green"></i>
              </div>
            </div>
          </div>

          <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-400 dark:text-grey-300">진행중인 주문</p>
                <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{inProgressOrders}</p>
                <p className="text-xs text-main-600 mt-1">생산 라인 가동</p>
              </div>
              <div className="w-10 h-10 bg-main-200/5

0 rounded-lg flex items-center justify-center">
                <i className="ri-play-circle-line text-main-700"></i>
              </div>
            </div>
          </div>

          <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-400 dark:text-grey-300">긴급 주문</p>
                <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{urgentOrders}</p>
                <p className="text-xs text-error-red mt-1">우선 처리 필요</p>
              </div>
              <div className="w-10 h-10 bg-error-red/10 rounded-lg flex items-center justify-center">
                <i className="ri-alarm-warning-line text-error-red"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg border border-grey-200 dark:border-grey-400 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="주문 번호, 고객사, 제품명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
            <Button variant="secondary" size="default">
              <i className="ri-filter-line mr-2"></i>
              고급 필터
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg border border-grey-200 dark:border-grey-400 shadow-sm">
          <div className="p-4 border-b border-grey-200 dark:border-grey-400">
            <h2 className="text-lg font-semibold text-bg-black dark:text-bg-card-white">주문 목록</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 bg-bg-white dark:bg-bg-black rounded-lg border border-grey-200 dark:border-grey-400">
                  <div className=" items-start justify-between mb-3">
                    <div className="-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-bg-black dark:text-bg-card-white">{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                          {getPriorityText(order.priority)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-grey-400 dark:text-grey-300">고객사</p>
                          <p className="font-medium text-bg-black dark:text-bg-card-white">{order.customer}</p>
                        </div>
                        <div>
                          <p className="text-grey-400 dark:text-grey-300">제품명</p>
                          <p className="font-medium text-bg-black dark:text-bg-card-white">{order.product}</p>
                        </div>
                        <div>
                          <p className="text-grey-400 dark:text-grey-300">할당 라인</p>
                          <p className="font-medium text-bg-black dark:text-bg-card-white">{order.assignedLine}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm">
                        <i className="ri-eye-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <i className="ri-edit-line"></i>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-grey-400 dark:text-grey-300">수량</p>
                      <p className="font-medium text-bg-black dark:text-bg-card-white">{order.quantity}개</p>
                    </div>
                    <div>
                      <p className="text-grey-400 dark:text-grey-300">완료</p>
                      <p className="font-medium text-bg-black dark:text-bg-card-white">{order.completed}개</p>
                    </div>
                    <div>
                      <p className="text-grey-400 dark:text-grey-300">납기일</p>
                      <p className="font-medium text-bg-black dark:text-bg-card-white">{order.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-grey-400 dark:text-grey-300">예상 완료</p>
                      <p className="font-medium text-bg-black dark:text-bg-card-white">{order.estimatedCompletion}</p>
                    </div>
                  </div>

                  {order.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm text-grey-400 dark:text-grey-300 mb-1">
                        <span>진행률</span>
                        <span>{Math.round((order.completed / order.quantity) * 100)}%</span>
                      </div>
                      <div className="w-full bg-grey-200 dark:bg-grey-400 rounded-full h-2">
                        <div 
                          className="bg-main-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(order.completed / order.quantity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
