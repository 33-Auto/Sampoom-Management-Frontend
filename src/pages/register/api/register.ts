import type { SignupRequest } from "@/shared/api";
import { POST } from "@/shared/api";

export const register = async (userInfo: SignupRequest) => {
  const { data, error } = await POST("/api/user/signup", {
    body: userInfo,
  });

  if (error) {
    console.error("Registration failed:", error);
    throw new Error(
      error.message || "An unknown error occurred during registration.",
    );
  }

  return data;
};
