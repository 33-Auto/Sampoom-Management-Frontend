import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { FactoryBom } from "@/pages/factory-bom";
import { FactoryDashboard } from "@/pages/factory-dashboard";
import { FactoryEmployees } from "@/pages/factory-employees";
import { FactoryMaterials } from "@/pages/factory-materials";
import { FactoryOrders } from "@/pages/factory-orders";
import { Login } from "@/pages/login";
import { Notfound } from "@/pages/Notfound/Notfound";
import { Register } from "@/pages/register";
import { WarehouseDashboard } from "@/pages/warehouse-dashboard";
import { WarehouseEmployees } from "@/pages/warehouse-employees";
import { WarehouseInventory } from "@/pages/warehouse-inventory";
// import ComponentsPage from '@/pages/components/page';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },

  {
    path: "/warehouse",
    element: <Navigate to="/warehouse/dashboard" replace />,
  },
  {
    path: "/warehouse/dashboard",
    element: <WarehouseDashboard />,
  },
  {
    path: "/warehouse/orders",
    lazy: async () => {
      const { default: Component } = await import("@/pages/warehouse-orders");
      const { loader } = await import("@/pages/warehouse-orders/api/loader");
      return { Component, loader };
    },
  },
  {
    path: "/warehouse/inventory",
    element: <WarehouseInventory />,
  },
  {
    path: "/warehouse/employees",
    element: <WarehouseEmployees />,
  },
  // Factory Manager Routes
  {
    path: "/factory",
    element: <Navigate to="/factory/dashboard" replace />,
  },
  {
    path: "/factory/dashboard",
    element: <FactoryDashboard />,
  },
  {
    path: "/factory/orders",
    element: <FactoryOrders />,
  },
  {
    path: "/factory/materials",
    element: <FactoryMaterials />,
  },
  {
    path: "/factory/bom",
    element: <FactoryBom />,
  },
  {
    path: "/factory/employees",
    element: <FactoryEmployees />,
  },
  // {
  //   path: '/components',
  //   element: <ComponentsPage />,
  // },
  {
    path: "*",
    element: <Notfound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
