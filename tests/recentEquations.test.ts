import { afterEach, describe, expect, it, vi } from "vitest";
import {
  readRecentEquations,
  rememberRecentEquation,
} from "../src/lib/recentEquations";

function installStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const storage: Storage = {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };

  vi.stubGlobal("window", { localStorage: storage });
  return { storage, values };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("readRecentEquations", () => {
  it("returns an empty list during server-side rendering", () => {
    expect(readRecentEquations("equations")).toEqual([]);
  });

  it("returns only string entries and keeps at most three", () => {
    installStorage({
      equations: JSON.stringify(["x + 1", 42, "y^2", null, "sin(z)", "extra"]),
    });

    expect(readRecentEquations("equations")).toEqual(["x + 1", "y^2", "sin(z)"]);
  });

  it("returns an empty list for malformed or non-array stored data", () => {
    installStorage({ equations: "{bad json" });
    expect(readRecentEquations("equations")).toEqual([]);

    installStorage({ equations: JSON.stringify({ equation: "x" }) });
    expect(readRecentEquations("equations")).toEqual([]);
  });

  it("handles storage read failures", () => {
    vi.stubGlobal("window", {
      localStorage: { getItem: () => { throw new Error("storage disabled"); } },
    });

    expect(readRecentEquations("equations")).toEqual([]);
  });
});

describe("rememberRecentEquation", () => {
  it("trims and prepends equations while removing duplicates and limiting to three", () => {
    const { values } = installStorage({
      equations: JSON.stringify(["y", "x", "z"]),
    });

    expect(rememberRecentEquation("equations", "  x  ")).toEqual(["x", "y", "z"]);
    expect(JSON.parse(values.get("equations") ?? "null")).toEqual(["x", "y", "z"]);
  });

  it("does not save blank input", () => {
    const { values } = installStorage({ equations: JSON.stringify(["x"]) });

    expect(rememberRecentEquation("equations", "  ")).toEqual(["x"]);
    expect(JSON.parse(values.get("equations") ?? "null")).toEqual(["x"]);
  });

  it("returns a trimmed equation without trying to save during server rendering", () => {
    expect(rememberRecentEquation("equations", "  x^2  ")).toEqual(["x^2"]);
  });
});
