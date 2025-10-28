import type { components } from "./v1";

// Schemas
type Schemas = components["schemas"];

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
export type ApiResponseLoginResponse = Schemas["ApiResponseLoginResponse"];

// Factory
export type FactoryOrders =
  Schemas["ApiResponsePageResponseDtoPartOrderResponseDto"];

// Warehouse
export type OrderResDto = Schemas["OrderResDto"];
export type PartResDto = Schemas["PartResDto"];
