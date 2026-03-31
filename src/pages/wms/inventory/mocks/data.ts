import type { PartResDto } from "@/shared/model";

export type WarehouseInventoryItem = PartResDto & {
  warehouseId: number;
  categoryId: number;
  groupId: number;
};

export const mockWarehouseInventory: WarehouseInventoryItem[] = Array.from({
  length: 500,
}).map((_, i) => ({
  id: 9001 + i,
  warehouseId: 200 + (i % 3) + 1,
  code: `PART-${(i + 1).toString().padStart(4, "0")}`,
  name: `테스트 부품 ${(i + 1).toString().padStart(4, "0")}`,
  categoryId: (i % 5) + 1,
  category: [
    "엔진 부품",
    "섀시 부품",
    "전자 부품",
    "냉각 시스템",
    "배기 시스템",
  ][i % 5],
  groupId: (i % 10) + 11,
  group: ["연료 공급", "제동 장치", "센서 모듈", "제어 모듈", "현가 장치"][
    i % 5
  ],
  quantity: Math.floor(Math.random() * 200),
  rop: 50,
  unit: "EA",
  partValue: Math.floor(Math.random() * 10000000),
  status: ["ENOUGH", "SHORT", "DANGER", "OVER"][i % 4] as any,
}));
