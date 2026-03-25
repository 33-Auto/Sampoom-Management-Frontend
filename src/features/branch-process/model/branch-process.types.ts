import type { BranchResponseDTO } from "@/entities/branch";

export type BranchProcessFormProps = {
  branchId?: number;
  branchData?: BranchResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
