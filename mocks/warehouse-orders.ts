export const warehouseOrders = [
  {
    id: 'WO-001',
    dealershipName: 'AutoMax Dealership',
    orderDate: '2024-01-16',
    status: 'Pending',
    parts: [
      { partId: 'P001', partName: 'Engine Block', quantity: 2 },
      { partId: 'P003', partName: 'Brake System', quantity: 4 }
    ]
  },
  {
    id: 'WO-002',
    dealershipName: 'Premier Motors',
    orderDate: '2024-01-15',
    status: 'Approved',
    parts: [
      { partId: 'P002', partName: 'Transmission', quantity: 1 },
      { partId: 'P004', partName: 'Suspension Kit', quantity: 2 }
    ]
  },
  {
    id: 'WO-003',
    dealershipName: 'City Auto Center',
    orderDate: '2024-01-14',
    status: 'Shipped',
    parts: [
      { partId: 'P005', partName: 'Exhaust System', quantity: 3 }
    ]
  }
];