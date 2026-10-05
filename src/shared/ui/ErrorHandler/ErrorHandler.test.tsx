import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ErrorHandler } from "./ErrorHandler.ui";

describe("ErrorHandler recovery", () => {
  it("renders the original error outside the router and allows retry", async () => {
    const reset = vi.fn();
    render(
      <ErrorHandler
        error={new Error("Original failure")}
        resetErrorBoundary={reset}
      />,
    );
    expect(screen.getByText("Original failure")).toBeVisible();
    expect(screen.getByRole("link", { name: "홈으로" })).toHaveAttribute(
      "href",
      "/",
    );
    await userEvent.click(screen.getByRole("button", { name: "다시시도" }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("does not crash on a 404 outside the router", () => {
    render(
      <ErrorHandler
        error={{ status: 404, message: "Missing resource" }}
        resetErrorBoundary={vi.fn()}
      />,
    );
    expect(screen.getByText("Missing resource")).toBeVisible();
    expect(screen.getByRole("link", { name: "홈으로" })).toBeVisible();
  });

  it("still redirects route-level 404s", async () => {
    render(
      <MemoryRouter initialEntries={["/missing"]}>
        <Routes>
          <Route
            path="/missing"
            element={
              <ErrorHandler
                error={{ status: 404 }}
                resetErrorBoundary={vi.fn()}
              />
            }
          />
          <Route path="/404" element={<h1>Not found page</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Not found page" }),
    ).toBeVisible();
  });

  it("can navigate home from a route error", async () => {
    render(
      <MemoryRouter initialEntries={["/broken"]}>
        <Routes>
          <Route
            path="/broken"
            element={
              <ErrorHandler
                error={new Error("Route failed")}
                resetErrorBoundary={vi.fn()}
              />
            }
          />
          <Route path="/" element={<h1>Home page</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: "홈으로" }));
    expect(
      await screen.findByRole("heading", { name: "Home page" }),
    ).toBeVisible();
  });

  it("survives a child failure that unmounts the router", () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    const Broken = (): React.ReactElement => {
      throw new Error("Router child failed");
    };
    try {
      render(
        <ErrorBoundary FallbackComponent={ErrorHandler}>
          <MemoryRouter>
            <Broken />
          </MemoryRouter>
        </ErrorBoundary>,
      );
      expect(screen.getByText("Router child failed")).toBeVisible();
      expect(screen.getByRole("link", { name: "홈으로" })).toHaveAttribute(
        "href",
        "/",
      );
    } finally {
      logged.mockRestore();
    }
  });
});
