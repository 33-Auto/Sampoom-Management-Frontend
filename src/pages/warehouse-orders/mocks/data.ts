import type { OrderResDto } from "@/shared/api/models";

export const mockWarehouseOrders: OrderResDto[] = [
  {
    id: 1,
    requester: "WAREHOUSE",
    branch: "AutoMax Dealership",
    items: [
      { code: "P001", quantity: 2 },
      { code: "P003", quantity: 4 },
    ],
    status: "PENDING",
  },
  {
    id: 2,
    requester: "WAREHOUSE",
    branch: "Premier Motors",
    items: [
      { code: "P002", quantity: 1 },
      { code: "P004", quantity: 2 },
    ],
    status: "CONFIRMED",
  },
  {
    id: 3,
    requester: "WAREHOUSE",
    branch: "City Auto Center",
    items: [{ code: "P005", quantity: 3 }],
    status: "SHIPPING",
  },
];
