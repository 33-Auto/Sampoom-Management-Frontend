// import { useState, useEffect } from 'react';

// import { useNotification } from '@/app/providers/NotificationContext';
// import { Button, Input, Select } from '@/shared/ui';

// export const FactoryMaterials = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showStockModal, setShowStockModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
//   const [stockAction, setStockAction] = useState<'add' | 'subtract'>('add');
//   const [stockAmount, setStockAmount] = useState('');
//   const { showSuccess, showInfo } = useNotification();

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const materials = [
//     {
//       code: 'MAT-001',
//       name: '알루미늄 합금 봉재',
//       category: 'metal',
//       current: 15,
//       minimum: 50,
//       maximum: 200,
//       unit: 'kg',
//       location: 'A-01-15',
//       supplier: '포스코',
//       unitPrice: 8500,
//       lastOrder: '2024-01-10',
//       status: 'critical'
//     },
//     {
//       code: 'MAT-002',
//       name: '고무 시일링',
//       category: 'rubber',
//       current: 25,
//       minimum: 100,
//       maximum: 500,
//       unit: '개',
//       location: 'B-03-22',
//       supplier: '한국타이어',
//       unitPrice: 1200,
//       lastOrder: '2024-01-08',
//       status: 'low'
//     },
//     {
//       code: 'MAT-003',
//       name: '전자 센서',
//       category: 'electronic',
//       current: 8,
//       minimum: 30,
//       maximum: 150,
//       unit: '개',
//       location: 'C-02-08',
//       supplier: '삼성전자',
//       unitPrice: 45000,
//       lastOrder: '2024-01-12',
//       status: 'critical'
//     },
//     {
//       code: 'MAT-004',
//       name: '스테인리스 볼트',
//       category: 'fastener',
//       current: 45,
//       minimum: 200,
//       maximum: 1000,
//       unit: '개',
//       location: 'A-05-33',
//       supplier: '동국제강',
//       unitPrice: 350,
//       lastOrder: '2024-01-09',
//       status: 'low'
//     },
//     {
//       code: 'MAT-005',
//       name: '플라스틱 하우징',
//       category: 'plastic',
//       current: 180,
//       minimum: 100,
//       maximum: 400,
//       unit: '개',
//       location: 'D-01-12',
//       supplier: 'LG화학',
//       unitPrice: 2800,
//       lastOrder: '2024-01-11',
//       status: 'normal'
//     },
//     {
//       code: 'MAT-006',
//       name: '구리 와이어',
//       category: 'metal',
//       current: 320,
//       minimum: 150,
//       maximum: 500,
//       unit: 'm',
//       location: 'B-02-18',
//       supplier: 'LS전선',
//       unitPrice: 120,
//       lastOrder: '2024-01-13',
//       status: 'normal'
//     },
//     {
//       code: 'MAT-007',
//       name: '유압 오일',
//       category: 'fluid',
//       current: 85,
//       minimum: 100,
//       maximum: 300,
//       unit: 'L',
//       location: 'E-01-05',
//       supplier: 'SK에너지',
//       unitPrice: 15000,
//       lastOrder: '2024-01-07',
//       status: 'low'
//     },
//     {
//       code: 'MAT-008',
//       name: '베어링',
//       category: 'mechanical',
//       current: 250,
//       minimum: 80,
//       maximum: 400,
//       unit: '개',
//       location: 'A-03-27',
//       supplier: 'NSK코리아',
//       unitPrice: 8900,
//       lastOrder: '2024-01-14',
//       status: 'normal'
//     }
//   ];

//   const categoryOptions = [
//     { value: 'all', label: '전체 카테고리' },
//     { value: 'metal', label: '금속' },
//     { value: 'rubber', label: '고무' },
//     { value: 'electronic', label: '전자부품' },
//     { value: 'fastener', label: '체결부품' },
//     { value: 'plastic', label: '플라스틱' },
//     { value: 'fluid', label: '유체' },
//     { value: 'mechanical', label: '기계부품' }
//   ];

//   const statusOptions = [
//     { value: 'all', label: '전체 상태' },
//     { value: 'critical', label: '긴급' },
//     { value: 'low', label: '부족' },
//     { value: 'normal', label: '정상' },
//     { value: 'excess', label: '과다' }
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'critical': return 'bg-error-red/10 text-error-red border-error-red/20';
//       case 'low': return 'bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20';
//       case 'normal': return 'bg-success-green/10 text-success-green border-success-green/20';
//       case 'excess': return 'bg-main-100 text-main-700 border-main-200';
//       default: return 'bg-grey-100 text-grey-400 border-grey-200';
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'critical': return '긴급';
//       case 'low': return '부족';
//       case 'normal': return '정상';
//       case 'excess': return '과다';
//       default: return '알 수 없음';
//     }
//   };

//   const getCategoryText = (category: string) => {
//     switch (category) {
//       case 'metal': return '금속';
//       case 'rubber': return '고무';
//       case 'electronic': return '전자부품';
//       case 'fastener': return '체결부품';
//       case 'plastic': return '플라스틱';
//       case 'fluid': return '유체';
//       case 'mechanical': return '기계부품';
//       default: return category;
//     }
//   };

//   const handleStockAction = (material: any, action: 'add' | 'subtract') => {
//     setSelectedMaterial(material);
//     setStockAction(action);
//     setShowStockModal(true);
//   };

//   const handleStockSubmit = () => {
//     if (!stockAmount || !selectedMaterial) return;

//     const action = stockAction === 'add' ? '입고' : '출고';
//     showSuccess('성공', `${selectedMaterial.name} ${stockAmount}${selectedMaterial.unit} ${action} 처리되었습니다.`);
//     setShowStockModal(false);
//     setStockAmount('');
//     setSelectedMaterial(null);
//   };

//   const handleEditMaterial = (material: any) => {
//     setSelectedMaterial(material);
//     setShowEditModal(true);
//   };

//   const handleDownloadReport = () => {
//     showInfo('정보', '재고 보고서를 다운로드합니다.');
//   };

//   const handleEmergencyOrder = () => {
//     showSuccess('성공', '긴급 주문 요청이 전송되었습니다.');
//   };

//   const handleBarcodeScanner = () => {
//     showInfo('정보', '바코드 스캐너를 실행합니다.');
//   };

//   const filteredMaterials = materials.filter(material => {
//     const matchesSearch = material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
//     const matchesStatus = statusFilter === 'all' || material.status === statusFilter;

//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const totalMaterials = materials.length;
//   const criticalMaterials = materials.filter(m => m.status === 'critical').length;
//   const lowStockMaterials = materials.filter(m => m.status === 'low').length;
//   const totalValue = materials.reduce((sum, m) => sum + (m.current * m.unitPrice), 0);

//   return (
//     <div className=" min-h-screen bg-bg-white dark:bg-bg-black transition-colors duration-200">

//       <div className="-1 p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-bg-black dark:text-bg-card-white mb-1">원자재 재고 관리</h1>
//               <p className="text-grey-400 dark:text-grey-300">
//                 {currentTime.toLocaleDateString('ko-KR', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                   weekday: 'long'
//                 })} {currentTime.toLocaleTimeString('ko-KR')}
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Button variant="secondary" size="sm" onClick={handleDownloadReport}>
//                 <i className="ri-download-line mr-2"></i>
//                 재고 보고서
//               </Button>
//               <Button variant="default" size="sm" onClick={handleEmergencyOrder}>
//                 <i className="ri-shopping-cart-line mr-2"></i>
//                 긴급 주문
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-grey-400 dark:text-grey-300">총 원자재</p>
//                 <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{totalMaterials}</p>
//                 <p className="text-xs text-main-600 mt-1">관리 품목</p>
//               </div>
//               <div className="w-10 h-10 bg-main-100 rounded-lg flex items-center justify-center">
//                 <i className="ri-archive-line text-main-600"></i>
//               </div>
//             </div>
//           </div>

//           <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-grey-400 dark:text-grey-300">긴급 보충 필요</p>
//                 <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{criticalMaterials}</p>
//                 <p className="text-xs text-error-red mt-1">즉시 주문 필요</p>
//               </div>
//               <div className="w-10 h-10 bg-error-red/10 rounded-lg flex items-center justify-center">
//                 <i className="ri-alarm-warning-line text-error-red"></i>
//               </div>
//             </div>
//           </div>

//           <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-grey-400 dark:text-grey-300">재고 부족</p>
//                 <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">{lowStockMaterials}</p>
//                 <p className="text-xs text-warning-yellow mt-1">주문 검토 필요</p>
//               </div>
//               <div className="w-10 h-10 bg-warning-yellow/10 rounded-lg flex items-center justify-center">
//                 <i className="ri-error-warning-line text-warning-yellow"></i>
//               </div>
//             </div>
//           </div>

//           <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-4 border border-grey-200 dark:border-grey-400 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-grey-400 dark:text-grey-300">총 재고 가치</p>
//                 <p className="text-2xl font-bold text-bg-black dark:text-bg-card-white">₩{(totalValue / 1000000).toFixed(1)}M</p>
//                 <p className="text-xs text-success-green mt-1">현재 보유 가치</p>
//               </div>
//               <div className="w-10 h-10 bg-success-green/10 rounded-lg flex items-center justify-center">
//                 <i className="ri-money-dollar-circle-line text-success-green"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg border border-grey-200 dark:border-grey-400 shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Input
//               placeholder="코드, 품명, 공급업체 검색..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Select
//               options={categoryOptions}
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//             />
//             <Select
//               options={statusOptions}
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             />
//             <Button variant="secondary" size="default" onClick={handleBarcodeScanner}>
//               <i className="ri-barcode-line mr-2"></i>
//               바코드 스캔
//             </Button>
//           </div>
//         </div>

//         {/* Materials List */}
//         <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg border border-grey-200 dark:border-grey-400 shadow-sm">
//           <div className="p-4 border-b border-grey-200 dark:border-grey-400">
//             <h2 className="text-lg font-semibold text-bg-black dark:text-bg-card-white">원자재 목록</h2>
//           </div>
//           <div className="p-4">
//             <div className="space-y-4">
//               {filteredMaterials.map((material) => (
//                 <div key={material.code} className="p-4 bg-bg-white dark:bg-bg-black rounded-lg border border-grey-200 dark:border-grey-400">
//                   <div className=" items-start justify-between mb-3">
//                     <div className="-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <span className="font-semibold text-bg-black dark:text-bg-card-white">{material.code}</span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>
//                           {getStatusText(material.status)}
//                         </span>
//                         <span className="px-2 py-1 bg-grey-200 dark:bg-grey-400 text-bg-black dark:text-bg-card-white rounded-full text-xs">
//                           {getCategoryText(material.category)}
//                         </span>
//                       </div>
//                       <h3 className="font-medium text-bg-black dark:text-bg-card-white mb-2">{material.name}</h3>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                           <p className="text-grey-400 dark:text-grey-300">현재 재고</p>
//                           <p className="font-medium text-bg-black dark:text-bg-card-white">{material.current} {material.unit}</p>
//                         </div>
//                         <div>
//                           <p className="text-grey-400 dark:text-grey-300">최소 재고</p>
//                           <p className="font-medium text-bg-black dark:text-bg-card-white">{material.minimum} {material.unit}</p>
//                         </div>
//                         <div>
//                           <p className="text-grey-400 dark:text-grey-300">보관 위치</p>
//                           <p className="font-medium text-bg-black dark:text-bg-card-white">{material.location}</p>
//                         </div>
//                         <div>
//                           <p className="text-grey-400 dark:text-grey-300">공급업체</p>
//                           <p className="font-medium text-bg-black dark:text-bg-card-white">{material.supplier}</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="secondary" size="sm" onClick={() => handleStockAction(material, 'add')}>
//                         <i className="ri-add-line"></i>
//                       </Button>
//                       <Button variant="secondary" size="sm" onClick={() => handleStockAction(material, 'subtract')}>
//                         <i className="ri-subtract-line"></i>
//                       </Button>
//                       <Button variant="secondary" size="sm" onClick={() => handleEditMaterial(material)}>
//                         <i className="ri-edit-line"></i>
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
//                     <div>
//                       <p className="text-grey-400 dark:text-grey-300">단가</p>
//                       <p className="font-medium text-bg-black dark:text-bg-card-white">₩{material.unitPrice.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-grey-400 dark:text-grey-300">총 가치</p>
//                       <p className="font-medium text-bg-black dark:text-bg-card-white">₩{(material.current * material.unitPrice).toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-grey-400 dark:text-grey-300">최대 재고</p>
//                       <p className="font-medium text-bg-black dark:text-bg-card-white">{material.maximum} {material.unit}</p>
//                     </div>
//                     <div>
//                       <p className="text-grey-400 dark:text-grey-300">최근 주문</p>
//                       <p className="font-medium text-bg-black dark:text-bg-card-white">{material.lastOrder}</p>
//                     </div>
//                   </div>

//                   <div className="mt-3">
//                     <div className="flex items-center justify-between text-sm text-grey-400 dark:text-grey-300 mb-1">
//                       <span>재고 수준</span>
//                       <span>{Math.round((material.current / material.maximum) * 100)}%</span>
//                     </div>
//                     <div className="w-full bg-grey-200 dark:bg-grey-400 rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           material.status === 'critical' ? 'bg-error-red' :
//                           material.status === 'low' ? 'bg-warning-yellow' :
//                           'bg-success-green'
//                         }`}
//                         style={{ width: `${Math.min((material.current / material.maximum) * 100, 100)}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stock Action Modal */}
//       {showStockModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold text-bg-black dark:text-bg-card-white mb-4">
//               {stockAction === 'add' ? '재고 입고' : '재고 출고'}
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   원자재
//                 </label>
//                 <p className="text-bg-black dark:text-bg-card-white">{selectedMaterial?.name}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   수량 ({selectedMaterial?.unit})
//                 </label>
//                 <Input
//                   type="number"
//                   value={stockAmount}
//                   onChange={(e) => setStockAmount(e.target.value)}
//                   placeholder="수량을 입력하세요"
//                 />
//               </div>
//             </div>
//             <div className=" justify-end space-x-3 mt-6">
//               <Button variant="secondary" onClick={() => setShowStockModal(false)}>
//                 취소
//               </Button>
//               <Button variant="default" onClick={handleStockSubmit}>
//                 {stockAction === 'add' ? '입고' : '출고'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Material Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg p-6 w-full max-w-2xl">
//             <h3 className="text-lg font-semibold text-bg-black dark:text-bg-card-white mb-4">
//               원자재 정보 수정
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   원자재 코드
//                 </label>
//                 <Input defaultValue={selectedMaterial?.code} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   원자재명
//                 </label>
//                 <Input defaultValue={selectedMaterial?.name} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   최소 재고
//                 </label>
//                 <Input type="number" defaultValue={selectedMaterial?.minimum} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   최대 재고
//                 </label>
//                 <Input type="number" defaultValue={selectedMaterial?.maximum} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                   보관 위치
//                 </label>
//                 <Input defaultValue={selectedMaterial?.location} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-grey-400 dark:text-grey-300 mb-1">
//                     공급업체
//                   </label>
//                   <Input defaultValue={selectedMaterial?.supplier} />
//                 </div>
//             </div>
//             <div className=" justify-end space-x-3 mt-6">
//               <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//                 취소
//               </Button>
//               <Button variant="default" onClick={() => {
//                 showSuccess('성공', '원자재 정보가 수정되었습니다.');
//                 setShowEditModal(false);
//               }}>
//                 저장
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

export {};
