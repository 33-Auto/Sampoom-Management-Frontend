/* eslint-disable import-x/order */
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
import {
  bootstrapAuthLoader,
  ensureAuthBootstrapped,
} from "@/app/providers/loaders/bootstrap-auth.loader";
import { useAuthStore } from "@/entities/user";
import { Home } from "@/pages/home";
import { Login } from "@/pages/login";
import { Notfound } from "@/pages/Notfound";
import { Register } from "@/pages/register";
import { InventoryDashboard, inventoryLoader } from "@/pages/wms/inventory";
import {
  WmsPurchaseOrders,
  wmsPurchaseOrdersLoader,
} from "@/pages/wms/purchase-orders";
import {
  RopSettings,
  ropSettingsLoader,
  RopProcess,
} from "@/pages/wms/rop-settings";
import { ShippingTodos, shippingLoader } from "@/pages/wms/shipping";

// ============================================================================
// Layouts - 각 모듈별 레이아웃 컴포넌트 (즉시 로딩)
// ============================================================================
import { setSkipAuthRefresh } from "@/shared/api";
import { ErrorHandler } from "@/shared/ui";
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
const DepartmentMaster = lazy(async () => ({
  default: (await import("@/pages/master/departments")).DepartmentMaster,
}));
const PositionMaster = lazy(async () => ({
  default: (await import("@/pages/master/positions")).PositionMaster,
}));

// ============================================================================
// Purchasing Pages - 구매 관리 모듈 (지연 로딩)
// ============================================================================

