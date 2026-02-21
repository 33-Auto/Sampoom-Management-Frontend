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


import { ItemProcess } from "@/pages/master/items/process";
import { BomMasterPage } from "@/pages/master/bom";
import { bomsLoader } from "@/pages/master/bom/api/bom.loaders";
import { BomProcess } from "@/pages/master/bom/process";
import { PartnerMaster } from "@/pages/master/partners";
import { partnersLoader } from "@/pages/master/partners/api/partners.loaders";
import { PartnerProcess } from "@/pages/master/partners/process";
import { BranchMaster } from "@/pages/master/branches";
import { branchesLoader } from "@/pages/master/branches/api/branches.loaders";
import { BranchProcess } from "@/pages/master/branches/process";
import { WorkCenterMaster } from "@/pages/master/workcenters";
import { workCentersLoader } from "@/pages/master/workcenters/api/workcenters.loaders";
import { WorkCenterProcess } from "@/pages/master/workcenters/process";
import { RoutingMaster } from "@/pages/master/routings";
import { routingsLoader } from "@/pages/master/routings/api/routings.loaders";
import { RoutingProcess } from "@/pages/master/routings/process";
import { SalesOrders } from "@/pages/sales/orders";
import { loader as salesOrdersLoader } from "@/pages/sales/orders/api/loader";
import { ShippingTodos } from "@/pages/wms/shipping";
import { loader as shippingTodosLoader } from "@/pages/wms/shipping/api/loader";
import { InventoryDashboard } from "@/pages/wms/inventory";
import { loader as inventoryDashboardLoader } from "@/pages/wms/inventory/api/loader";
import { WmsPurchaseOrders } from "@/pages/wms/purchase-orders";
import { loader as purchaseOrdersLoader } from "@/pages/wms/purchase-orders/api/loader";
import StockingPage from "@/pages/wms/purchase-orders/detail/StockingPage";
import { stockingProcessLoader } from "@/features/stocking-process/api/stocking-process.loader";
import { RopSettings } from "@/pages/wms/rop-settings";
import { ropSettingsLoader } from "@/pages/wms/rop-settings/api/rop-settings.loader";
import { RopProcess } from "@/pages/wms/rop-settings/process";
import { WorkOrders } from "@/pages/production/orders";
import { loader as workOrdersLoader } from "@/pages/production/orders/api/loader";
import { ProductionPlanning } from "@/pages/production/planning";
import { loader as productionPlanningLoader } from "@/pages/production/planning/api/loader";

// ============================================================================
// Master Pages - 기준 정보 관리 모듈 (지연 로딩)
// ============================================================================
import { ItemMaster } from "@/pages/master/items";
import { DepartmentMaster } from "@/pages/master/departments";
import { PositionMaster } from "@/pages/master/positions";

// ============================================================================
// Production Pages - 생산 관리 모듈 (지연 로딩)
// ============================================================================
import { WorkOrderDetail } from "@/pages/production/orders/detail";
import { MasterProductionSchedule } from "@/pages/production/mps";

// ============================================================================
// Purchasing Pages - 구매 관리 모듈 (지연 로딩)
// ============================================================================
import { PurchaseRequests } from "@/pages/purchasing/requests";

// ============================================================================
// Sales Pages - 판매 관리 모듈 (지연 로딩)
// ============================================================================
import { SalesOrderDetail } from "@/pages/sales/orders/detail";

// ============================================================================
// WMS Pages - 창고 관리 모듈 (지연 로딩)
// ============================================================================
// const InventoryDashboard = lazy(async () => ({
//   default: (await import("@/pages/wms/inventory")).InventoryDashboard,
// }));
// const ShippingTodos = lazy(async () => ({
//   default: (await import("@/pages/wms/shipping")).ShippingTodos,
// }));

import { ShippingProcess } from "@/pages/wms/shipping/process/ui";

// ============================================================================
// HRM Pages - 인사 관리 모듈 (지연 로딩)
// ============================================================================
import { HRMEmployees } from "@/pages/hrm/employees";
import { HRMPayroll } from "@/pages/hrm/payroll";
import { HRMAttendance } from "@/pages/hrm/attendance";
import { HRMEvaluation } from "@/pages/hrm/evaluation";
import { EmployeeProfileProcess } from "@/pages/hrm/employees/process";
import { EmployeeStatusProcess } from "@/pages/hrm/employees/process";

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
            element: <ItemProcess />,
          },
          {
            path: "items/process/:id",
            element: <ItemProcess />,
          },
          {
            path: "bom",
            element: <BomMasterPage />, loader: bomsLoader,
          },
          {
            path: "bom/process",
            element: <BomProcess />,
          },
          {
            path: "bom/process/:id",
            element: <BomProcess />,
          },
          {
            path: "partners",
            element: <PartnerMaster />, loader: partnersLoader,
          },
          {
            path: "partners/process",
            element: <PartnerProcess />,
          },
          {
            path: "partners/process/:id",
            element: <PartnerProcess />,
          },
          {
            path: "branches",
            element: <BranchMaster />, loader: branchesLoader,
          },
          {
            path: "branches/process",
            element: <BranchProcess />,
          },
          {
            path: "branches/process/:id",
            element: <BranchProcess />,
          },
          { path: "departments", element: <DepartmentMaster /> },
          { path: "positions", element: <PositionMaster /> },
          {
            path: "workcenters",
            element: <WorkCenterMaster />, loader: workCentersLoader,
          },
          {
            path: "workcenters/process",
            element: <WorkCenterProcess />,
          },
          {
            path: "workcenters/process/:id",
            element: <WorkCenterProcess />,
          },
          {
            path: "routings",
            element: <RoutingMaster />, loader: routingsLoader,
          },
          {
            path: "routings/process",
            element: <RoutingProcess />,
          },
          {
            path: "routings/process/:id",
            element: <RoutingProcess />,
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
            element: <SalesOrders />, loader: salesOrdersLoader,
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
            element: <ShippingTodos />, loader: shippingTodosLoader,
          },
          {
            path: "shipping/process/:warehouseId/:orderId",
            element: <ShippingProcess />,
          },
          {
            path: "inventory",
            element: <InventoryDashboard />, loader: inventoryDashboardLoader,
          },
          {
            path: "orders",
            element: <WmsPurchaseOrders />, loader: purchaseOrdersLoader,
          },
          {
            path: "orders/stocking/:purchaseOrderId",
            element: <StockingPage />, loader: async ({ params }) => { const purchaseOrderId = Number(params.purchaseOrderId); if (Number.isNaN(purchaseOrderId)) { throw new Response("Invalid purchaseOrderId", { status: 400 }); } return stockingProcessLoader(purchaseOrderId); },
          },
          {
            path: "rop-settings",
            element: <RopSettings />, loader: ropSettingsLoader,
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
        loader: requireAuth,
        element: <ProductionLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/production/orders" replace />,
          },
          {
            path: "orders",
            element: <WorkOrders />, loader: workOrdersLoader,
          },
          {
            path: "orders/:id",
            element: <WorkOrderDetail />,
          },
          {
            path: "planning",
            element: <ProductionPlanning />, loader: productionPlanningLoader,
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
// MSW가 준비되기 전에 router가 생성될 수 있으므로,
// router를 함수로 만들어서 필요할 때 만들도록 한다
const createRouter = () => createBrowserRouter(routes);

// 기본 export는 함수로 변경 (하위 호환성을 위해 router도 export)
const router = createRouter();
export default router;
export { createRouter };
