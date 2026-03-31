/* eslint-disable import-x/order */
import { useEffect } from "react";
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
// (Removed static imports to enable true lazy loading)

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
// Page & Loader Imports - All pages loaded synchronously for performance baseline
// ============================================================================

// Master
import { ItemMaster, ItemProcess } from "@/pages/master/items";
import { BomMasterPage, bomsLoader, BomProcess } from "@/pages/master/bom";
import {
  PartnerMaster,
  partnersLoader,
  PartnerProcess,
} from "@/pages/master/partners";
import {
  BranchMaster,
  branchesLoader,
  BranchProcess,
} from "@/pages/master/branches";
import { DepartmentMaster } from "@/pages/master/departments";
import { PositionMaster } from "@/pages/master/positions";
import {
  WorkCenterMaster,
  workCentersLoader,
  WorkCenterProcess,
} from "@/pages/master/workcenters";
import {
  RoutingMaster,
  routingsLoader,
  RoutingProcess,
} from "@/pages/master/routings";

// Sales
import {
  SalesOrders,
  salesOrdersLoader,
  SalesOrderDetail,
} from "@/pages/sales/orders";

// WMS
import {
  ShippingTodos,
  shippingLoader,
  ShippingProcess,
} from "@/pages/wms/shipping";
import { InventoryDashboard, inventoryLoader } from "@/pages/wms/inventory";
import {
  WmsPurchaseOrders,
  wmsPurchaseOrdersLoader,
  StockingPage,
  stockingProcessLoader,
} from "@/pages/wms/purchase-orders";
import {
  RopSettings,
  ropSettingsLoader,
  RopProcess,
} from "@/pages/wms/rop-settings";

// Production
import {
  WorkOrders,
  workOrdersLoader,
  WorkOrderDetail,
} from "@/pages/production/orders";
import {
  ProductionPlanning,
  productionPlanningLoader,
} from "@/pages/production/planning";
import { MasterProductionSchedule } from "@/pages/production/mps";

// Purchasing
import {
  PurchaseRequests,
  purchasingRequestsLoader,
} from "@/pages/purchasing/requests";

// HRM
import {
  HRMEmployees,
  hrmEmployeesLoader,
  EmployeeProfileProcess,
  EmployeeStatusProcess,
} from "@/pages/hrm/employees";
import { HRMPayroll } from "@/pages/hrm/payroll";
import { HRMAttendance } from "@/pages/hrm/attendance";
import { HRMEvaluation } from "@/pages/hrm/evaluation";

// Auth
import { Register } from "@/pages/register";

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
            element: <ItemProcess />,
          },
          {
            path: "items/new",
            element: <ItemProcess />,
          },
          {
            path: "bom",
            element: <BomMasterPage />,
            loader: bomsLoader,
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
            element: <PartnerMaster />,
            loader: partnersLoader,
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
            element: <BranchMaster />,
            loader: branchesLoader,
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
            element: <WorkCenterMaster />,
            loader: workCentersLoader,
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
            element: <RoutingMaster />,
            loader: routingsLoader,
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
            element: <SalesOrders />,
            loader: salesOrdersLoader,
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
            element: <ShippingTodos />,
            loader: shippingLoader,
          },
          {
            path: "shipping/process/:warehouseId/:orderId",
            element: <ShippingProcess />,
          },
          {
            path: "inventory",
            element: <InventoryDashboard />,
            loader: inventoryLoader,
          },
          {
            path: "orders",
            element: <WmsPurchaseOrders />,
            loader: wmsPurchaseOrdersLoader,
          },
          {
            path: "orders/stocking/:purchaseOrderId",
            element: <StockingPage />,
            loader: async ({ params }) => {
              const purchaseOrderId = Number(params.purchaseOrderId);
              if (Number.isNaN(purchaseOrderId)) {
                throw new Response("Invalid purchaseOrderId", {
                  status: 400,
                });
              }
              return stockingProcessLoader(purchaseOrderId);
            },
          },
          {
            path: "rop-settings",
            element: <RopSettings />,
            loader: ropSettingsLoader,
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
            element: <WorkOrders />,
            loader: workOrdersLoader,
          },
          {
            path: "orders/:id",
            element: <WorkOrderDetail />,
          },
          {
            path: "planning",
            element: <ProductionPlanning />,
            loader: productionPlanningLoader,
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
            loader: purchasingRequestsLoader,
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
            loader: hrmEmployeesLoader,
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
