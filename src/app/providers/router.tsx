/* eslint-disable import/order */
import { lazy, useEffect } from "react";
import type { RouteObject } from "react-router-dom";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

// ============================================================================
// Public Pages - 인증 없이 접근 가능한 페이지
// ============================================================================
import { Home } from "@/pages/home";
import { Login } from "@/pages/login/ui";
import { Register } from "@/pages/register/ui/Register";
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

import {
  bootstrapAuthLoader,
  ensureAuthBootstrapped,
} from "@/app/providers/loaders/bootstrap-auth.loader";
import { useAuthStore } from "@/entities/user";
import { ErrorHandler } from "@/shared/ui";
import { setSkipAuthRefresh } from "@/shared/api/auth-refresh.guard";

// ============================================================================
// Master Pages - 기준 정보 관리 모듈 (지연 로딩)
// ============================================================================
const ItemMaster = lazy(async () => ({
  default: (await import("@/pages/master/items")).ItemMaster,
}));
const DepartmentMaster = lazy(async () => ({
  default: (await import("@/pages/master/departments")).DepartmentMaster,
}));
const PositionMaster = lazy(async () => ({
  default: (await import("@/pages/master/positions")).PositionMaster,
}));

// ============================================================================
// Production Pages - 생산 관리 모듈 (지연 로딩)
// ============================================================================
const WorkOrderDetail = lazy(async () => ({
  default: (await import("@/pages/production/orders/detail")).WorkOrderDetail,
}));
const MasterProductionSchedule = lazy(async () => ({
  default: (await import("@/pages/production/mps")).MasterProductionSchedule,
}));

// ============================================================================
// Purchasing Pages - 구매 관리 모듈 (지연 로딩)
// ============================================================================
const PurchaseRequests = lazy(async () => ({
  default: (await import("@/pages/purchasing/requests")).PurchaseRequests,
}));

// ============================================================================
// Sales Pages - 판매 관리 모듈 (지연 로딩)
// ============================================================================
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

