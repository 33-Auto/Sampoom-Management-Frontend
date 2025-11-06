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
// Layouts - 각 모듈별 레이아웃 컴포넌트 (즉시 로딩)
// ============================================================================
import AppLayout from "@/widgets/Layout/AppLayout";
import HRMLayout from "@/widgets/Layout/HRMLayout";
import MasterLayout from "@/widgets/Layout/MasterLayout";
import ProductionLayout from "@/widgets/Layout/ProductionLayout";
import PurchasingLayout from "@/widgets/Layout/PurchasingLayout";
import SalesLayout from "@/widgets/Layout/SalesLayout";
import WMSLayout from "@/widgets/Layout/WMSLayout";

// ============================================================================
// Master Pages - 기준 정보 관리 모듈 (지연 로딩)
// ============================================================================
const ItemMaster = lazy(async () => ({
  default: (await import("@/pages/master/items")).ItemMaster,
}));
const ItemCreate = lazy(async () => ({
  default: (await import("@/pages/master/items/create")).ItemCreate,
}));
const BomMaster = lazy(async () => ({
  default: (await import("@/pages/master/bom")).BomMasterPage,
}));
const BomCreate = lazy(async () => ({
  default: (await import("@/pages/master/bom/create")).CreateBOM,
}));
const PartnerMaster = lazy(async () => ({
  default: (await import("@/pages/master/partners")).PartnerMaster,
}));
const DepartmentMaster = lazy(async () => ({
  default: (await import("@/pages/master/departments")).DepartmentMaster,
}));
const PositionMaster = lazy(async () => ({
  default: (await import("@/pages/master/positions")).PositionMaster,
}));
const WorkCenterMaster = lazy(async () => ({
  default: (await import("@/pages/master/workcenters")).WorkCenterMaster,
}));
const WorkCenterCreate = lazy(async () => ({
  default: (await import("@/pages/master/workcenters/create")).CreateWorkCenter,
}));
const RoutingMaster = lazy(async () => ({
  default: (await import("@/pages/master/routings")).RoutingMaster,
}));
const RoutingCreate = lazy(async () => ({
  default: (await import("@/pages/master/routings/create")).RoutingCreate,
}));

// ============================================================================
// Production Pages - 생산 관리 모듈 (지연 로딩)
// ============================================================================
const WorkOrders = lazy(async () => ({
  default: (await import("@/pages/production/orders")).WorkOrders,
}));
const WorkOrderDetail = lazy(async () => ({
  default: (await import("@/pages/production/orders/detail")).WorkOrderDetail,
}));
const ProductionPlanning = lazy(async () => ({
  default: (await import("@/pages/production/planning")).ProductionPlanning,
}));

// ============================================================================
// Purchasing Pages - 구매 관리 모듈 (지연 로딩)
// ============================================================================
const PurchaseOrders = lazy(async () => ({
  default: (await import("@/pages/purchasing/orders")).PurchaseOrders,
}));
const PurchaseRequests = lazy(async () => ({
  default: (await import("@/pages/purchasing/requests")).PurchaseRequests,
}));

// ============================================================================
// Sales Pages - 판매 관리 모듈 (지연 로딩)
// ============================================================================
const SalesOrders = lazy(async () => ({
  default: (await import("@/pages/sales/orders")).SalesOrders,
}));
const SalesOrderDetail = lazy(async () => ({
  default: (await import("@/pages/sales/orders/detail")).SalesOrderDetail,
}));

// ============================================================================
// WMS Pages - 창고 관리 모듈 (지연 로딩)
// ============================================================================
// const InventoryDashboard = lazy(async () => ({
//   default: (await import("@/pages/wms/inventory")).InventoryDashboard,
// }));
// const ShippingTodos = lazy(async () => ({
//   default: (await import("@/pages/wms/shipping")).ShippingTodos,
// }));

const ReceivingProcess = lazy(async () => ({
  default: (await import("@/pages/wms/receiving/process")).ReceivingProcess,
}));

const WmsPurchaseOrders = lazy(async () => ({
  default: (await import("@/pages/wms/purchase-orders")).WmsPurchaseOrders,
}));

const RopSettings = lazy(async () => ({
  default: (await import("@/pages/wms/rop-settings")).RopSettings,
}));

const RopProcess = lazy(async () => ({
  default: (await import("@/pages/wms/rop-settings/process")).RopProcess,
}));

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
  {
    element: <AppLayout />,
    children: [
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
          {
            path: "items/:type/:id/edit",
            lazy: async () => ({
              Component: (await import("@/pages/master/items/edit")).ItemEdit,
            }),
          },
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
          {
            path: "orders/:id",
            element: <SalesOrderDetail />,
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
            lazy: async () => {
              const { ShippingTodos } = await import("@/pages/wms/shipping");
              const { loader } = await import(
                "@/pages/wms/shipping/api/loader"
              );
              return { Component: ShippingTodos, loader };
            },
          },
          {
            path: "inventory",
            lazy: async () => {
              const { InventoryDashboard } = await import(
                "@/pages/wms/inventory"
              );
              const { loader } = await import(
                "@/pages/wms/inventory/api/loader"
              );
              return { Component: InventoryDashboard, loader };
            },
          },
          {
            path: "receiving",
            lazy: async () => {
              const { ReceivingMaterials } = await import(
                "@/pages/wms/receiving"
              );
              const { loader } = await import(
                "@/pages/wms/receiving/api/loader"
              );
              return { Component: ReceivingMaterials, loader };
            },
          },
          {
            path: "receiving/process/:warehouseId/:processId",
            element: <ReceivingProcess />,
            loader: async ({ params }) => {
              if (!params.warehouseId || !params.processId) {
                throw new Error("warehouseId와 processId가 필요합니다.");
              }
              const { ReceivingProcessLoader } = await import(
                "@/features/receiving-process/api/receiving-process.loader"
              );
              return ReceivingProcessLoader(
                Number(params.warehouseId),
                Number(params.processId),
              );
            },
          },
          {
            path: "orders",
            element: <WmsPurchaseOrders />,
          },
          {
            path: "rop-settings",
            element: <RopSettings />,
          },
          {
            path: "rop-settings/process/:id?",
            element: <RopProcess />,
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
          const { default: Component } = await import(
            "@/pages/warehouse-orders"
          );
          const { loader } = await import(
            "@/pages/warehouse-orders/api/loader"
          );
          return { Component, loader };
        },
      },
      {
        path: "/warehouse/inventory",
        lazy: async () => {
          const { WarehouseInventory: Component } = await import(
            "@/pages/warehouse/inventory"
          );
          const { loader } = await import("@/pages/wms/inventory/api/loader");
          return { Component, loader };
        },
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
          const { FactoryDashboard: Component } = await import(
            "@/pages/factory"
          );
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
    ],
  },
];

// ============================================================================
// Create Router - 라우터 생성 및 내보내기
// ============================================================================
const router = createBrowserRouter(routes);

export default router;
