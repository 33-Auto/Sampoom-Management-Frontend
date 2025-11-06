export { usePartnersQuery, partnersListQueryOptions } from "./partners.api";
export {
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} from "./partners.actions";
export type {
  PartnerCreateRequestDTO,
  PartnerUpdateRequestDTO,
} from "./partners.actions";
export { partnersLoader } from "./partners.loaders";
