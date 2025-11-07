import { queryClient } from "@/shared/api/base";

export const test = () => queryClient.useQuery("get", "/api/part/items/search");
