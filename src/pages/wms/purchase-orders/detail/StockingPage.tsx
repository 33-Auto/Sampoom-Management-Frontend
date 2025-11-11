import {
  useLocation,
  useNavigate,
  useParams,
  useLoaderData,
} from "react-router-dom";

import { useBranchId } from "@/features/branch-select/model/branch-selection.store";
import { StockingProcessForm } from "@/features/stocking-process";
import type { StockingProcessLoaderResult } from "@/features/stocking-process/api/stocking-process.loader";
import { Button } from "@/shared/ui";

type LocationState = {
  warehouseId?: number;
};

export default function StockingPage() {
  const navigate = useNavigate();
  const { purchaseOrderId } = useParams();
  const { state } = useLocation() as { state: LocationState };
  const loaderData = useLoaderData() as StockingProcessLoaderResult;
  const selectedWarehouseId = useBranchId("wms");

  if (!purchaseOrderId) {
    throw new Error("purchaseOrderId가 필요합니다.");
  }

  const warehouseId =
    (selectedWarehouseId ? Number(selectedWarehouseId) : undefined) ??
    state?.warehouseId;
  if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
    throw new Error("warehouseId가 선택되지 않았습니다.");
  }
  const detail = loaderData?.data;

  if (!detail) {
    throw new Error("발주 상세 정보를 불러올 수 없습니다.");
  }

  const handleSuccess = () => {
    navigate("/wms/orders");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => navigate(-1)}
            >
              <i className="ri-arrow-left-line mr-2" />
              발주 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              입고 처리
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            발주 상세 정보를 확인하고 입고 수량을 등록할 수 있습니다.
          </p>
        </div>

        <StockingProcessForm
          warehouseId={warehouseId}
          purchaseOrderId={Number(purchaseOrderId)}
          detail={detail}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
