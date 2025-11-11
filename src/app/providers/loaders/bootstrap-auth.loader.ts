import { redirect } from "react-router-dom";

import { useAuthStore } from "@/entities/user";
import { getMyProfile } from "@/entities/user/api/auth.api";

let hasBootstrappedAuth = false;
let bootstrapAuthPromise: Promise<void> | null = null;

const buildBootstrapAuthPromise = async () => {
  const { initialize, logout } = useAuthStore.getState();

  try {
    const profile = await getMyProfile();
    initialize(profile);
    hasBootstrappedAuth = true;
  } catch {
    logout();
    hasBootstrappedAuth = false;
    throw redirect("/login");
  }
};

export const ensureAuthBootstrapped = async () => {
  if (hasBootstrappedAuth) {
    return;
  }

  if (!bootstrapAuthPromise) {
    bootstrapAuthPromise = buildBootstrapAuthPromise();
  }

  const currentPromise = bootstrapAuthPromise;

  try {
    await currentPromise;
  } finally {
    if (bootstrapAuthPromise === currentPromise) {
      bootstrapAuthPromise = null;
    }
  }
};

export const bootstrapAuthLoader = async () => {
  await ensureAuthBootstrapped();
  return null;
};
