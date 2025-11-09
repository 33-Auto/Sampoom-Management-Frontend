import type { ProductionPlanResponseDTO } from "@/pages/production/planning/model";
import {
  PRODUCTION_PLAN_PRIORITY_LABELS,
  PRODUCTION_PLAN_STATUS_LABELS,
} from "@/pages/production/planning/model";
import { Button, Modal } from "@/shared/ui";

type ProductionPlanDetailModalProps = {
  open: boolean;
  plan: ProductionPlanResponseDTO | null;
  onClose: () => void;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR");
};

export const ProductionPlanDetailModal = ({
  open,
  plan,
  onClose,
}: ProductionPlanDetailModalProps) => (
  <Modal
    open={open && plan !== null}
    onClose={onClose}
    title="생산 계획 상세"
    widthClassName="max-w-2xl"
  >
    {plan && (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                계획 코드
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {plan.orderCode ?? plan.orderId ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                상태
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {plan.status
                  ? (PRODUCTION_PLAN_STATUS_LABELS[plan.status] ?? plan.status)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                우선순위
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {plan.priority
                  ? (PRODUCTION_PLAN_PRIORITY_LABELS[plan.priority] ??
                    plan.priority)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                요청일 / 계획일
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {formatDate(plan.requiredDate)} /{" "}
                {formatDate(plan.scheduledDate)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            부품 목록
          </h4>
          {plan.items && plan.items.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                      부품명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                      부품코드
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                      수량
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {plan.items.map((item, index) => (
                    <tr key={item?.partId ?? index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item?.partName ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {item?.partCode ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                        {item?.quantity ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
              등록된 부품 정보가 없습니다.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    )}
  </Modal>
);
