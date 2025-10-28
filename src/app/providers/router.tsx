/* eslint-disable import/order */
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Navigate } from "react-router-dom";

// ============================================================================
// Public Pages - 인증 없이 접근 가능한 페이지
// ============================================================================
import { Home } from "@/pages/home";
import { Login } from "@/pages/login/ui";
import Register from "@/pages/register/ui/Register";
import { Notfound } from "@/pages/Notfound/Notfound";

// ============================================================================
// Master Pages - 기준 정보 관리 모듈
// ============================================================================
import { BomMasterPage as BomMaster } from "@/pages/master/bom";
import { CreateBOM as BomCreate } from "@/pages/master/bom/create";
import { DepartmentMaster } from "@/pages/master/departments";
import { ItemMaster } from "@/pages/master/items";
import { ItemCreate } from "@/pages/master/items/create";
import { PartnerMaster } from "@/pages/master/partners";
import { PositionMaster } from "@/pages/master/positions";
import { RoutingMaster } from "@/pages/master/routings";
import { RoutingCreate } from "@/pages/master/routings/create";
import { WorkCenterMaster } from "@/pages/master/workcenters";
import { CreateWorkCenter as WorkCenterCreate } from "@/pages/master/workcenters/create";

// ============================================================================
// Production Pages - 생산 관리 모듈
// ============================================================================
import { WorkOrders } from "@/pages/production/orders";
import { WorkOrderDetail } from "@/pages/production/orders/detail";
import { ProductionPlanning } from "@/pages/production/planning";

// ============================================================================
// Purchasing Pages - 구매 관리 모듈
// ============================================================================
import { PurchaseOrders } from "@/pages/purchasing/orders";
import { PurchaseRequests } from "@/pages/purchasing/requests";

// ============================================================================
// Sales Pages - 판매 관리 모듈
// ============================================================================
import { SalesOrders } from "@/pages/sales/orders";

// ============================================================================
// WMS Pages - 창고 관리 모듈
// ============================================================================
import { loader as warehouseInventoryLoader } from "@/pages/wms/inventory/api/loader";
import { InventoryDashboard } from "@/pages/wms/inventory";
import { ShippingTodos } from "@/pages/wms/shipping";

// ============================================================================
// Layouts - 각 모듈별 레이아웃 컴포넌트
// ============================================================================
import HRMLayout from "@/widgets/Layout/HRMLayout";
import MasterLayout from "@/widgets/Layout/MasterLayout";
import ProductionLayout from "@/widgets/Layout/ProductionLayout";
import PurchasingLayout from "@/widgets/Layout/PurchasingLayout";
import SalesLayout from "@/widgets/Layout/SalesLayout";
import WMSLayout from "@/widgets/Layout/WMSLayout";

// ============================================================================
// HRM Pages - 인사 관리 모듈 (지연 로딩)
// ============================================================================
const HRMEmployees = lazy(async () => ({
  default: (await import("@/pages/hrm/employees")).HRMEmployees,
}));
const HRMPayroll = lazy(async () => ({
  default: (await import("@/pages/hrm/payroll")).HRMPayroll,
}));
const HRMAttendance = lazy(async () => ({
  default: (await import("@/pages/hrm/attendance")).HRMAttendance,
}));
const HRMEvaluation = lazy(async () => ({
  default: (await import("@/pages/hrm/evaluation")).HRMEvaluation,
}));

// ============================================================================
// Routes Configuration - 라우트 설정
// ============================================================================
const routes: RouteObject[] = [
  // ----------------------------------------------------------------------------
  // Public Routes - 공개 페이지
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Master Module - 기준 정보 관리
  // ----------------------------------------------------------------------------
  {
    path: "/master",
    element: <MasterLayout />,
    children: [
      { path: "items", element: <ItemMaster /> },
      { path: "items/create", element: <ItemCreate /> },
      { path: "bom", element: <BomMaster /> },
      { path: "bom/create", element: <BomCreate /> },
      { path: "partners", element: <PartnerMaster /> },
      { path: "departments", element: <DepartmentMaster /> },
      { path: "positions", element: <PositionMaster /> },
      { path: "workcenters", element: <WorkCenterMaster /> },
      { path: "workcenters/create", element: <WorkCenterCreate /> },
      { path: "routings", element: <RoutingMaster /> },
      { path: "routings/create", element: <RoutingCreate /> },
    ],
  },

  // ----------------------------------------------------------------------------
  // Sales Module - 판매 관리
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // WMS Module - 창고 관리
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Production Module - 생산 관리
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Purchasing Module - 구매 관리
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // HRM Module - 인사 관리 (지연 로딩)
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Warehouse Module - 창고 대시보드 (지연 로딩)
  // ----------------------------------------------------------------------------
  {
    path: "/warehouse",
    element: <Navigate to="/warehouse/dashboard" replace />,
  },
  {
    path: "/warehouse/dashboard",
    lazy: async () => {
      const { WarehouseDashboard: Component } = await import(
        "@/pages/warehouse"
      );
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
      const { WarehouseInventory: Component } = await import(
        "@/pages/warehouse/inventory"
      );
      return { Component };
    },
    loader: warehouseInventoryLoader,
  },

  // ----------------------------------------------------------------------------
  // Factory Module - 생산 관리 (지연 로딩)
  // ----------------------------------------------------------------------------
  {
    path: "/factory",
    element: <Navigate to="/factory/dashboard" replace />,
  },
  {
    path: "/factory/dashboard",
    lazy: async () => {
      const { FactoryDashboard: Component } = await import("@/pages/factory");
      return { Component };
    },
  },
  {
    path: "/factory/orders",
    lazy: async () => {
      const { FactoryOrders: Component } = await import(
        "@/pages/factory/orders"
      );
      return { Component };
    },
  },
  // {
  //   path: "/factory/materials",
  //   lazy: async () => {
  //     const { default: Component } = await import(
  //       "@/pages/factory/materials/page"
  //     );
  //     return { Component };
  //   },
  // },
  {
    path: "/factory/bom",
    lazy: async () => {
      const { FactoryBOM: Component } = await import("@/pages/factory/bom");
      return { Component };
    },
  },
  {
    path: "/factory/employees",
    lazy: async () => {
      const { FactoryEmployees: Component } = await import(
        "@/pages/factory/employees"
      );
      return { Component };
    },
  },

  // ----------------------------------------------------------------------------
  // Not Found - 404 페이지
  // ----------------------------------------------------------------------------
  {
    path: "*",
    element: <Notfound />,
  },
];

// ============================================================================
// Create Router - 라우터 생성 및 내보내기
// ============================================================================
const router = createBrowserRouter(routes);

export default router;
