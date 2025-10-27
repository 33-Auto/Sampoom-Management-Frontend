import { useState } from "react";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

export default function FactoryBOM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBOMs, setSelectedBOMs] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<any>(null);
  const { showError, showSuccess } = useNotification();

  const bomData = [
    {
      id: "BOM-001",
      productName: "엔진 어셈블리 A-Type",
      version: "v2.1",
      status: "active",
      createdDate: "2024-01-10",
      lastModified: "2024-01-14",
      materials: [
        {
          code: "MAT-001",
          name: "알루미늄 합금 봉재",
          quantity: 2,
          unit: "kg",
        },
        { code: "MAT-003", name: "전자 센서", quantity: 4, unit: "개" },
        { code: "MAT-006", name: "구리 와이어", quantity: 15, unit: "m" },
      ],
    },
    {
      id: "BOM-002",
      productName: "브레이크 시스템 B-Type",
      version: "v1.5",
      status: "active",
      createdDate: "2024-01-08",
      lastModified: "2024-01-12",
      materials: [
        { code: "MAT-002", name: "고무 시일링", quantity: 8, unit: "개" },
        { code: "MAT-004", name: "스테인리스 볼트", quantity: 12, unit: "개" },
        { code: "MAT-008", name: "베어링", quantity: 2, unit: "개" },
      ],
    },
    {
      id: "BOM-003",
      productName: "전자 제어 모듈",
      version: "v3.0",
      status: "draft",
      createdDate: "2024-01-12",
      lastModified: "2024-01-15",
      materials: [
        { code: "MAT-003", name: "전자 센서", quantity: 6, unit: "개" },
        { code: "MAT-005", name: "플라스틱 하우징", quantity: 1, unit: "개" },
        { code: "MAT-006", name: "구리 와이어", quantity: 25, unit: "m" },
      ],
    },
    {
      id: "BOM-004",
      productName: "필터 어셈블리",
      version: "v1.2",
      status: "inactive",
      createdDate: "2024-01-05",
      lastModified: "2024-01-09",
      materials: [
        { code: "MAT-005", name: "플라스틱 하우징", quantity: 2, unit: "개" },
        { code: "MAT-002", name: "고무 시일링", quantity: 4, unit: "개" },
      ],
    },
    {
      id: "BOM-005",
      productName: "금속 부품 세트",
      version: "v2.3",
      status: "active",
      createdDate: "2024-01-11",
      lastModified: "2024-01-13",
      materials: [
        {
          code: "MAT-001",
          name: "알루미늄 합금 봉재",
          quantity: 5,
          unit: "kg",
        },
        { code: "MAT-004", name: "스테인리스 볼트", quantity: 20, unit: "개" },
        { code: "MAT-008", name: "베어링", quantity: 3, unit: "개" },
      ],
    },
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "active", label: "활성" },
    { value: "draft", label: "초안" },
    { value: "inactive", label: "비활성" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-500 border-gray-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활성";
      case "draft":
        return "초안";
      case "inactive":
        return "비활성";
      default:
        return "알 수 없음";
    }
  };

  const handleSelectBOM = (bomId: string) => {
    setSelectedBOMs((prev) =>
      prev.includes(bomId)
        ? prev.filter((id) => id !== bomId)
        : [...prev, bomId],
    );
  };

  const handleSelectAll = () => {
    if (selectedBOMs.length === filteredBOMs.length) {
      setSelectedBOMs([]);
    } else {
      setSelectedBOMs(filteredBOMs.map((bom) => bom.id));
    }
  };

  const handleViewDetail = (bom: any) => {
    setSelectedBOM(bom);
    setShowDetailModal(true);
  };

  const handleEditBOM = (bom: any) => {
    console.log("Edit BOM:", bom.id);
  };

  // const handleCreateBOM = () => {
  //   console.log('Create BOM');
  // };

  const handleDeleteSelected = () => {
    if (selectedBOMs.length === 0) {
      showError("오류", "삭제할 BOM을 선택해주세요.");
      return;
    }
    showSuccess("성공", `${selectedBOMs.length}개의 BOM이 삭제되었습니다.`);
    setSelectedBOMs([]);
  };

  // const handleExportBOM = () => {
  //   console.log('Export BOM');
  // };

  const filteredBOMs = bomData.filter((bom) => {
    const matchesSearch =
      bom.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bom.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 정확한 통계 계산
  const totalBOMs = bomData.length;
  const activeBOMs = bomData.filter((b) => b.status === "active").length;
  const draftBOMs = bomData.filter((b) => b.status === "draft").length;

  // 고유 원자재 종류 계산 (중복 제거)
  const allMaterials = bomData.flatMap((b) => b.materials.map((m) => m.code));
  const uniqueMaterialTypes = new Set(allMaterials).size;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F5F5F5" }}>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-lg border bg-white p-4 shadow-sm"
          style={{ borderColor: "#CCCCCC" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                총 BOM 수
              </p>
              <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                {totalBOMs}
              </p>
              <p className="mt-1 text-xs" style={{ color: "#8080FF" }}>
                관리 중인 BOM
              </p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#E6E6FF" }}
            >
              <i
                className="ri-settings-3-line"
                style={{ color: "#8080FF" }}
              ></i>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border bg-white p-4 shadow-sm"
          style={{ borderColor: "#CCCCCC" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                활성 BOM
              </p>
              <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                {activeBOMs}
              </p>
              <p className="mt-1 text-xs text-green-600">생산 가능</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <i className="ri-checkbox-circle-line text-green-600"></i>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border bg-white p-4 shadow-sm"
          style={{ borderColor: "#CCCCCC" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                초안 BOM
              </p>
              <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                {draftBOMs}
              </p>
              <p className="mt-1 text-xs text-yellow-600">검토 필요</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <i className="ri-draft-line text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border bg-white p-4 shadow-sm"
          style={{ borderColor: "#CCCCCC" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                고유 원자재 종류
              </p>
              <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                {uniqueMaterialTypes}
              </p>
              <p className="mt-1 text-xs text-orange-600">전체 원자재</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <i className="ri-archive-line text-orange-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="mb-6 rounded-lg border bg-white p-4 shadow-sm"
        style={{ borderColor: "#CCCCCC" }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="BOM ID, 제품명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Button
            variant="secondary"
            size="default"
            onClick={handleDeleteSelected}
            disabled={selectedBOMs.length === 0}
          >
            <i className="ri-delete-bin-line mr-2"></i>
            선택 삭제
          </Button>
        </div>
      </div>

      {/* BOM List */}
      <div
        className="rounded-lg border bg-white shadow-sm"
        style={{ borderColor: "#CCCCCC" }}
      >
        <div className="border-b p-4" style={{ borderColor: "#CCCCCC" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "#17191B" }}>
              BOM 목록
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  selectedBOMs.length === filteredBOMs.length &&
                  filteredBOMs.length > 0
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 focus:ring-2"
                style={{ accentColor: "#8080FF" }}
              />
              <span className="text-sm" style={{ color: "#7C7C7C" }}>
                전체 선택
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {filteredBOMs.map((bom) => (
              <div
                key={bom.id}
                className="rounded-lg border p-4"
                style={{ backgroundColor: "#F5F5F5", borderColor: "#CCCCCC" }}
              >
                <div className="mb-3 items-start justify-between">
                  <div className="items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedBOMs.includes(bom.id)}
                      onChange={() => handleSelectBOM(bom.id)}
                      className="mt-1 rounded border-gray-300 focus:ring-2"
                      style={{ accentColor: "#8080FF" }}
                    />
                    <div className="-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <span
                          className="font-semibold"
                          style={{ color: "#17191B" }}
                        >
                          {bom.id}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(bom.status)}`}
                        >
                          {getStatusText(bom.status)}
                        </span>
                        <span
                          className="rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "#CCCCCC",
                            color: "#17191B",
                          }}
                        >
                          {bom.version}
                        </span>
                      </div>
                      <h3
                        className="mb-2 font-medium"
                        style={{ color: "#17191B" }}
                      >
                        {bom.productName}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div>
                          <p style={{ color: "#7C7C7C" }}>원자재 수</p>
                          <p
                            className="font-medium"
                            style={{ color: "#17191B" }}
                          >
                            {bom.materials.length}개
                          </p>
                        </div>
                        <div>
                          <p style={{ color: "#7C7C7C" }}>생성일</p>
                          <p
                            className="font-medium"
                            style={{ color: "#17191B" }}
                          >
                            {bom.createdDate}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: "#7C7C7C" }}>최종 수정</p>
                          <p
                            className="font-medium"
                            style={{ color: "#17191B" }}
                          >
                            {bom.lastModified}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: "#7C7C7C" }}>버전</p>
                          <p
                            className="font-medium"
                            style={{ color: "#17191B" }}
                          >
                            {bom.version}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetail(bom)}
                    >
                      <i className="ri-eye-line"></i>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditBOM(bom)}
                    >
                      <i className="ri-edit-line"></i>
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-2 text-sm" style={{ color: "#7C7C7C" }}>
                    구성 원자재:
                  </p>
                  <div className="flex-wrap gap-2">
                    {bom.materials.slice(0, 3).map((material, index) => (
                      <span
                        key={index}
                        className="rounded px-2 py-1 text-xs"
                        style={{ backgroundColor: "#E6E6FF", color: "#4C4CBB" }}
                      >
                        {material.name} ({material.quantity}
                        {material.unit})
                      </span>
                    ))}
                    {bom.materials.length > 3 && (
                      <span
                        className="rounded px-2 py-1 text-xs"
                        style={{ backgroundColor: "#CCCCCC", color: "#17191B" }}
                      >
                        +{bom.materials.length - 3}개 더
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal - Multi-Level BOM 상세 편집기 */}
      {showDetailModal && selectedBOM && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold" style={{ color: "#17191B" }}>
                  Multi-Level BOM 상세 - {selectedBOM.id}
                </h3>
                <p className="text-sm" style={{ color: "#7C7C7C" }}>
                  완전한 자재 명세서 및 구조 정보
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDetailModal(false)}
              >
                <i className="ri-close-line"></i>
              </Button>
            </div>

            {/* BOM 헤더 정보 */}
            <div
              className="mb-6 grid grid-cols-2 gap-4 rounded-lg p-4 md:grid-cols-4"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "#7C7C7C" }}
                >
                  제품명
                </label>
                <p className="font-medium" style={{ color: "#17191B" }}>
                  {selectedBOM.productName}
                </p>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "#7C7C7C" }}
                >
                  버전
                </label>
                <p className="font-medium" style={{ color: "#17191B" }}>
                  {selectedBOM.version}
                </p>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "#7C7C7C" }}
                >
                  상태
                </label>
                <span
                  className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(selectedBOM.status)}`}
                >
                  {getStatusText(selectedBOM.status)}
                </span>
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "#7C7C7C" }}
                >
                  최종 수정일
                </label>
                <p className="font-medium" style={{ color: "#17191B" }}>
                  {selectedBOM.lastModified}
                </p>
              </div>
            </div>

            {/* Multi-Level BOM 구조 */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h4
                  className="text-lg font-semibold"
                  style={{ color: "#17191B" }}
                >
                  BOM 구조 (Multi-Level)
                </h4>
                <div className="space-x-2">
                  <Button variant="secondary" size="sm">
                    <i className="ri-download-line mr-2"></i>
                    BOM 내보내기
                  </Button>
                  <Button variant="default" size="sm">
                    <i className="ri-edit-line mr-2"></i>
                    구조 편집
                  </Button>
                </div>
              </div>

              {/* Level 0 - 완제품 */}
              <div
                className="mb-4 rounded-lg border p-4"
                style={{ borderColor: "#8080FF", backgroundColor: "#E6E6FF" }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#8080FF" }}
                  >
                    <span className="text-sm font-bold text-white">0</span>
                  </div>
                  <div>
                    <h5 className="font-semibold" style={{ color: "#17191B" }}>
                      {selectedBOM.productName}
                    </h5>
                    <p className="text-sm" style={{ color: "#7C7C7C" }}>
                      완제품 (Level 0)
                    </p>
                  </div>
                </div>
              </div>

              {/* Level 1 - 직접 구성 원자재 */}
              <div className="ml-8">
                <h5 className="mb-3 font-medium" style={{ color: "#17191B" }}>
                  Level 1 - 직접 구성 원자재
                </h5>
                <div className="space-y-3">
                  {selectedBOM.materials.map((material: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4"
                      style={{ borderColor: "#CCCCCC" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-full"
                            style={{ backgroundColor: "#B3B3FF" }}
                          >
                            <span className="text-xs font-bold text-white">
                              1
                            </span>
                          </div>
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: "#17191B" }}
                            >
                              {material.name}
                            </p>
                            <p className="text-sm" style={{ color: "#7C7C7C" }}>
                              코드: {material.code}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: "#17191B" }}>
                            {material.quantity} {material.unit}
                          </p>
                          <p className="text-sm" style={{ color: "#7C7C7C" }}>
                            필요 수량
                          </p>
                        </div>
                      </div>

                      {/* 가상의 하위 구성품 (Level 2) */}
                      {material.code === "MAT-001" && (
                        <div
                          className="mt-3 ml-8 border-t pt-3"
                          style={{ borderColor: "#E9EAEC" }}
                        >
                          <p
                            className="mb-2 text-sm font-medium"
                            style={{ color: "#7C7C7C" }}
                          >
                            Level 2 - 하위 구성품
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="h-4 w-4 rounded-full"
                                  style={{ backgroundColor: "#CCCCFF" }}
                                ></div>
                                <span style={{ color: "#17191B" }}>
                                  알루미늄 원재료
                                </span>
                              </div>
                              <span style={{ color: "#7C7C7C" }}>1.8 kg</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="h-4 w-4 rounded-full"
                                  style={{ backgroundColor: "#CCCCFF" }}
                                ></div>
                                <span style={{ color: "#17191B" }}>
                                  합금 첨가제
                                </span>
                              </div>
                              <span style={{ color: "#7C7C7C" }}>0.2 kg</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOM 분석 정보 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "#CCCCCC" }}
              >
                <h5 className="mb-2 font-medium" style={{ color: "#17191B" }}>
                  원가 분석
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="justify-between">
                    <span style={{ color: "#7C7C7C" }}>총 원자재 비용:</span>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      ₩125,000
                    </span>
                  </div>
                  <div className="justify-between">
                    <span style={{ color: "#7C7C7C" }}>가공 비용:</span>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      ₩45,000
                    </span>
                  </div>
                  <div
                    className="justify-between border-t pt-2"
                    style={{ borderColor: "#E9EAEC" }}
                  >
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      총 제조 원가:
                    </span>
                    <span className="font-bold" style={{ color: "#8080FF" }}>
                      ₩170,000
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "#CCCCCC" }}
              >
                <h5 className="mb-2 font-medium" style={{ color: "#17191B" }}>
                  재고 가용성
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="justify-between">
                    <span style={{ color: "#7C7C7C" }}>가용 재고:</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                  <div className="justify-between">
                    <span style={{ color: "#7C7C7C" }}>부족 원자재:</span>
                    <span className="font-medium text-red-600">1개</span>
                  </div>
                  <div className="justify-between">
                    <span style={{ color: "#7C7C7C" }}>예상 조달 시간:</span>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      3일
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "#CCCCCC" }}
              >
                <h5 className="mb-2 font-medium" style={{ color: "#17191B" }}>
                  변경 이력
                </h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium" style={{ color: "#17191B" }}>
                      v2.1 → v2.0
                    </p>
                    <p style={{ color: "#7C7C7C" }}>센서 수량 변경 (4→6개)</p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      2024-01-14
                    </p>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "#17191B" }}>
                      v2.0 → v1.5
                    </p>
                    <p style={{ color: "#7C7C7C" }}>와이어 규격 변경</p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      2024-01-10
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