// ============================================================================
// Routes Configuration - 라우트 설정
// ============================================================================

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
            path: "items/process/:id",
            lazy: async () => {
              const { ItemProcess } = await import("@/pages/master/items");
              return { Component: ItemProcess };
            },
          },
          {
            path: "items/new",
            lazy: async () => {
              const { ItemProcess } = await import("@/pages/master/items");
              return { Component: ItemProcess };
            },
          },
          {
            path: "bom",
            lazy: async () => {
              const { BomMasterPage: Component, bomsLoader } =
                await import("@/pages/master/bom");
              return { Component, loader: bomsLoader };
            },
          },
          {
            path: "bom/process",
            lazy: async () => ({
              Component: (await import("@/pages/master/bom")).BomProcess,
            }),
          },
          {
            path: "bom/process/:id",
            lazy: async () => ({
              Component: (await import("@/pages/master/bom")).BomProcess,
            }),
          },
          {
            path: "partners",
            lazy: async () => {
              const { PartnerMaster: Component, partnersLoader } =
                await import("@/pages/master/partners");
              return { Component, loader: partnersLoader };
            },
          },
          {
            path: "partners/process",
            lazy: async () => {
              const { PartnerProcess: Component } =
                await import("@/pages/master/partners");
              return { Component };
            },
          },
          {
            path: "partners/process/:id",
            lazy: async () => {
              const { PartnerProcess: Component } =
                await import("@/pages/master/partners");
              return { Component };
            },
          },
          {
            path: "branches",
            lazy: async () => {
              const { BranchMaster: Component, branchesLoader } =
                await import("@/pages/master/branches");
              return { Component, loader: branchesLoader };
            },
          },
          {
            path: "branches/process",
            lazy: async () => {
              const { BranchProcess: Component } =
                await import("@/pages/master/branches");
              return { Component };
            },
          },
          {
            path: "branches/process/:id",
            lazy: async () => {
              const { BranchProcess: Component } =
                await import("@/pages/master/branches");
              return { Component };
            },
          },
          { path: "departments", element: <DepartmentMaster /> },
          { path: "positions", element: <PositionMaster /> },
          {
            path: "workcenters",
            lazy: async () => {
              const { WorkCenterMaster: Component, workCentersLoader } =
                await import("@/pages/master/workcenters");
              return { Component, loader: workCentersLoader };
            },
          },
          {
            path: "workcenters/process",
            lazy: async () => {
              const { WorkCenterProcess: Component } =
                await import("@/pages/master/workcenters");
              return { Component };
            },
          },
          {
            path: "workcenters/process/:id",
            lazy: async () => {
              const { WorkCenterProcess: Component } =
                await import("@/pages/master/workcenters");
              return { Component };
            },
          },
          {
            path: "routings",
            lazy: async () => {
              const { RoutingMaster: Component, routingsLoader } =
                await import("@/pages/master/routings");
              return { Component, loader: routingsLoader };
            },
          },
          {
            path: "routings/process",
            lazy: async () => {
              const { RoutingProcess: Component } =
                await import("@/pages/master/routings");
              return { Component };
            },
          },
          {
            path: "routings/process/:id",
            lazy: async () => {
              const { RoutingProcess: Component } =
                await import("@/pages/master/routings");
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
              const { SalesOrders, salesOrdersLoader } =
                await import("@/pages/sales/orders");
              return { Component: SalesOrders, loader: salesOrdersLoader };
            },
          },
          {
            path: "orders/:id",
            lazy: async () => {
              const { SalesOrderDetail } = await import("@/pages/sales/orders");
              return { Component: SalesOrderDetail };
            },
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
              return {
                Component: ShippingTodos,
                loader: shippingLoader,
              };
            },
          },
          {
            path: "shipping/process/:warehouseId/:orderId",
            lazy: async () => {
              const { ShippingProcess } = await import("@/pages/wms/shipping");
              return { Component: ShippingProcess };
            },
          },
          {
            path: "inventory",
            lazy: async () => {
              return {
                Component: InventoryDashboard,
                loader: inventoryLoader,
              };
            },
          },
          {
            path: "orders",
            lazy: async () => {
              return {
                Component: WmsPurchaseOrders,
                loader: wmsPurchaseOrdersLoader,
              };
            },
          },
          {
            path: "orders/stocking/:purchaseOrderId",
            lazy: async () => {
              const { StockingPage, stockingProcessLoader } =
                await import("@/pages/wms/purchase-orders");
              return {
                Component: StockingPage,
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
              return {
                Component: RopSettings,
                loader: ropSettingsLoader,
              };
            },
          },
          {
            path: "rop-settings/process/:id?",
            lazy: async () => {
              return { Component: RopProcess };
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
              const { WorkOrders, workOrdersLoader } =
                await import("@/pages/production/orders");
              return { Component: WorkOrders, loader: workOrdersLoader };
            },
          },
          {
            path: "orders/:id",
            lazy: async () => {
              const { WorkOrderDetail } =
                await import("@/pages/production/orders");
              return { Component: WorkOrderDetail };
            },
          },
          {
            path: "planning",
            lazy: async () => {
              const { ProductionPlanning, productionPlanningLoader } =
                await import("@/pages/production/planning");
              return {
                Component: ProductionPlanning,
                loader: productionPlanningLoader,
              };
            },
          },
          {
            path: "mps",
            lazy: async () => {
              const { MasterProductionSchedule } =
                await import("@/pages/production/mps");
              return { Component: MasterProductionSchedule };
            },
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
            lazy: async () => {
              const { PurchaseRequests, purchasingRequestsLoader } =
                await import("@/pages/purchasing/requests");
              return {
                Component: PurchaseRequests,
                loader: purchasingRequestsLoader,
              };
            },
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
            lazy: async () => {
              const { HRMEmployees, hrmEmployeesLoader } =
                await import("@/pages/hrm/employees");
              return { Component: HRMEmployees, loader: hrmEmployeesLoader };
            },
          },
          {
            path: "employees/process/:id",
            lazy: async () => {
              const { EmployeeProfileProcess } =
                await import("@/pages/hrm/employees");
              return { Component: EmployeeProfileProcess };
            },
          },
          {
            path: "employees/status/:id",
            lazy: async () => {
              const { EmployeeStatusProcess } =
                await import("@/pages/hrm/employees");
              return { Component: EmployeeStatusProcess };
            },
          },
          {
            path: "payroll",
            lazy: async () => {
              const { HRMPayroll } = await import("@/pages/hrm/payroll");
              return { Component: HRMPayroll };
            },
          },
          {
            path: "attendance",
            lazy: async () => {
              const { HRMAttendance } = await import("@/pages/hrm/attendance");
              return { Component: HRMAttendance };
            },
          },
          {
            path: "evaluation",
            lazy: async () => {
              const { HRMEvaluation } = await import("@/pages/hrm/evaluation");
              return { Component: HRMEvaluation };
            },
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
// MSW가 준비되기 전에 router가 생성될 수 있으므로,
// router를 함수로 만들어서 필요할 때 만들도록 한다
const createRouter = () => createBrowserRouter(routes);

// 기본 export는 함수로 변경 (하위 호환성을 위해 router도 export)
const router = createRouter();
export default router;
export { createRouter };
