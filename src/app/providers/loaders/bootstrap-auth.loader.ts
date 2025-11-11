import { redirect, type LoaderFunctionArgs } from "react-router-dom";

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

export const bootstrapAuthLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isAuthPage = url.pathname === "/login" || url.pathname === "/signup";

  if (isAuthPage) {
    return null;
  }

  await ensureAuthBootstrapped();
  return null;
};
