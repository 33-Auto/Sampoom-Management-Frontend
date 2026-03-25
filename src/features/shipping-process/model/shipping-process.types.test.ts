import { describe, expect, it } from "vitest";

import type { ShippingOrderItemDto } from "@/entities/shipping";

import { toShippingProcessItems } from "./shipping-process.types";

describe("toShippingProcessItems", () => {
  it("정상적인 품목만 필터링하고 기본 출고 수량을 계산한다", () => {
    const items: ShippingOrderItemDto[] = [
      {
        partId: 1,
        name: "테스트 부품",
        code: "PART-001",
        orderQuantity: 10,
        stock: 6,
      },
      {
        partId: undefined,
        name: "누락된 부품",
        code: "PART-002",
        orderQuantity: 5,
        stock: 5,
      },
      {
        partId: 2,
        name: "재고 부족 부품",
        code: "PART-003",
        orderQuantity: 8,
        stock: 2,
      },
    ];

    const result = toShippingProcessItems(items);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      partId: 1,
      partName: "테스트 부품",
      partCode: "PART-001",
      orderQuantity: 10,
      availableStock: 6,
      delta: 6,
    });
    expect(result[1]).toMatchObject({
      partId: 2,
      delta: 2,
    });
  });

  it("입력이 없으면 빈 배열을 반환한다", () => {
    expect(toShippingProcessItems(undefined)).toEqual([]);
  });
});
