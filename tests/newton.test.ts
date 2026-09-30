import { afterEach, describe, expect, it, vi } from "vitest";
import {
  callNewton,
  normalizeVariable,
  restoreVariable,
} from "../src/lib/newton";

describe("variable normalization", () => {
  it("leaves expressions using x unchanged", () => {
    expect(normalizeVariable("x^2 + sin(x)", "x")).toBe("x^2 + sin(x)");
    expect(restoreVariable("2*x", "x")).toBe("2*x");
  });

  it("replaces complete variable names without changing longer identifiers", () => {
    expect(normalizeVariable("alpha^2 + alphabet + sin(alpha)", "alpha")).toBe(
      "x^2 + alphabet + sin(x)",
    );
  });

  it("escapes regular-expression characters in variable names", () => {
    expect(normalizeVariable("a.b + axb", "a.b")).toBe("x + axb");
  });

  it("restores the requested variable in a result", () => {
    expect(restoreVariable("3*x^2 + cos(x)", "theta")).toBe(
      "3*theta^2 + cos(theta)",
    );
  });
});

describe("callNewton", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("encodes the expression and returns the API result", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: "2*x" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(callNewton("derive", "x^2 / (x + 1)")).resolves.toBe("2*x");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://newton.vercel.app/api/v2/derive/x%5E2%20%2F%20(x%20%2B%201)",
    );
  });

  it("throws when the API responds with a non-success status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(callNewton("derive", "x")).rejects.toThrow(
      "Newton API returned status 503.",
    );
  });

  it("throws when the API response has no result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: "" }) }),
    );

    await expect(callNewton("derive", "x")).rejects.toThrow(
      "Newton API did not return a result.",
    );
  });
});
