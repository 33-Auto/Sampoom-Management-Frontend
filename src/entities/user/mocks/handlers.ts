import { http } from "msw";

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/shared/api/models";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { addUser, findUser, findUserIndex, userExists } from "./data";

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    const user = findUser(email, password);

    await sleep(1000);

    if (!user) {
      return apiFail(401, "Invalid credentials");
    }

    const responseData: LoginResponse = {
      userId: findUserIndex(email) + 1,
      userName: user.userName,
      email: user.email,
      workspace: user.workspace!,
      branch: user.branch!,
      position: user.position!,
    };

    return apiSuccess(responseData);
  }),

  http.post("/api/user/signup", async ({ request }) => {
    const newUser = (await request.json()) as SignupRequest;

    await sleep(1000);

    if (userExists(newUser.email)) {
      return apiFail(409, "User already exists");
    }

    addUser(newUser);

    const responseData: SignupResponse = {
      userId: findUserIndex(newUser.email) + 1, // Use the new index
      userName: newUser.userName,
      email: newUser.email,
    };

    return apiSuccess(responseData, 201, "User registered successfully");
  }),
];
