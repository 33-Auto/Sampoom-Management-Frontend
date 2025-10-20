import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import Home from '@/pages/Index/index';
import Login from '@/pages/login/ui/Login';
import Register from '@/pages/register/ui/Register';
import WarehouseDashboard from '@/pages/warehouse-dashboard/page';
import WarehouseOrders from '@/pages/warehouse-orders/page';
import PartInventory from '@/pages/warehouse-inventory/page';
import WarehouseEmployees from '@/pages/warehouse-employees/page';
import FactoryDashboard from '@/pages/factory-dashboard/FactoryDashboard';
import FactoryOrders from '@/pages/factory-orders/FactoryOrdersPage';
import MaterialInventory from '@/pages/factory-materials/FactoryMaterialsPage';
import BOMManagement from '@/pages/factory-bom/FactoryBomPage';
import FactoryEmployees from '@/pages/factory-employees/FactoryEmployeesPage';
import { Notfound } from '@/pages/Notfound/Notfound';
// import ComponentsPage from '@/pages/components/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Register />
  },
  // Warehouse Manager Routes
  {
    path: '/warehouse',
    element: <Navigate to="/warehouse/dashboard" replace />
  },
  {
    path: '/warehouse/dashboard',
    element: <WarehouseDashboard />
  },
  {
    path: '/warehouse/orders',
    element: <WarehouseOrders />
  },
  {
    path: '/warehouse/inventory',
    element: <PartInventory />
  },
  {
    path: '/warehouse/employees',
    element: <WarehouseEmployees />
  },
  // Factory Manager Routes
  {
    path: '/factory',
    element: <Navigate to="/factory/dashboard" replace />
  },
  {
    path: '/factory/dashboard',
    element: <FactoryDashboard />
  },
  {
    path: '/factory/orders',
    element: <FactoryOrders />
  },
  {
    path: '/factory/materials',
    element: <MaterialInventory />
  },
  {
    path: '/factory/bom',
    element: <BOMManagement />
  },
  {
    path: '/factory/employees',
    element: <FactoryEmployees />
  },
  // {
  //   path: '/components',
  //   element: <ComponentsPage />,
  // },
  {
    path: '*',
    element: <Notfound />
  }
];

const router = createBrowserRouter(routes);

export default router;