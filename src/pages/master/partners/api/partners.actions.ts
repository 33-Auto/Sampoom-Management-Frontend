import { api } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type PartnerCreateRequestDTO = Schemas["VendorRequestDTO"];
export type PartnerUpdateRequestDTO = Schemas["VendorUpdateRequestDTO"];

// Create mutation
export const useCreatePartnerMutation = () =>
  api.useMutation("post", "/api/site/vendors");

export const useUpdatePartnerMutation = () =>
  api.useMutation("put", "/api/site/vendors/{id}");

export const useDeletePartnerMutation = () =>
  api.useMutation("delete", "/api/site/vendors/{id}");
