import { create } from "zustand";

import type { UserResponse } from "@/shared/api/models";

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
  login: (user) => {
    set({ isLoggedIn: true, user });
  },
  logout: () => {
    set({ isLoggedIn: false, user: null });
  },
  initialize: (user) => {
    set({ isLoggedIn: true, user });
  },
}));
