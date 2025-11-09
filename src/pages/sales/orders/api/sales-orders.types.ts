export interface ApiSalesOrderPart {
  partId: number;
  name: string;
  code: string;
  quantity: number;
  standardCost: number | null;
}

export interface ApiSalesOrderGroup {
  groupId: number;
  groupName: string;
  parts: ApiSalesOrderPart[];
}

export interface ApiSalesOrderCategory {
  categoryId: number;
  categoryName: string;
  groups: ApiSalesOrderGroup[];
}

export type ApiSalesOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELAYED"
  | "PRODUCING"
  | "COMPLETED"
  | "CANCELED";

export interface ApiSalesOrderItem {
  orderId: number;
  orderNumber: string;
  agencyName: string;
  status: ApiSalesOrderStatus;
  createdAt: string; // ISO
  items: ApiSalesOrderCategory[];
}

export interface ApiPagedResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
  };
}

export interface SalesOrdersQueryParams {
  warehouseId: number;
  page?: number;
  size?: number;
  from?: string; // agencyName filter
  status?: ApiSalesOrderStatus;
}

export interface SalesOrderRow {
  orderId: number;
  orderNumber: string;
  createdDate: string; // YYYY-MM-DD
  agencyName: string;
  productName: string; // first part name + 외 N개
  totalQuantity: number; // sum of parts quantities
  totalAmount: number; // sum of quantity * standardCost
  status: ApiSalesOrderStatus;
}

export interface SalesOrdersListResult {
  orders: SalesOrderRow[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  rawContent?: ApiSalesOrderItem[];
}
