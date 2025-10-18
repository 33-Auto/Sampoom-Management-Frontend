import { expectType } from "ts-expect";
import { test } from "vitest";

test("URLType type validation", () => {
  type URLType = `http${string}`;

  expectType<URLType>("http://example.com");
  expectType<URLType>("https://example.com/news");
  // @ts-expect-error give non URL
  expectType<URLType>("example.com/news");
});
