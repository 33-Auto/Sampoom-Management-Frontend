export const factoryOrders = [
  {
    id: "ORD-001",
    warehouseName: "Central Warehouse",
    orderDate: "2024-01-15",
    status: "Pending",
    parts: [
      { partId: "P001", partName: "Engine Block", quantity: 5 },
      { partId: "P002", partName: "Transmission", quantity: 3 },
    ],
  },
  {
    id: "ORD-002",
    warehouseName: "North Warehouse",
    orderDate: "2024-01-14",
    status: "In Production",
    parts: [
      { partId: "P003", partName: "Brake System", quantity: 8 },
      { partId: "P004", partName: "Suspension Kit", quantity: 4 },
    ],
  },
  {
    id: "ORD-003",
    warehouseName: "South Warehouse",
    orderDate: "2024-01-13",
    status: "Shipped",
    parts: [{ partId: "P005", partName: "Exhaust System", quantity: 6 }],
  },
];
