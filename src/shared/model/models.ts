import type { components, operations } from "./v1";

// Schemas
export type Schemas = components["schemas"];

// Opertaions
export type Operations = operations;

// Auth
export type LoginRequest = Schemas["LoginRequest"];

// LoginResponse from OpenAPI doesn't have all fields we need
export interface LoginResponse {
  userId?: number;
  userName?: string;
  email?: string;
  role?: string;
  workspace?: string;
  branch?: string;
  position?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

// UserResponse for auth store
export interface UserResponse {
  userId?: number;
  userName?: string;
  email?: string;
  role?: string;
  workspace?: string;
  branch?: string;
  position?: string;
}

//! TODO: 가입 OPENAPI로 변경
export interface SignupRequest {
  email: string;
  password: string;
  userName: string;
  workspace: string;
  branch: string;
  position: string;
}

export interface SignupResponse {
  userId: number;
  userName: string;
  email: string;
}

// Mock
export interface ApiResponseLoginResponse {
  status?: number;
  success?: boolean;
  code?: number;
  message?: string;
  data?: LoginResponse;
}

// Factory
export interface PartOrderItemDto {
  partId?: number;
  partName?: string;
  partCode?: string;
  partGroup?: string;
  partCategory?: string;
  quantity?: number;
}

export interface PartOrderResponseDto {
  orderId?: number;
  warehouseName?: string;
  orderDate?: string;
  status?: string;
  factoryName?: string;
  factoryId?: number;
  items?: PartOrderItemDto[];
}

export interface PageResponseDtoPartOrderResponseDto {
  content?: PartOrderResponseDto[];
  totalElements?: number;
  totalPages?: number;
}

export interface FactoryOrders {
  status?: number;
  success?: boolean;
  code?: number;
  message?: string;
  data?: PageResponseDtoPartOrderResponseDto;
}

// Warehouse
export interface ItemDto {
  code?: string;
  quantity?: number;
}

export interface OrderResDto {
  id?: number;
  requester?: "FACTORY" | "WAREHOUSE" | "AGENCY";
  branch?: string;
  items?: ItemDto[];
  status?:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPING"
    | "DELAYED"
    | "PRODUCING"
    | "COMPLETED"
    | "CANCELED";
}

export interface PartResDto {
  id?: number;
  category?: string;
  group?: string;
  name?: string;
  code?: string;
  quantity?: number;
  rop?: number;
  unit?: string;
  partValue?: number;
  status?: string;
}

// Receiving Process
export interface ReceivingProcessResponse {
  processId?: number;
  warehouseId?: number;
  receivingQuantity?: number;
  receivingDate?: string;
  receivingTime?: string;
  expectedDate?: string;
  note?: string;
  createdAt?: string;
  orderNumber?: string;
  itemCode?: string;
  itemName?: string;
  orderedQuantity?: number;
  receivedQuantity?: number;
  remainingQuantity?: number;
  memo?: string;
}
