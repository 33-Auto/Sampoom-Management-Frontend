import { redirect } from "react-router-dom";

import { useAuthStore } from "@/entities/user";
import { getMyProfile } from "@/entities/user/api/auth.api";

let hasBootstrappedAuth = false;

export const bootstrapAuthLoader = async () => {
  if (hasBootstrappedAuth) {
    return null;
  }

  hasBootstrappedAuth = true;

  const { initialize, logout } = useAuthStore.getState();

  try {
    const profile = await getMyProfile();
    initialize(profile);
  } catch {
    logout();
    throw redirect("/login");
  }

  return null;
};
