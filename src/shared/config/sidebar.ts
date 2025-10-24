import type { SidebarItem } from "@/widgets/Layout";

export const factorySidebarItems: SidebarItem[] = [
  {
    path: "/factory/dashboard",
    label: "대시보드",
    icon: "ri-dashboard-line",
  },
  { path: "/factory/orders", label: "주문 관리", icon: "ri-file-list-line" },
  { path: "/factory/materials", label: "원자재 재고", icon: "ri-stack-line" },
  { path: "/factory/bom", label: "BOM 관리", icon: "ri-settings-3-line" },
  { path: "/factory/employees", label: "직원 관리", icon: "ri-team-line" },
];

export const warehouseSidebarItems: SidebarItem[] = [
  {
    path: "/warehouse/dashboard",
    label: "대시보드",
    icon: "ri-dashboard-line",
  },
  {
    path: "/warehouse/orders",
    label: "주문 관리",
    icon: "ri-file-list-line",
  },
  {
    path: "/warehouse/inventory",
    label: "부품 재고",
    icon: "ri-archive-line",
  },
  { path: "/warehouse/employees", label: "직원 관리", icon: "ri-team-line" },
];
