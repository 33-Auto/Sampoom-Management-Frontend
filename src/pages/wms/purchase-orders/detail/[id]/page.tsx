// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import ModuleHeader from '../../../../../components/feature/ModuleHeader';
// import NavigationTabs from '../../../../../components/feature/NavigationTabs';
// import Button from '../../../../../components/base/Button';

// // 발주서 상세 데이터 (실제로는 API에서 가져올 데이터)
// const purchaseOrderDetail = {
//   poNumber: 'PO-2024-001',
//   itemCode: 'RM-AL-001',
//   itemName: '알루미늄 합금 판재',
//   supplier: '한국금속공업',
//   supplierContact: {
//     phone: '02-1234-5678',
//     email: 'sales@koreanmetal.co.kr',
//     address: '서울시 강남구 테헤란로 123',
//     manager: '김영업',
//   },
//   orderedQty: 500,
//   receivedQty: 0,
//   pendingQty: 500,
//   unit: 'KG',
//   unitPrice: 15000,
//   totalAmount: 7500000,
//   orderDate: '2024-01-20',
//   expectedDate: '2024-01-25',
//   status: 'auto_approved',
//   creationType: 'auto',
//   ropTriggered: true,
//   currentStock: 45,
//   reorderPoint: 50,
//   autoProcessed: true,
//   processedAt: '2024-01-20 09:15:23',
//   requestedBy: '시스템 자동',
//   department: '창고관리부',
//   approvedBy: '시스템 자동승인',
//   approvedAt: '2024-01-20 09:15:25',
//   notes: 'ROP 기반 자동 발주 생성',
//   deliveryAddress: '경기도 안산시 단원구 공단로 456 ABC공장',
//   paymentTerms: '월말 결제',
//   deliveryTerms: 'EXW',
//   history: [
//     {
//       timestamp: '2024-01-20 09:15:23',
//       action: 'ROP 트리거',
//       description: '재고 수량이 ROP(50) 미만으로 감소',
//       user: '시스템',
//     },
//     {
//       timestamp: '2024-01-20 09:15:24',
//       action: '자동 발주 생성',
//       description: '발주서 PO-2024-001 자동 생성',
//       user: '시스템',
//     },
//     {
//       timestamp: '2024-01-20 09:15:25',
//       action: '자동 승인',
//       description: '신뢰 공급업체로 자동 승인 처리',
//       user: '시스템',
//     },
//     {
//       timestamp: '2024-01-20 09:16:00',
//       action: '공급업체 전송',
//       description: '발주서를 공급업체에 전송',
//       user: '시스템',
//     },
//   ],
// };

// export default function PurchaseOrderDetailPage() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState('basic');

//   const headerConfig = {
//     moduleTitle: '창고 관리 (WMS)',
//     moduleDescription: '창고 재고 현황 및 위치를 관리합니다',
//     moduleIcon: 'ri-warehouse-line',
//     moduleColor: 'bg-purple-500',
//     userRole: '창고 관리자',
//     userEmail: 'warehouse@company.com'
//   };

//   const navItems = [
//     { path: '/', label: '홈', icon: 'ri-home-line' },
//     { path: '/wms/shipping', label: '출고 지시', icon: 'ri-truck-line' },
//     { path: '/wms/inventory', label: '재고 현황', icon: 'ri-stack-line' },
//     { path: '/wms/receiving', label: '입고 관리', icon: 'ri-inbox-line' },
//     { path: '/wms/purchase-orders', label: '발주 관리', icon: 'ri-shopping-bag-line' },
//   ];

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       auto_approved: { label: '자동 승인', color: 'bg-green-100 text-green-800 border-green-200' },
//       completed: { label: '입고 완료', color: 'bg-blue-100 text-blue-800 border-blue-200' },
//       rejected: { label: '반려', color: 'bg-red-100 text-red-800 border-red-200' },
//       exception_review: { label: '예외 검토', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig];
//     return (
//       <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
//         {config.label}
//       </span>
//     );
//   };

//   const handleBack = () => {
//     navigate('/wms/purchase-orders');
//   };

//   const handleCancel = () => {
//     console.log('발주 취소:', id);
//   };

//   const handleModify = () => {
//     console.log('발주 수정:', id);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ModuleHeader {...headerConfig} />
//       <NavigationTabs
//         navItems={navItems}
//         moduleColor="bg-purple-500"
//       />

