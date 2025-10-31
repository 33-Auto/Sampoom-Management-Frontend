import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shared/ui";

import type { ItemMaster } from "../../api/items.api";
import {
  useDeleteMaterialMutation,
  useDeletePartMutation,
} from "../../create/api/create.api";

interface ItemViewProps {
  item: ItemMaster;
  onClosed: () => void;
}

const ItemView: React.FC<ItemViewProps> = ({ item, onClosed }) => {
  const queryClient = useQueryClient();
  const deleteMaterialMutation = useDeleteMaterialMutation();
  const deletePartMutation = useDeletePartMutation();

  const isDeleting =
    deleteMaterialMutation.isPending || deletePartMutation.isPending;

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    try {
      if (item.itemType === "원자재") {
        await deleteMaterialMutation.mutateAsync(item.id);
      } else {
        await deletePartMutation.mutateAsync(item.id);
      }
      await queryClient.invalidateQueries({ queryKey: ["master", "items"] });
      alert("삭제가 완료되었습니다.");
      onClosed();
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            품목 코드
          </div>
          <div className="font-medium dark:text-gray-100">{item.itemCode}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">품목명</div>
          <div className="font-medium dark:text-gray-100">{item.itemName}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">유형</div>
          <div className="font-medium dark:text-gray-100">{item.itemType}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            카테고리
          </div>
          <div className="font-medium dark:text-gray-100">{item.category}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">단위</div>
          <div className="font-medium dark:text-gray-100">{item.unit}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            기준 수량
          </div>
          <div className="font-medium dark:text-gray-100">
            {item.baseQuantity ?? "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            리드 타임
          </div>
          <div className="font-medium dark:text-gray-100">
            {item.purchaseLeadTime ??
              item.productionLeadTime ??
              item.calculatedProductionLeadTime ??
              "-"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClosed} disabled={isDeleting}>
          닫기
        </Button>
        <Button
          variant="secondary"
          style={{ color: "var(--color-error-red)" }}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </Button>
      </div>
    </div>
  );
};

export default ItemView;
