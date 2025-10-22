import "@testing-library/jest-dom/vitest";

import { server } from "../providers/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
