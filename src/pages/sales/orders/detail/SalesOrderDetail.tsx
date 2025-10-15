import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";import { Button, Card } from "@/shared/ui";import { useCancelOrderMutation, useSalesOrderDetailQuery } from "../api/sales-orders.api";export const SalesOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const params = useParams<{ id: string }>();
  const idNum = Number(params.id);
  const { data: fetched, refetch } = useSalesOrderDetailQuery(
    Number.isNaN(idNum) ? undefined : idNum,
  );
  const order = fetched ?? state?.order;
  const cancelMutation = useCancelOrderMutation();

  const createdDate = useMemo(
    () => (order?.createdAt ? String(order.createdAt).slice(0, 10) : "-"),
    [order],
  );

  const statusLabelMap: Record<string, string> = {
    PENDING: "대기 중",
    CONFIRMED: "주문 확인",
    SHIPPING: "배송 중",
    DELAYED: "배송 지연",
    PRODUCING: "생산 중",
    COMPLETED: "배송 완료",
    CANCELED: "주문 취소",
  };

  const formatCurrency = (amount: number) =>
    `₩${Number(amount || 0).toLocaleString()}`;

  const { totalLines, totalQty, totalAmount } = useMemo(() => {
    let lines = 0;
    let qty = 0;
    let amount = 0;
    for (const cat of order?.items || []) {
      for (const grp of cat.groups || []) {
        for (const p of grp.parts || []) {
          lines += 1;
          qty += p.quantity ?? 0;
          const unitPrice = p.standardCost ?? 0;
          amount += (p.quantity ?? 0) * unitPrice;
        }
      }
    }
    return { totalLines: lines, totalQty: qty, totalAmount: amount };
  }, [order]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="cursor-pointer"
            onClick={async () => navigate(-1)}
          >
            <i className="ri-arrow-left-line" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            판매 주문 상세
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              disabled={cancelMutation.isPending || order?.status !== "PENDING"}
              onClick={async () => {
                if (!order?.orderId) return;
                await cancelMutation.mutateAsync(order.orderId);
                await refetch();
              }}
            >
              주문취소
            </Button>
          </div>
        </div>

        <Card className="dark:border-gray-700 dark:bg-bg-card-black">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                주문번호
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {order?.orderNumber || params.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">고객사</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {order?.agencyName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">상태</p>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  order?.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : order?.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-800"
                      : order?.status === "SHIPPING"
                        ? "bg-indigo-100 text-indigo-800"
                        : order?.status === "DELAYED"
                          ? "bg-orange-100 text-orange-800"
                          : order?.status === "PRODUCING"
                            ? "bg-purple-100 text-purple-800"
                            : order?.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.status
                  ? statusLabelMap[order.status] || order.status
                  : "-"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">주문일</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {createdDate}
              </p>
            </div>
          </div>
        </Card>

        {/* Receipt-like list */}
        <div className="mt-8">
          <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            품목 내역
          </div>
          <div>
            {(order?.items || []).map((cat: any) => (
              <div key={cat.categoryId} className="py-3">
                {cat.groups?.map((grp: any) => (
                  <div key={grp.groupId} className="pt-3">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <div className="font-semibold text-gray-700 dark:text-gray-200">
                        {cat.categoryName} {" > "} {grp.groupName}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        총 {(grp.parts || []).length}개 부품
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(grp.parts || []).map((p: any) => {
                        const unitPrice = p.standardCost ?? 0;
                        const quantity = p.quantity ?? 0;
                        const lineAmount = unitPrice * quantity;
                        return (
                          <Card
                            key={p.partId}
                            className="p-4 transition-colors duration-200 dark:border-gray-700"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {p.code}
                                </div>
                              </div>
                              <div className="min-w-[80px] text-right text-gray-700 dark:text-gray-200">
                                <div>{formatCurrency(unitPrice)}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  × {quantity}
                                </div>
                                <div className="mt-1 font-semibold text-main-600 dark:text-main-400">
                                  {formatCurrency(lineAmount)}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t-2 border-gray-300 pt-4 dark:border-gray-600">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                총 라인 수
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {totalLines}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">총 수량</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {totalQty}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">총 금액</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetail;
