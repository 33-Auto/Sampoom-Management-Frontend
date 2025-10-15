import type { Operations, Schemas } from "@/shared/model";export type ShippingListParams =
  Operations["getOutboundList"]["parameters"]["query"];
export type ShippingListResponse = Schemas["ApiResponsePageOrderWithStockDto"];
export type ShippingOrderDto = Schemas["OrderWithStockDto"];
export type ShippingOrderItemDto = Schemas["PartStockDto"];
