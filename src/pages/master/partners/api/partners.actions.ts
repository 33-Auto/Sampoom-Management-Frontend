import { queryClient } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type PartnerCreateRequestDTO = Schemas["VendorRequestDTO"];
export type PartnerUpdateRequestDTO = Schemas["VendorUpdateRequestDTO"];

// Create mutation
export const useCreatePartnerMutation = () =>
  queryClient.useMutation("post", "/api/site/vendors");

// Update mutation (PUT 사용)
export const useUpdatePartnerMutation = () =>
  queryClient.useMutation("put", "/api/site/vendors/{id}");

// Delete mutation
export const useDeletePartnerMutation = () =>
  queryClient.useMutation("delete", "/api/site/vendors/{id}");
