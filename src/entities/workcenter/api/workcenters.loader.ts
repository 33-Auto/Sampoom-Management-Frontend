import { queryClient } from "@/shared/api";

import type { WorkCenterListParams } from "../model";

import { workCentersListQueryOptions } from "./workcenters.api";

export const workCentersLoader = async (params: WorkCenterListParams = {}) => {
  return queryClient.ensureQueryData(workCentersListQueryOptions(params));
};
