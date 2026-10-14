import { create } from "zustand";

import type { UserResponse } from "@/shared/model";

interface AuthState {
  isLoggedIn: boolean;
  user: UserResponse | null;
  login: (user: UserResponse) => void;
  logout: () => void;
  initialize: (user: UserResponse) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user): void => {
    set({ isLoggedIn: true, user });
  },
  logout: (): void => {
    set({ isLoggedIn: false, user: null });
  },
  initialize: (user): void => {
    set({ isLoggedIn: true, user });
  },
}));
