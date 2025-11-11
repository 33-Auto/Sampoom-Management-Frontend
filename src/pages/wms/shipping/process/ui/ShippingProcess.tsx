import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ShippingProcessForm } from "@/features/shipping-process";
import type { ShippingOrderDto } from "@/pages/wms/shipping/model";
import { Button } from "@/shared/ui";

type ShippingProcessLocationState = {
  order: ShippingOrderDto;
};

export function ShippingProcess() {
  const navigate = useNavigate();
  const { warehouseId: warehouseIdParam, orderId: orderIdParam } = useParams<{
    warehouseId: string;
    orderId: string;
  }>();
  const { state } = useLocation();

  if (!warehouseIdParam || !orderIdParam) {
    throw new Error("warehouseId와 orderId가 필요합니다.");
  }

  const warehouseId = Number(warehouseIdParam);
  const orderId = Number(orderIdParam);

  if (!Number.isFinite(warehouseId) || !Number.isFinite(orderId)) {
    throw new Error("warehouseId 또는 orderId가 올바르지 않습니다.");
  }

  const locationState = state as ShippingProcessLocationState | null;
  const order = locationState?.order;

  if (!order) {
    throw new Error("출고 주문 정보가 필요합니다.");
  }

  if (!order.items || order.items.length === 0) {
    throw new Error("출고 품목 정보가 필요합니다.");
  }

  const handleSuccess = () => {
    navigate("/wms/shipping", {
      state: { refresh: true },
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={async () => navigate(-1)}>
              <i className="ri-arrow-left-line mr-2"></i>
              출고 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              출고 처리
            </h1>
          </div>
          <p className="text-gray-600">
            출고 예정 주문에 포함된 품목의 수량을 검토하고 출고 처리를
            진행하세요.
          </p>
        </div>
        <ShippingProcessForm
          warehouseId={warehouseId}
          orderId={orderId}
          order={order}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
