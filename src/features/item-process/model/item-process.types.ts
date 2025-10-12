import type { Schemas } from "@/shared/model";// part 등록 DTO
export type PartCreateRequestDTO = Schemas["PartCreateRequestDTO"];

// material 등록 DTO
export type MaterialCreateRequestDTO = Schemas["MaterialRequestDTO"];

// materialId로 상세 조회 DTO
export type MaterialDetailResponseDTO = Schemas["MaterialResponseDTO"];

// partId로 상세 조회 DTO
export type PartDetailResponseDTO = Schemas["PartResponseDTO"];

// partId로 part 수정
export type PartUpdateRequestDTO = Schemas["PartUpdateRequestDTO1"];

// materialId로 material 수정
export type MaterialUpdateRequestDTO = Schemas["MaterialRequestDTO"];

export type ItemProcessType = "PART" | "MATERIAL";

export type ItemProcessFormProps = {
  itemId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// // 검색을 위한 api DTO
// export type ItemSearchRequestDTO =
//   Operations["searchItems"]["parameters"]["query"];

// export type { ItemProcessFormData };
