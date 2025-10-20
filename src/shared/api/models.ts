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
