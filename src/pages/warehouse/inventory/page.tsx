
import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { useNotification } from '@/app/providers/NotificationContext';

export default function WarehouseInventory() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const { showError, showSuccess, showInfo } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const inventory = [
    {
      code: 'ENG-4521',
      name: '엔진 오일 필터',
      category: 'engine',
      current: 8,
      minimum: 50,
      maximum: 200,
      unit: '개',
      location: 'A-01-15',
      supplier: '현대모비스',
      unitPrice: 85000,
      lastMovement: '2024-01-14',
      movementType: 'out',
      status: 'critical',
      reserved: 5,
      available: 3
    },
    {
      code: 'BRK-3301',
      name: '브레이크 디스크',
      category: 'brake',
      current: 3,
      minimum: 25,
      maximum: 100,
      unit: '개',
      location: 'B-02-08',
      supplier: '만도',
      unitPrice: 120000,
      lastMovement: '2024-01-13',
      movementType: 'out',
      status: 'critical',
      reserved: 2,
      available: 1
    },
    {
      code: 'TIR-7789',
      name: '타이어 밸브 캡',
      category: 'tire',
      current: 15,
      minimum: 100,
      maximum: 500,
      unit: '개',
      location: 'C-03-22',
      supplier: '넥센타이어',
      unitPrice: 15000,
      lastMovement: '2024-01-15',
      movementType: 'in',
      status: 'low',
      reserved: 8,
      available: 7
    },
    {
      code: 'ELC-9902',
      name: '헤드라이트 벌브',
      category: 'electrical',
      current: 12,
      minimum: 40,
      maximum: 150,
      unit: '개',
      location: 'D-01-12',
      supplier: '오스람',
      unitPrice: 45000,
      lastMovement: '2024-01-14',
      movementType: 'out',
      status: 'low',
      reserved: 4,
      available: 8
    },
    {
      code: 'AIR-5566',
      name: '에어 필터',
      category: 'filter',
      current: 85,
      minimum: 50,
      maximum: 200,
      unit: '개',
      location: 'A-04-18',
      supplier: '만도',
      unitPrice: 32000,
      lastMovement: '2024-01-15',
      movementType: 'in',
      status: 'normal',
      reserved: 12,
      available: 73
    },
    {
      code: 'TRN-8844',
      name: '변속기 오일',
      category: 'transmission',
      current: 45,
      minimum: 30,
      maximum: 100,
      unit: 'L',
      location: 'E-02-05',
      supplier: 'SK에너지',
      unitPrice: 95000,
      lastMovement: '2024-01-13',
      movementType: 'out',
      status: 'normal',
      reserved: 10,
      available: 35
    },
    {
      code: 'SUS-2233',
      name: '서스펜션 스프링',
      category: 'suspension',
      current: 28,
      minimum: 20,
      maximum: 80,
      unit: '개',
      location: 'B-05-33',
      supplier: 'KYB코리아',
      unitPrice: 180000,
      lastMovement: '2024-01-12',
      movementType: 'in',
      status: 'normal',
      reserved: 8,
      available: 20
    },
    {
      code: 'EXH-7711',
      name: '배기관 가스켓',
      category: 'exhaust',
      current: 120,
      minimum: 50,
      maximum: 200,
      unit: '개',
      location: 'C-01-27',
      supplier: '보쉬',
      unitPrice: 25000,
      lastMovement: '2024-01-15',
      movementType: 'in',
      status: 'normal',
      reserved: 15,
      available: 105
    }
  ];

  const categoryOptions = [
    { value: 'all', label: '전체 카테고리' },
    { value: 'engine', label: '엔진' },
    { value: 'brake', label: '브레이크' },
    { value: 'tire', label: '타이어' },
    { value: 'electrical', label: '전기' },
    { value: 'filter', label: '필터' },
    { value: 'transmission', label: '변속기' },
    { value: 'suspension', label: '서스펜션' },
    { value: 'exhaust', label: '배기' }
  ];

  const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 'critical', label: '긴급' },
    { value: 'low', label: '부족' },
    { value: 'normal', label: '정상' },
    { value: 'excess', label: '과다' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'excess': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return '긴급';
      case 'low': return '부족';
      case 'normal': return '정상';
      case 'excess': return '과다';
      default: return '알 수 없음';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'engine': return '엔진';
      case 'brake': return '브레이크';
      case 'tire': return '타이어';
      case 'electrical': return '전기';
      case 'filter': return '필터';
      case 'transmission': return '변속기';
      case 'suspension': return '서스펜션';
      case 'exhaust': return '배기';
      default: return category;
    }
  };

  const getMovementIcon = (type: string) => {
    return type === 'in' ? 'ri-arrow-down-line text-green-600' : 'ri-arrow-up-line text-red-600';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = inventory.length;
  const criticalItems = inventory.filter(i => i.status === 'critical').length;
  const lowStockItems = inventory.filter(i => i.status === 'low').length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.current * i.unitPrice), 0);

  // Button handlers
  const handleDownloadReport = () => {
    showInfo('정보', '재고 보고서를 다운로드하고 있습니다...');
    setTimeout(() => {
      showSuccess('성공', '재고 보고서 다운로드가 완료되었습니다.');
    }, 2000);
  };

  const handleAddStock = (item: any) => {
    setSelectedItem(item);
    setShowAddStockModal(true);
  };

  const handleSubtractStock = (item: any) => {
    if (item.available <= 0) {
      showError('오류', '사용 가능한 재고가 없습니다.');
      return;
    }
    showSuccess('성공', `${item.name} 재고를 1개 차감했습니다.`);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleBarcodeScanner = () => {
    setShowBarcodeScanner(true);
    showInfo('정보', '바코드 스캐너를 실행합니다...');
    setTimeout(() => {
      setShowBarcodeScanner(false);
      showSuccess('성공', '바코드 스캔이 완료되었습니다.');
    }, 3000);
  };

  const handleSubmitAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddStockModal(false);
    showSuccess('성공', `${selectedItem?.name} 입고 등록이 완료되었습니다.`);
    setSelectedItem(null);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
    showSuccess('성공', `${selectedItem?.name} 정보가 수정되었습니다.`);
    setSelectedItem(null);
  };

  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

      <div className="-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">부품 재고 관리</h1>
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
              <Button variant="secondary" size="sm" onClick={handleDownloadReport}>
                <i className="ri-download-line mr-2"></i>
                재고 보고서
              </Button>
              <Button variant="default" size="sm" onClick={() => setShowAddStockModal(true)}>
                <i className="ri-add-line mr-2"></i>
                입고 등록
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 부품 종류</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">관리 품목</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <i className="ri-archive-line text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">긴급 보충 필요</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{criticalItems}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">즉시 주문 필요</p>
              </div>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <i className="ri-alarm-warning-line text-red-600 dark:text-red-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">재고 부족</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockItems}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">주문 검토 필요</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <i className="ri-error-warning-line text-orange-600 dark:text-orange-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 재고 가치</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₩{(totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">현재 보유 가치</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="코드, 부품명, 공급업체 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Button variant="secondary" size="default" onClick={handleBarcodeScanner}>
              <i className="ri-barcode-line mr-2"></i>
              바코드 스캔
            </Button>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">부품 재고 목록</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div key={item.code} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className=" items-start justify-between mb-3">
                    <div className="-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{item.code}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                          {getCategoryText(item.category)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <i className={getMovementIcon(item.movementType)}></i>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.movementType === 'in' ? '입고' : '출고'} ({item.lastMovement})
                          </span>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{item.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">현재 재고</p>
                          <p className="font-medium text-gray-900 dark:text-white">{item.current} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">사용 가능</p>
                          <p className="font-medium text-gray-900 dark:text-white">{item.available} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">예약됨</p>
                          <p className="font-medium text-gray-900 dark:text-white">{item.reserved} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">보관 위치</p>
                          <p className="font-medium text-gray-900 dark:text-white">{item.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => handleAddStock(item)}>
                        <i className="ri-add-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleSubtractStock(item)}>
                        <i className="ri-subtract-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleEditItem(item)}>
                        <i className="ri-edit-line"></i>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">최소 재고</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.minimum} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">최대 재고</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.maximum} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">단가</p>
                      <p className="font-medium text-gray-900 dark:text-white">₩{item.unitPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">공급업체</p>
                      <p className="font-medium text-gray-900 dark:text-white">{item.supplier}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>재고 수준</span>
                      <span>{Math.round((item.current / item.maximum) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.status === 'critical' ? 'bg-red-500' :
                          item.status === 'low' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((item.current / item.maximum) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Stock Modal */}
        {showAddStockModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">입고 등록</h2>
                <button
                  onClick={() => {
                    setShowAddStockModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitAddStock} className="space-y-4">
                <Input
                  label="부품 코드"
                  value={selectedItem?.code || ''}
                  disabled
                />
                <Input
                  label="부품명"
                  value={selectedItem?.name || ''}
                  disabled
                />
                <Input
                  label="입고 수량"
                  type="number"
                  placeholder="입고할 수량을 입력하세요"
                  required
                />
                <Input
                  label="공급업체"
                  defaultValue={selectedItem?.supplier || ''}
                />
                <Input
                  label="단가"
                  type="number"
                  defaultValue={selectedItem?.unitPrice || ''}
                />
                <div className=" space-x-3 pt-4">
                  <Button
                    type="submit"
                    variant="default"
                    className="-1"
                  >
                    입고 등록
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAddStockModal(false);
                      setSelectedItem(null);
                    }}
                    className="-1"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">부품 정보 편집</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <Input
                  label="부품 코드"
                  value={selectedItem.code}
                  disabled
                />
                <Input
                  label="부품명"
                  defaultValue={selectedItem.name}
                />
                <Input
                  label="최소 재고"
                  type="number"
                  defaultValue={selectedItem.minimum}
                />
                <Input
                  label="최대 재고"
                  type="number"
                  defaultValue={selectedItem.maximum}
                />
                <Input
                  label="보관 위치"
                  defaultValue={selectedItem.location}
                />
                <Input
                  label="공급업체"
                  defaultValue={selectedItem.supplier}
                />
                <div className=" space-x-3 pt-4">
                  <Button
                    type="submit"
                    variant="default"
                    className="-1"
                  >
                    변경사항 저장
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                    }}
                    className="-1"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barcode Scanner Modal */}
        {showBarcodeScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 transition-colors duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-barcode-line text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">바코드 스캔 중...</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">바코드를 카메라에 맞춰주세요</p>
                <div className="animate-pulse">
                  <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
