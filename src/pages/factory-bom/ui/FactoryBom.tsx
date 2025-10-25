import { useState } from "react";

import { billOfMaterials, rawMaterials } from "@/../mocks";
import { factorySidebarItems } from "@/shared/config/sidebar";
import { Button, Input, Select } from "@/shared/ui";
import { PageLayout } from "@/widgets/Layout";

const FactoryBom = () => {
  const [selectedBOM, setSelectedBOM] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDeleteBOM = (partId: string) => {
    if (confirm("이 BOM을 삭제하시겠습니까?")) {
      alert(`${partId} BOM이 삭제되었습니다.`);
    }
  };

  return (
    <PageLayout
      sidebarItems={factorySidebarItems}
      userRole="Factory Manager"
      pageTitle="BOM 관리"
      pageDescription="부품별 원자재 구성을 관리하세요"
    >
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex space-x-4">
          <Input
            placeholder="부품 검색..."
            // icon="ri-search-line"
          />
        </div>
        <Button variant="default" onClick={() => setShowCreateModal(true)}>
          + 새 BOM 생성
        </Button>
      </div>

      {/* BOM List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {billOfMaterials.map((bom) => (
          <div
            key={bom.partId}
            className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
                  {bom.partName}
                </h3>
                <p className="text-sm text-grey-300 dark:text-grey-400">
                  부품 ID: {bom.partId}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedBOM(bom);
                    setShowEditModal(true);
                  }}
                  className="hover:bg-main-50 rounded-lg p-2 text-main-500 transition-colors dark:hover:bg-main-900/20"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button
                  onClick={() => handleDeleteBOM(bom.partId)}
                  className="rounded-lg p-2 text-error-red transition-colors hover:bg-error-red/10"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-grey-500 dark:text-grey-100">
                필요 원자재:
              </h4>
              {bom.materials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-bg-white p-3 transition-colors duration-200 dark:bg-bg-black"
                >
                  <div>
                    <p className="font-medium text-grey-500 dark:text-grey-100">
                      {material.materialName}
                    </p>
                    <p className="text-sm text-grey-300 dark:text-grey-400">
                      ID: {material.materialId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-grey-500 dark:text-grey-100">
                      {material.requiredQuantity} {material.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create BOM Modal */}
      {showCreateModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                새 BOM 생성
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="부품 ID" placeholder="예: P006" />
                <Input label="부품명" placeholder="부품명을 입력하세요" />
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-grey-500 dark:text-grey-100">
                  원자재 구성
                </h3>
                <div className="space-y-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Select
                        label="원자재"
                        options={rawMaterials.map((material) => ({
                          value: material.id,
                          label: material.name,
                        }))}
                        // placeholder="원자재를 선택하세요"
                      />
                    </div>
                    <div className="w-32">
                      <Input label="수량" type="number" placeholder="수량" />
                    </div>
                    <Button type="button" variant="secondary" size="sm">
                      추가
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  BOM 생성
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit BOM Modal */}
      {showEditModal && selectedBOM && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                BOM 편집 - {selectedBOM.partName}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedBOM(null);
                }}
                className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="부품 ID" value={selectedBOM.partId} disabled />
                <Input label="부품명" defaultValue={selectedBOM.partName} />
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-grey-500 dark:text-grey-100">
                  원자재 구성
                </h3>
                <div className="space-y-3">
                  {selectedBOM.materials.map((material: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rounded-lg bg-bg-white p-3 transition-colors duration-200 dark:bg-bg-black"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-grey-500 dark:text-grey-100">
                          {material.materialName}
                        </p>
                        <p className="text-sm text-grey-300 dark:text-grey-400">
                          ID: {material.materialId}
                        </p>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          defaultValue={material.requiredQuantity}
                        />
                      </div>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-error-red transition-colors hover:bg-error-red/10"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}

                  <div className="flex items-end space-x-3 border-t border-grey-100 pt-3 dark:border-grey-700">
                    <div className="flex-1">
                      <Select
                        label="새 원자재 추가"
                        options={rawMaterials.map((material) => ({
                          value: material.id,
                          label: material.name,
                        }))}
                        // placeholder="원자재를 선택하세요"
                      />
                    </div>
                    <div className="w-32">
                      <Input label="수량" type="number" placeholder="수량" />
                    </div>
                    <Button type="button" variant="secondary" size="sm">
                      추가
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  변경사항 저장
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBOM(null);
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
    </PageLayout>
  );
};

export { FactoryBom };
