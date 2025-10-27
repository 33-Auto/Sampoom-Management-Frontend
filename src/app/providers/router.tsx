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

  // Master routes
  { path: "/master/items", element: <ItemMaster /> },
  { path: "/master/items/create", element: <ItemCreate /> },
  { path: "/master/bom", element: <BomMaster /> },
  { path: "/master/partners", element: <PartnerMaster /> },
  { path: "/master/departments", element: <DepartmentMaster /> },
  { path: "/master/positions", element: <PositionMaster /> },
  { path: "/master/workcenters", element: <WorkCenterMaster /> },
  { path: "/master/workcenters/create", element: <WorkCenterCreate /> },
  { path: "/master/routings", element: <RoutingMaster /> },
  { path: "/master/routings/create", element: <RoutingCreate /> },

  // Sales
  {
    path: "/sales",
    element: <Navigate to="/sales/orders" replace />,
  },
  {
    path: "/sales/orders",
    element: <SalesOrders />,
  },

  // WMS
  {
    path: "/wms",
    element: <Navigate to="/wms/shipping" replace />,
  },
  {
    path: "/wms/shipping",
    element: <ShippingTodos />,
  },
  {
    path: "/wms/inventory",
    element: <InventoryDashboard />,
  },

  // Production
  {
    path: "/production",
    element: <Navigate to="/production/orders" replace />,
  },
  {
    path: "/production/orders",
    element: <WorkOrders />,
  },
  {
    path: "/production/orders/:id",
    element: <WorkOrderDetail />,
  },
  {
    path: "/production/planning",
    element: <ProductionPlanning />,
  },

  // Purchasing
  {
    path: "/purchasing",
    element: <Navigate to="/purchasing/requests" replace />,
  },
  {
    path: "/purchasing/requests",
    element: <PurchaseRequests />,
  },
  {
    path: "/purchasing/orders",
    element: <PurchaseOrders />,
  },

  // HRM Routes
  {
    path: "/hrm/employees",
    element: <HRMEmployees />,
  },
  {
    path: "/hrm/payroll",
    element: <HRMPayroll />,
  },
  {
    path: "/hrm/attendance",
    element: <HRMAttendance />,
  },
  {
    path: "/hrm/evaluation",
    element: <HRMEvaluation />,
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
  },
  {
    path: "/warehouse/employees",
    lazy: async () => {
      const { default: Component } = await import(
        "@/pages/warehouse/employees/page"
      );
      return { Component };
    },
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
