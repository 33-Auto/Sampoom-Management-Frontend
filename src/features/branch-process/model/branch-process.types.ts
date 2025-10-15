import type { BranchResponseDTO } from "@/pages/master/branches/model";export type BranchProcessFormProps = {
  branchId?: number;
  branchData?: BranchResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
