
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

export const partInventory = [
  {
    id: 'P001',
    name: 'Engine Block',
    category: 'Engine',
    group: 'Powertrain',
    currentStock: 12,
    minStock: 5
  },
  {
    id: 'P002',
    name: 'Transmission',
    category: 'Transmission',
    group: 'Powertrain',
    currentStock: 8,
    minStock: 3
  },
  {
    id: 'P003',
    name: 'Brake System',
    category: 'Brakes',
    group: 'Safety',
    currentStock: 15,
    minStock: 8
  },
  {
    id: 'P004',
    name: 'Suspension Kit',
    category: 'Suspension',
    group: 'Chassis',
    currentStock: 6,
    minStock: 4
  },
  {
    id: 'P005',
    name: 'Exhaust System',
    category: 'Exhaust',
    group: 'Engine',
    currentStock: 2,
    minStock: 5
  }
];

export const warehouseEmployees = [
  {
    id: 'EMP-W001',
    name: 'Robert Johnson',
    position: 'Warehouse Supervisor',
    contact: 'robert.johnson@sampoom.com',
    phone: '+1-555-0201'
  },
  {
    id: 'EMP-W002',
    name: 'Maria Garcia',
    position: 'Inventory Specialist',
    contact: 'maria.garcia@sampoom.com',
    phone: '+1-555-0202'
  },
  {
    id: 'EMP-W003',
    name: 'James Wilson',
    position: 'Shipping Coordinator',
    contact: 'james.wilson@sampoom.com',
    phone: '+1-555-0203'
  },
  {
    id: 'EMP-W004',
    name: 'Jennifer Lee',
    position: 'Quality Inspector',
    contact: 'jennifer.lee@sampoom.com',
    phone: '+1-555-0204'
  }
];
