import { render, screen } from "@testing-library/react";
import React from "react";
import { expect, it, vi } from "vitest";

vi.mock("@/app/providers/router", async () => {
  const { createMemoryRouter, useNavigate } = await import("react-router-dom");
  const Login = () => {
    const navigate = useNavigate();
    return (
      <button
        onClick={() => {
          void navigate("/");
        }}
      >
        로그인 화면에서 홈으로
      </button>
    );
  };
  return {
    default: createMemoryRouter(
      [
        { path: "/login", element: <Login /> },
        { path: "/", element: <h1>업무 홈</h1> },
      ],
      { initialEntries: ["/login"] },
    ),
  };
});

import App from "../App";

it("provides the same router context to route components and their navigation hooks", () => {
  render(<App />);
  expect(
    screen.getByRole("button", { name: "로그인 화면에서 홈으로" }),
  ).toBeVisible();
});
