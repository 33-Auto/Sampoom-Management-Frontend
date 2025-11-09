import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { fetchClient } from "@/shared/api";
import { Button, Card, Input, Table } from "@/shared/ui";

type LocationState = {
  warehouseId?: number;
  initialItems?: { id: number; delta: number }[];
  part?: any;
};

export default function StockingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation() as { state: LocationState };
  const warehouseId = state?.warehouseId ?? 0;
  const initialItems =
    state?.initialItems ?? (id ? [{ id: Number(id), delta: 0 }] : []);

  const [items, setItems] =
    useState<{ id: number; delta: number }[]>(initialItems);

  const canSubmit = useMemo(() => {
    if (!warehouseId) return false;
    if (items.length === 0) return false;
    return items.every(
      (it) => typeof it.id === "number" && Number.isFinite(it.delta),
    );
  }, [warehouseId, items]);

  const columns = [
    { key: "id", title: "품목 ID", width: "120px" },
    {
      key: "delta",
      title: "입고 수량(Δ)",
      width: "160px",
      render: (_value: number, row: { id: number; delta: number }) => (
        <Input
          type="number"
          value={row.delta}
          onChange={(e) =>
            setItems((prev) =>
              prev.map((it) =>
                it.id === row.id
                  ? { ...it, delta: Number(e.target.value) }
                  : it,
              ),
            )
          }
        />
      ),
    },
  ];

  const handleAddRow = () => {
    setItems((prev) => [...prev, { id: 0, delta: 0 }]);
  };

  const handleSubmit = async () => {
    if (!warehouseId) return;
    await fetchClient.PATCH("/api/warehouse/stocking", {
      body: { warehouseId, items },
    });
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">입고 처리 (Stocking)</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={async () => navigate(-1)}>
              뒤로
            </Button>
            <Button
              variant="default"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              처리
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <div className="mb-3 text-sm text-gray-600">
          창고 ID: <span className="font-mono">{warehouseId ?? "-"}</span>
        </div>
        <div className="mb-4">
          <Button size="sm" variant="secondary" onClick={handleAddRow}>
            행 추가
          </Button>
        </div>
        <Table columns={columns} data={items} />
      </Card>
    </div>
  );
}