//       <div className="max-w-6xl mx-auto px-6 py-8">
//         {/* 페이지 헤더 */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <Button
//                 variant="secondary"
//                 size="sm"
//                 onClick={handleBack}
//               >
//                 <i className="ri-arrow-left-line mr-2"></i>
//                 뒤로
//               </Button>
//               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <i className="ri-file-text-line text-purple-600"></i>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">발주서 상세</h1>
//                 <p className="text-gray-600">{purchaseOrderDetail.poNumber}</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               {getStatusBadge(purchaseOrderDetail.status)}
//               <div className="flex space-x-2">
//                 <Button variant="secondary" size="sm" onClick={handlePrint}>
//                   <i className="ri-printer-line mr-2"></i>
//                   인쇄
//                 </Button>
//                 {purchaseOrderDetail.status === 'auto_approved' && (
//                   <>
//                     <Button variant="secondary" size="sm" onClick={handleModify}>
//                       <i className="ri-edit-line mr-2"></i>
//                       수정
//                     </Button>
//                     <Button variant="danger" size="sm" onClick={handleCancel}>
//                       <i className="ri-close-line mr-2"></i>
//                       취소
//                     </Button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 탭 네비게이션 */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab('basic')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === 'basic'
//                     ? 'border-purple-500 text-purple-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 기본 정보
//               </button>
//               <button
//                 onClick={() => setActiveTab('supplier')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === 'supplier'
//                     ? 'border-purple-500 text-purple-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 공급업체 정보
//               </button>
//               <button
//                 onClick={() => setActiveTab('history')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === 'history'
//                     ? 'border-purple-500 text-purple-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 처리 이력
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {/* 기본 정보 탭 */}
//             {activeTab === 'basic' && (
//               <div className="space-y-6">
//                 {/* 발주 기본 정보 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">발주 정보</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">발주번호:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.poNumber}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">발주일:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.orderDate}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">예상 입고일:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.expectedDate}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">생성 구분:</span>
//                         <span className="text-sm text-gray-900">
//                           {purchaseOrderDetail.creationType === 'auto' ? '자동 생성' : '수동 생성'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">ROP 트리거:</span>
//                         <span className="text-sm text-gray-900">
//                           {purchaseOrderDetail.ropTriggered ? '예' : '아니오'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">품목 정보</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">품목 코드:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.itemCode}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">품목명:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.itemName}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">현재 재고:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.currentStock} {purchaseOrderDetail.unit}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">재주문점(ROP):</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.reorderPoint} {purchaseOrderDetail.unit}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 수량 및 금액 정보 */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">수량 및 금액</h3>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-blue-600">{purchaseOrderDetail.orderedQty}</div>
//                         <div className="text-sm text-gray-500">발주 수량 ({purchaseOrderDetail.unit})</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-green-600">{purchaseOrderDetail.receivedQty}</div>
//                         <div className="text-sm text-gray-500">입고 수량 ({purchaseOrderDetail.unit})</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-orange-600">{purchaseOrderDetail.pendingQty}</div>
//                         <div className="text-sm text-gray-500">미입고 수량 ({purchaseOrderDetail.unit})</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-purple-600">₩{purchaseOrderDetail.totalAmount.toLocaleString()}</div>
//                         <div className="text-sm text-gray-500">총 발주 금액</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 추가 정보 */}
//                 <div className="border-t border-gray-200 pt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">추가 정보</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">요청자:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.requestedBy}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">부서:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.department}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">승인자:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.approvedBy}</span>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">결제 조건:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.paymentTerms}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium text-gray-500">배송 조건:</span>
//                         <span className="text-sm text-gray-900">{purchaseOrderDetail.deliveryTerms}</span>
//                       </div>
//                     </div>
//                   </div>
//                   {purchaseOrderDetail.notes && (
//                     <div className="mt-4">
//                       <span className="text-sm font-medium text-gray-500">비고:</span>
//                       <p className="text-sm text-gray-900 mt-1">{purchaseOrderDetail.notes}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* 공급업체 정보 탭 */}
//             {activeTab === 'supplier' && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">공급업체 정보</h3>
//                   <div className="bg-gray-50 rounded-lg p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span className="text-sm font-medium text-gray-500">업체명:</span>
//                           <span className="text-sm text-gray-900 font-medium">{purchaseOrderDetail.supplier}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-sm font-medium text-gray-500">담당자:</span>
//                           <span className="text-sm text-gray-900">{purchaseOrderDetail.supplierContact.manager}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-sm font-medium text-gray-500">전화번호:</span>
//                           <span className="text-sm text-gray-900">{purchaseOrderDetail.supplierContact.phone}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-sm font-medium text-gray-500">이메일:</span>
//                           <span className="text-sm text-gray-900">{purchaseOrderDetail.supplierContact.email}</span>
//                         </div>
//                       </div>
//                       <div className="space-y-3">
//                         <div>
//                           <span className="text-sm font-medium text-gray-500">주소:</span>
//                           <p className="text-sm text-gray-900 mt-1">{purchaseOrderDetail.supplierContact.address}</p>
//                         </div>
//                         <div>
//                           <span className="text-sm font-medium text-gray-500">배송지:</span>
//                           <p className="text-sm text-gray-900 mt-1">{purchaseOrderDetail.deliveryAddress}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* 처리 이력 탭 */}
//             {activeTab === 'history' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-gray-900">처리 이력</h3>
//                 <div className="space-y-4">
//                   {purchaseOrderDetail.history.map((item, index) => (
//                     <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
//                       <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <i className="ri-time-line text-purple-600 text-sm"></i>
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <h4 className="text-sm font-medium text-gray-900">{item.action}</h4>
//                           <span className="text-xs text-gray-500">{item.timestamp}</span>
//                         </div>
//                         <p className="text-sm text-gray-600 mt-1">{item.description}</p>
//                         <span className="text-xs text-gray-500">처리자: {item.user}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
