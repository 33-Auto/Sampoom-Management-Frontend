import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

// Auth pages
import { Login } from "@/pages/login/ui";
import Register from "@/pages/register/ui/Register";
import Home from "@/pages/home/page";

// Master pages
import ItemMaster from "@/pages/master/items/page";
import ItemCreate from "@/pages/master/items/create/page";
import BomMaster from "@/pages/master/bom/page";
import PartnerMaster from "@/pages/master/partners/page";
import DepartmentMaster from "@/pages/master/departments/page";
import PositionMaster from "@/pages/master/positions/page";
import WorkCenterMaster from "@/pages/master/workcenters/page";
import WorkCenterCreate from "@/pages/master/workcenters/create/page";
import RoutingMaster from "@/pages/master/routings/page";
import RoutingCreate from "@/pages/master/routings/create/page";

// Sales
import SalesOrders from "@/pages/sales/orders/page";

// WMS
import ShippingTodos from "@/pages/wms/shipping/page";
import InventoryDashboard from "@/pages/wms/inventory/page";

// Production
import WorkOrders from "@/pages/production/orders/page";
import WorkOrderDetail from "@/pages/production/orders/detail/page";
import ProductionPlanning from "@/pages/production/planning/page";

// Purchasing
import PurchaseRequests from "@/pages/purchasing/requests/page";
import PurchaseOrders from "@/pages/purchasing/orders/page";

import { Notfound } from "@/pages/Notfound/Notfound";

// Layouts
import MasterLayout from "@/widgets/Layout/MasterLayout";
import SalesLayout from "@/widgets/Layout/SalesLayout";
import WMSLayout from "@/widgets/Layout/WMSLayout";
import ProductionLayout from "@/widgets/Layout/ProductionLayout";
import PurchasingLayout from "@/widgets/Layout/PurchasingLayout";
import HRMLayout from "@/widgets/Layout/HRMLayout";

// loaders
import { loader as warehouseInventoryLoader } from "@/pages/wms/inventory/api/loader";

// HRM Pages - lazy loading
const HRMEmployees = lazy(() => import("@/pages/hrm/employees/page"));
const HRMPayroll = lazy(() => import("@/pages/hrm/payroll/page"));
const HRMAttendance = lazy(() => import("@/pages/hrm/attendance/page"));
const HRMEvaluation = lazy(() => import("@/pages/hrm/evaluation/page"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },

  // Master routes with nested layout using Outlet
  {
    path: "/master",
    element: <MasterLayout />,
    children: [
      { path: "items", element: <ItemMaster /> },
      { path: "items/create", element: <ItemCreate /> },
      { path: "bom", element: <BomMaster /> },
      { path: "partners", element: <PartnerMaster /> },
      { path: "departments", element: <DepartmentMaster /> },
      { path: "positions", element: <PositionMaster /> },
      { path: "workcenters", element: <WorkCenterMaster /> },
      { path: "workcenters/create", element: <WorkCenterCreate /> },
      { path: "routings", element: <RoutingMaster /> },
      { path: "routings/create", element: <RoutingCreate /> },
    ],
  },

  // Sales routes with nested layout
  {
    path: "/sales",
    element: <SalesLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/sales/orders" replace />,
      },
      {
        path: "orders",
        element: <SalesOrders />,
      },
    ],
  },

  // WMS routes with nested layout
  {
    path: "/wms",
    element: <WMSLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/wms/shipping" replace />,
      },
      {
        path: "shipping",
        element: <ShippingTodos />,
      },
      {
        path: "inventory",
        element: <InventoryDashboard />,
      },
    ],
  },

  // Production routes with nested layout
  {
    path: "/production",
    element: <ProductionLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/production/orders" replace />,
      },
      {
        path: "orders",
        element: <WorkOrders />,
      },
      {
        path: "orders/:id",
        element: <WorkOrderDetail />,
      },
      {
        path: "planning",
        element: <ProductionPlanning />,
      },
    ],
  },

  // Purchasing routes with nested layout
  {
    path: "/purchasing",
    element: <PurchasingLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/purchasing/requests" replace />,
      },
      {
        path: "requests",
        element: <PurchaseRequests />,
      },
      {
        path: "orders",
        element: <PurchaseOrders />,
      },
    ],
  },

  // HRM Routes with nested layout
  {
    path: "/hrm",
    element: <HRMLayout />,
    children: [
      {
        path: "employees",
        element: <HRMEmployees />,
      },
      {
        path: "payroll",
        element: <HRMPayroll />,
      },
      {
        path: "attendance",
        element: <HRMAttendance />,
      },
      {
        path: "evaluation",
        element: <HRMEvaluation />,
      },
    ],
  },

  // Warehouse routes
  {
    path: "/warehouse",
    element: <Navigate to="/warehouse/dashboard" replace />,
  },
  {
    path: "/warehouse/dashboard",
    lazy: async () => {
      const { default: Component } = await import("@/pages/warehouse/page");
      return { Component };
    },
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
    lazy: async () => {
      const { default: Component } = await import(
        "@/pages/warehouse/inventory/page"
      );
      return { Component };
    },
    loader: warehouseInventoryLoader,
  },

  // Factory routes
  {
    path: "/factory",
    element: <Navigate to="/factory/dashboard" replace />,
  },
  {
    path: "/factory/dashboard",
    lazy: async () => {
      const { default: Component } = await import("@/pages/factory/page");
      return { Component };
    },
  },
  {
    path: "/factory/orders",
    lazy: async () => {
      const { default: Component } = await import(
        "@/pages/factory/orders/page"
      );
      return { Component };
    },
  },
  {
    path: "/factory/materials",
    lazy: async () => {
      const { default: Component } = await import(
        "@/pages/factory/materials/page"
      );
      return { Component };
    },
  },
  {
    path: "/factory/bom",
    lazy: async () => {
      const { default: Component } = await import("@/pages/factory/bom/page");
      return { Component };
    },
  },
  {
    path: "/factory/employees",
    lazy: async () => {
      const { default: Component } = await import(
        "@/pages/factory/employees/page"
      );
      return { Component };
    },
  },

  {
    path: "*",
    element: <Notfound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
