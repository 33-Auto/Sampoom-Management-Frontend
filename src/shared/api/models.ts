import type { components } from "./v1";

// Schemas
type Schemas = components["schemas"];

// Auth
export type LoginRequest = Schemas["LoginRequest"];
export type LoginResponse = Schemas["LoginResponse"];
export type SignupRequest = Schemas["SignupRequest"];
export type SignupResponse = Schemas["SignupResponse"];

// User
export type UserResponse = Schemas["UserResponse"];

// Mock
export type ApiResponseSignupResponse = Schemas["ApiResponseSignupResponse"];
export type ApiResponseLoginResponse = Schemas["ApiResponseLoginResponse"];

// Factory
export type FactoryOrders =
  Schemas["ApiResponsePageResponseDtoPartOrderResponseDto"];

// Warehouse
export type OrderResDto = Schemas["OrderResDto"];
