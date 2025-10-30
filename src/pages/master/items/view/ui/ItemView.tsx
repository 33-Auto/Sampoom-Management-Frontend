import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shared/ui";

import {
  useDeleteMaterialMutation,
  useDeletePartMutation,
} from "../../create/api/create.api";

interface ItemViewProps {
  item: any;
  onClosed: () => void;
}

const ItemView: React.FC<ItemViewProps> = ({ item, onClosed }) => {
  const queryClient = useQueryClient();
  const deleteMaterialMutation = useDeleteMaterialMutation();
  const deletePartMutation = useDeletePartMutation();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    if (item.itemType === "원자재") {
      await deleteMaterialMutation.mutateAsync(item.id);
    } else {
      await deletePartMutation.mutateAsync(item.id);
    }
    await queryClient.invalidateQueries({ queryKey: ["master", "items"] });
    alert("삭제가 완료되었습니다.");
    onClosed();
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
              item.leadTime ??
              "-"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClosed}>
          닫기
        </Button>
        <Button
          variant="secondary"
          style={{ color: "var(--color-error-red)" }}
          onClick={handleDelete}
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default ItemView;