const ShippingProcess = lazy(async () => ({
  default: (await import("@/pages/wms/shipping/process/ui")).ShippingProcess,
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
const EmployeeProfileProcess = lazy(async () => ({
  default: (await import("@/pages/hrm/employees/process"))
    .EmployeeProfileProcess,
}));
const EmployeeStatusProcess = lazy(async () => ({
  default: (await import("@/pages/hrm/employees/process"))
    .EmployeeStatusProcess,
}));

// ============================================================================
// Routes Configuration - 라우트 설정
// ============================================================================
const requireAuth: RouteObject["loader"] = async () => {
  const { user } = useAuthStore.getState();

  if (!user) {
    await ensureAuthBootstrapped();

    const { user: authenticatedUser } = useAuthStore.getState();
    if (!authenticatedUser) {
      throw redirect("/login");
    }
  }

  return null;
};

const normalizeRouterError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (isRouteErrorResponse(error)) {
    const message =
      (typeof error.data === "object" && error.data !== null
        ? (error.data as { message?: string }).message
        : undefined) ??
      error.statusText ??
      "요청을 처리하는 중 오류가 발생했습니다.";

    const routeError = new Error(message);
    (routeError as any).status = error.status;
    (routeError as any).data = error.data;
    return routeError;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("알 수 없는 오류가 발생했습니다.");
};

const RouterErrorBoundary = () => {
  const error = useRouteError();
  const normalizedError = normalizeRouterError(error);

  setSkipAuthRefresh(true);

  useEffect(() => {
    setSkipAuthRefresh(true);

    return () => {
      setSkipAuthRefresh(false);
    };
  }, []);

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <ErrorHandler error={normalizedError} resetErrorBoundary={handleReset} />
  );
};

const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    loader: bootstrapAuthLoader,
    errorElement: <RouterErrorBoundary />,
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
        loader: requireAuth,
        element: <MasterLayout />,
        children: [
          { path: "items", element: <ItemMaster /> },
          {
            path: "items/process",
            lazy: async () => ({
              Component: (await import("@/pages/master/items/process"))
                .ItemProcess,
            }),
          },
          {
            path: "items/process/:id",
            lazy: async () => ({
              Component: (await import("@/pages/master/items/process"))
                .ItemProcess,
            }),
          },
          {
            path: "bom",
            lazy: async () => {
              const { BomMasterPage: Component } = await import(
                "@/pages/master/bom"
              );
              const { bomsLoader } = await import(
                "@/pages/master/bom/api/bom.loaders"
              );
              return { Component, loader: bomsLoader };
            },
          },
          {
            path: "bom/process",
            lazy: async () => ({
              Component: (await import("@/pages/master/bom/process"))
                .BomProcess,
            }),
          },
          {
            path: "bom/process/:id",
            lazy: async () => ({
              Component: (await import("@/pages/master/bom/process"))
                .BomProcess,
            }),
          },
          {
            path: "partners",
            lazy: async () => {
              const { PartnerMaster: Component } = await import(
                "@/pages/master/partners"
              );
              const { partnersLoader } = await import(
                "@/pages/master/partners/api/partners.loaders"
              );
              return { Component, loader: partnersLoader };
            },
          },
          {
            path: "partners/process",
            lazy: async () => {
              const { PartnerProcess: Component } = await import(
                "@/pages/master/partners/process"
              );
              return { Component };
            },
          },
          {
            path: "partners/process/:id",
            lazy: async () => {
              const { PartnerProcess: Component } = await import(
                "@/pages/master/partners/process"
              );
              return { Component };
            },
          },
          {
            path: "branches",
            lazy: async () => {
              const { BranchMaster: Component } = await import(
                "@/pages/master/branches"
              );
              const { branchesLoader } = await import(
                "@/pages/master/branches/api/branches.loaders"
              );
              return { Component, loader: branchesLoader };
            },
          },
          {
            path: "branches/process",
            lazy: async () => {
              const { BranchProcess: Component } = await import(
                "@/pages/master/branches/process"
              );
              return { Component };
            },
          },
          {
            path: "branches/process/:id",
            lazy: async () => {
              const { BranchProcess: Component } = await import(
                "@/pages/master/branches/process"
              );
              return { Component };
            },
          },
          { path: "departments", element: <DepartmentMaster /> },
          { path: "positions", element: <PositionMaster /> },
          {
            path: "workcenters",
            lazy: async () => {
              const { WorkCenterMaster: Component } = await import(
                "@/pages/master/workcenters"
              );
              const { workCentersLoader } = await import(
                "@/pages/master/workcenters/api/workcenters.loaders"
              );
              return { Component, loader: workCentersLoader };
            },
          },
          {
            path: "workcenters/process",
            lazy: async () => {
              const { WorkCenterProcess: Component } = await import(
                "@/pages/master/workcenters/process"
              );
              return { Component };
            },
          },
          {
            path: "workcenters/process/:id",
            lazy: async () => {
              const { WorkCenterProcess: Component } = await import(
                "@/pages/master/workcenters/process"
              );
              return { Component };
            },
          },
          {
            path: "routings",
            lazy: async () => {
              const { RoutingMaster: Component } = await import(
                "@/pages/master/routings"
              );
              const { routingsLoader } = await import(
                "@/pages/master/routings/api/routings.loaders"
              );
              return { Component, loader: routingsLoader };
            },
          },
          {
            path: "routings/process",
            lazy: async () => {
              const { RoutingProcess: Component } = await import(
                "@/pages/master/routings/process"
              );
              return { Component };
            },
          },
          {
            path: "routings/process/:id",
            lazy: async () => {
              const { RoutingProcess: Component } = await import(
                "@/pages/master/routings/process"
              );
              return { Component };
            },
          },
        ],
      },

      // ----------------------------------------------------------------------------
      // Sales Module - 판매 관리
      // ----------------------------------------------------------------------------
      {
        path: "/sales",
        loader: requireAuth,
        element: <SalesLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/sales/orders" replace />,
          },
          {
            path: "orders",
            lazy: async () => {
              const { SalesOrders } = await import("@/pages/sales/orders");
              const { loader } = await import(
                "@/pages/sales/orders/api/loader"
              );
              return { Component: SalesOrders, loader };
            },
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
        loader: requireAuth,
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
            path: "shipping/process/:warehouseId/:orderId",
            element: <ShippingProcess />,
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
            path: "orders",
            lazy: async () => {
              const { WmsPurchaseOrders } = await import(
                "@/pages/wms/purchase-orders"
              );
              const { loader } = await import(
                "@/pages/wms/purchase-orders/api/loader"
              );
              return { Component: WmsPurchaseOrders, loader };
            },
          },
          {
            path: "orders/stocking/:purchaseOrderId",
            lazy: async () => {
              const { default: Component } = await import(
                "@/pages/wms/purchase-orders/detail/StockingPage"
              );
              const { stockingProcessLoader } = await import(
                "@/features/stocking-process/api/stocking-process.loader"
              );
              return {
                Component,
                loader: async ({ params }) => {
                  const purchaseOrderId = Number(params.purchaseOrderId);
                  if (Number.isNaN(purchaseOrderId)) {
                    throw new Response("Invalid purchaseOrderId", {
                      status: 400,
                    });
                  }
                  return stockingProcessLoader(purchaseOrderId);
                },
              };
            },
          },
          {
            path: "rop-settings",
            lazy: async () => {
              const { RopSettings } = await import("@/pages/wms/rop-settings");
              const { ropSettingsLoader } = await import(
                "@/pages/wms/rop-settings/api/rop-settings.loader"
              );
              return { Component: RopSettings, loader: ropSettingsLoader };
            },
          },
          {
            path: "rop-settings/process/:id?",
            lazy: async () => {
              const { RopProcess: Component } = await import(
                "@/pages/wms/rop-settings/process"
              );
              return { Component };
            },
          },
        ],
      },

      // ----------------------------------------------------------------------------
      // Production Module - 생산 관리
      // ----------------------------------------------------------------------------
      {
        path: "/production",
        loader: requireAuth,
        element: <ProductionLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/production/orders" replace />,
          },
          {
            path: "orders",
            lazy: async () => {
              const { WorkOrders } = await import("@/pages/production/orders");
              const { loader } = await import(
                "@/pages/production/orders/api/loader"
              );
              return { Component: WorkOrders, loader };
            },
          },
          {
            path: "orders/:id",
            element: <WorkOrderDetail />,
          },
          {
            path: "planning",
            lazy: async () => {
              const { ProductionPlanning } = await import(
                "@/pages/production/planning"
              );
              const { loader } = await import(
                "@/pages/production/planning/api/loader"
              );
              return { Component: ProductionPlanning, loader };
            },
          },
          {
            path: "mps",
            element: <MasterProductionSchedule />,
          },
        ],
      },

      // ----------------------------------------------------------------------------
      // Purchasing Module - 구매 관리
      // ----------------------------------------------------------------------------
      {
        path: "/purchasing",
        loader: requireAuth,
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
        ],
      },

      // ----------------------------------------------------------------------------
      // HRM Module - 인사 관리 (지연 로딩)
      // ----------------------------------------------------------------------------
      {
        path: "/hrm",
        loader: requireAuth,
        element: <HRMLayout />,
        children: [
          {
            path: "employees",
            element: <HRMEmployees />,
          },
          {
            path: "employees/process/:id",
            element: <EmployeeProfileProcess />,
          },
          {
            path: "employees/status/:id",
            element: <EmployeeStatusProcess />,
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
