import { create } from "zustand";

import type { BranchModuleType } from "../ui/BranchSelect";

type BranchSelections = Record<BranchModuleType, string>;

interface BranchSelectionState {
  selections: BranchSelections;
  setSelection: (moduleType: BranchModuleType, branchId: string) => void;
  resetSelection: (moduleType: BranchModuleType) => void;
}

const INITIAL_SELECTIONS: BranchSelections = {
  agency: "",
  wms: "",
  factory: "",
};

export const useBranchSelectionStore = create<BranchSelectionState>()(
  (set) => ({
    selections: INITIAL_SELECTIONS,
    setSelection: (moduleType, branchId) =>
      set((state) => ({
        selections: { ...state.selections, [moduleType]: branchId },
      })),
    resetSelection: (moduleType) =>
      set((state) => ({
        selections: { ...state.selections, [moduleType]: "" },
      })),
  }),
);

export const createBranchSelector =
  (moduleType: BranchModuleType) =>
  (state: BranchSelectionState): string =>
    state.selections[moduleType];

export const branchSelectors = {
  agency: createBranchSelector("agency"),
  wms: createBranchSelector("wms"),
  factory: createBranchSelector("factory"),
} as const;

export const useBranchId = (moduleType: BranchModuleType) =>
  useBranchSelectionStore(createBranchSelector(moduleType));

export const useBranchIdOrThrow = (
  moduleType: BranchModuleType,
  errorMessage?: string,
) => {
  const branchId = useBranchId(moduleType);
  if (!branchId) {
    throw new Error(
      errorMessage ?? `${moduleType} branchId가 선택되지 않았습니다.`,
    );
  }
  return branchId;
};
