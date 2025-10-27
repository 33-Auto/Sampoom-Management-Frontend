
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { Select } from '@/shared/ui';
import { useNotification } from '@/app/providers/NotificationContext';

export default function EditBOM() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showError, showSuccess, showInfo } = useNotification();
  
  const [bomData, setBomData] = useState({
    id: '',
    productName: '',
    version: '',
    status: 'active',
    description: '',
    createdDate: '',
    lastModified: ''
  });

  const [materials, setMaterials] = useState<any[]>([]);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);

  const statusOptions = [
    { value: 'draft', label: '초안' },
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' }
  ];

  const unitOptions = [
    { value: '개', label: '개' },
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'm', label: 'm' },
    { value: 'cm', label: 'cm' },
    { value: 'L', label: 'L' },
    { value: 'ml', label: 'ml' }
  ];

  const availableMaterials = [
    { code: 'MAT-001', name: '알루미늄 합금 봉재' },
    { code: 'MAT-002', name: '고무 시일링' },
    { code: 'MAT-003', name: '전자 센서' },
    { code: 'MAT-004', name: '스테인리스 볼트' },
    { code: 'MAT-005', name: '플라스틱 하우징' },
    { code: 'MAT-006', name: '구리 와이어' },
    { code: 'MAT-007', name: '유압유' },
    { code: 'MAT-008', name: '베어링' }
  ];

  // 기존 BOM 데이터 로드
  useEffect(() => {
    // 실제로는 API에서 데이터를 가져와야 함
    const mockBomData = {
      id: 'BOM-001',
      productName: '엔진 어셈블리 A-Type',
      version: 'v2.1',
      status: 'active',
      description: '고성능 엔진 어셈블리 자재 명세서',
      createdDate: '2024-01-10',
      lastModified: '2024-01-14'
    };

    const mockMaterials = [
      { code: 'MAT-001', name: '알루미늄 합금 봉재', quantity: 2, unit: 'kg' },
      { code: 'MAT-003', name: '전자 센서', quantity: 4, unit: '개' },
      { code: 'MAT-006', name: '구리 와이어', quantity: 15, unit: 'm' }
    ];

    const mockChangeHistory = [
      {
        version: 'v2.1',
        date: '2024-01-14',
        changes: '센서 수량 변경 (4→6개)',
        author: '김공장장'
      },
      {
        version: 'v2.0',
        date: '2024-01-10',
        changes: '와이어 규격 변경',
        author: '이설계자'
      }
    ];

    setBomData(mockBomData);
    setMaterials(mockMaterials);
    setChangeHistory(mockChangeHistory);
  }, [id]);

  const handleBomDataChange = (field: string, value: string) => {
    setBomData(prev => ({ ...prev, [field]: value }));
  };

  const handleMaterialChange = (index: number, field: string, value: string | number) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    
    if (field === 'code') {
      const selectedMaterial = availableMaterials.find(m => m.code === value);
      if (selectedMaterial) {
        updatedMaterials[index].name = selectedMaterial.name;
      }
    }
    
    setMaterials(updatedMaterials);
  };

  const addMaterial = () => {
    setMaterials(prev => [...prev, { 
      code: '', 
      name: '', 
      quantity: 1, 
      unit: '개'
    }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!bomData.productName) {
      showError('오류', '제품명을 입력해주세요.');
      return;
    }

    if (materials.some(m => !m.code || !m.name)) {
      showError('오류', '모든 원자재 정보를 입력해주세요.');
      return;
    }

    showSuccess('성공', 'BOM이 수정되었습니다.');
    navigate('/factory/bom');
  };

  const handleCancel = () => {
    navigate('/factory/bom');
  };

  const handleVersionUp = () => {
    const currentVersion = bomData.version;
    const versionNumber = parseFloat(currentVersion.replace('v', ''));
    const newVersion = `v${(versionNumber + 0.1).toFixed(1)}`;
    setBomData(prev => ({ ...prev, version: newVersion }));
    showInfo('정보', `버전이 ${newVersion}으로 업데이트되었습니다.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'draft': return '초안';
      case 'inactive': return '비활성';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <i className="ri-arrow-left-line"></i>
            </Button>
            <h1 className="text-2xl font-bold" style={{ color: '#17191B' }}>BOM 편집 - {bomData.id}</h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bomData.status)}`}>
              {getStatusText(bomData.status)}
            </span>
          </div>
          <p style={{ color: '#7C7C7C' }}>
            자재 명세서(BOM)를 편집합니다. 변경사항은 새로운 버전으로 관리됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 기본 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6" style={{ borderColor: '#CCCCCC' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: '#17191B' }}>기본 정보</h2>
                <Button variant="secondary" size="sm" onClick={handleVersionUp}>
                  <i className="ri-arrow-up-line mr-1"></i>
                  버전업
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7C7C7C' }}>
                    BOM ID
                  </label>
                  <Input
                    value={bomData.id}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7C7C7C' }}>
                    제품명 *
                  </label>
                  <Input
                    value={bomData.productName}
                    onChange={(e) => handleBomDataChange('productName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7C7C7C' }}>
                    버전
                  </label>
                  <Input
                    value={bomData.version}
                    onChange={(e) => handleBomDataChange('version', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7C7C7C' }}>
                    상태
                  </label>
                  <Select
                    options={statusOptions}
                    value={bomData.status}
                    onChange={(e) => handleBomDataChange('status', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#7C7C7C' }}>
                    설명
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    style={{ borderColor: '#CCCCCC' }}
                    rows={3}
                    value={bomData.description}
                    onChange={(e) => handleBomDataChange('description', e.target.value)}
                  />
                </div>
              </div>

              {/* 메타 정보 */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E9EAEC' }}>
                <h3 className="text-md font-medium mb-3" style={{ color: '#17191B' }}>메타 정보</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span style={{ color: '#7C7C7C' }}>생성일:</span>
                    <p className="font-medium" style={{ color: '#17191B' }}>{bomData.createdDate}</p>
                  </div>
                  <div>
                    <span style={{ color: '#7C7C7C' }}>최종 수정:</span>
                    <p className="font-medium" style={{ color: '#17191B' }}>{bomData.lastModified}</p>
                  </div>
                  <div>
                    <span style={{ color: '#7C7C7C' }}>총 원자재:</span>
                    <p className="font-medium" style={{ color: '#17191B' }}>{materials.length}개</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 변경 이력 */}
            <div className="bg-white rounded-lg border shadow-sm p-6" style={{ borderColor: '#CCCCCC' }}>
              <h3 className="text-md font-medium mb-3" style={{ color: '#17191B' }}>변경 이력</h3>
              <div className="space-y-3">
                {changeHistory.map((change, index) => (
                  <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm" style={{ color: '#17191B' }}>{change.version}</span>
                      <span className="text-xs" style={{ color: '#7C7C7C' }}>{change.date}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#7C7C7C' }}>{change.changes}</p>
                    <p className="text-xs mt-1" style={{ color: '#7C7C7C' }}>작성자: {change.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 원자재 구성 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm p-6" style={{ borderColor: '#CCCCCC' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: '#17191B' }}>원자재 구성</h2>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <i className="ri-download-line mr-2"></i>
                    BOM 내보내기
                  </Button>
                  <Button variant="secondary" size="sm" onClick={addMaterial}>
                    <i className="ri-add-line mr-2"></i>
                    원자재 추가
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: '#F5F5F5', borderColor: '#CCCCCC' }}>
                    
                    {/* 원자재 헤더 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#8080FF' }}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#7C7C7C' }}>
                          원자재 #{index + 1}
                        </span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => removeMaterial(index)}
                      >
                        <i className="ri-delete-bin-line" style={{ color: '#FF6C6C' }}></i>
                      </Button>
                    </div>

                    {/* 원자재 정보 입력 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#7C7C7C' }}>
                          원자재 코드
                        </label>
                        <Select
                          options={[
                            { value: '', label: '선택하세요' },
                            ...availableMaterials.map(m => ({ value: m.code, label: m.code }))
                          ]}
                          value={material.code}
                          onChange={(e) => handleMaterialChange(index, 'code', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#7C7C7C' }}>
                          원자재명
                        </label>
                        <Input
                          value={material.name}
                          onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                          disabled={!!material.code}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#7C7C7C' }}>
                          수량
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={material.quantity}
                          onChange={(e) => handleMaterialChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: '#7C7C7C' }}>
                          단위
                        </label>
                        <Select
                          options={unitOptions}
                          value={material.unit}
                          onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t" style={{ borderColor: '#E9EAEC' }}>
                <Button variant="secondary" onClick={handleCancel}>
                  취소
                </Button>
                <Button variant="default" onClick={handleSave}>
                  <i className="ri-save-line mr-2"></i>
                  변경사항 저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
