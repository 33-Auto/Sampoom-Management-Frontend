import { useLocation, useNavigate, useParams } from "react-router-dom";import { ItemProcessForm, type ItemProcessType } from "@/features/item-process";import { Button } from "@/shared/ui";type ItemProcessLocationState = {
  itemType?: ItemProcessType | "PART" | "MATERIAL";
  categoryId?: number;
  categoryName?: string;
  groupId?: number;
  groupName?: string;
  item?: {
    id: number;
    itemType?: string;
    categoryId?: number | null;
    category?: string;
    groupId?: number | null;
    groupName?: string | null;
  };
};

const toItemProcessType = (
  value?: string | null,
): ItemProcessType | undefined => {
  if (!value) return undefined;
  if (value === "MATERIAL" || value === "원자재") return "MATERIAL";
  if (value === "PART" || value === "부품") return "PART";
  return undefined;
};

export function ItemProcess() {
  const { id } = useParams();
  const itemId = id ? Number(id) : undefined;
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!itemId;

  const state = (location.state || {}) as ItemProcessLocationState;
  const stateItem = state.item;
  const derivedType =
    state.itemType ?? toItemProcessType(stateItem?.itemType) ?? undefined;

  const categoryId = state.categoryId ?? stateItem?.categoryId ?? undefined;
  const groupId = state.groupId ?? stateItem?.groupId ?? undefined;
  const categoryName = state.categoryName ?? stateItem?.category ?? undefined;
  const groupName = state.groupName ?? stateItem?.groupName ?? undefined;

  const handleSuccess = () => {
    navigate("/master/items");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <i className="ri-arrow-left-line mr-2"></i>
              품목 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "품목 수정" : "품목 신규 등록"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "품목 정보를 수정합니다."
              : "새로운 품목 정보를 입력하여 등록합니다."}
          </p>
        </div>

        <ItemProcessForm
          itemId={itemId}
          itemType={derivedType}
          categoryId={categoryId}
          categoryName={categoryName}
          groupId={groupId ?? undefined}
          groupName={groupName ?? undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
