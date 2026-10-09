import { describe, expect, it, vi } from "vitest";
import {
  derivativeExamples,
  integralExamples,
  pickRandomExample,
  seriesExamples,
} from "../src/lib/solverExamples";

describe("solver example catalogs", () => {
  it("contains 100 unique derivative examples", () => {
    expect(derivativeExamples).toHaveLength(100);
    expect(new Set(derivativeExamples.map((example) => example.expression)).size).toBe(
      100,
    );
  });

  it("contains 100 unique integral examples", () => {
    expect(integralExamples).toHaveLength(100);
    expect(new Set(integralExamples.map((example) => example.expression)).size).toBe(
      100,
    );
  });

  it("contains the maximum 25 unique series examples", () => {
    expect(seriesExamples).toHaveLength(25);
    expect(new Set(seriesExamples.map((example) => example.expression)).size).toBe(
      25,
    );
  });

  it("does not immediately select the currently displayed expression", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(pickRandomExample(derivativeExamples, derivativeExamples[0].expression)).toBe(
      derivativeExamples[1],
    );

    vi.restoreAllMocks();
  });
});
