import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import derivativeHandler from "../src/pages/api/derivative";
import integralHandler from "../src/pages/api/integral";
import { callNewton } from "../src/lib/newton";

vi.mock("@/lib/newton", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/lib/newton")>();
  return { ...actual, callNewton: vi.fn() };
});

type MockResponse = {
  statusCode: number;
  body: unknown;
  status(code: number): MockResponse;
  json(body: unknown): MockResponse;
};

function createContext(method: string, body: unknown) {
  const req = { method, body } as NextApiRequest;
  const res: MockResponse = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(responseBody) {
      this.body = responseBody;
      return this;
    },
  };

  return { req, res: res as MockResponse & NextApiResponse };
}

const mockedCallNewton = vi.mocked(callNewton);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("derivative API handler", () => {
  it("rejects methods other than POST", async () => {
    const context = createContext("GET", {});

    await derivativeHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(405);
    expect(context.res.body).toEqual({ error: "Only POST requests are allowed." });
  });

  it("validates required inputs and a positive integer order", async () => {
    const missing = createContext("POST", { expression: "x^2", variable: "x" });
    await derivativeHandler(missing.req, missing.res);
    expect(missing.res.statusCode).toBe(400);

    const invalidOrder = createContext("POST", {
      expression: "x^2",
      variable: "x",
      order: 1.5,
    });
    await derivativeHandler(invalidOrder.req, invalidOrder.res);
    expect(invalidOrder.res.statusCode).toBe(400);
    expect(invalidOrder.res.body).toEqual({
      error: "Order must be a whole number greater than 0.",
    });
  });

  it("normalizes the variable, derives repeatedly, then restores the variable", async () => {
    mockedCallNewton.mockResolvedValueOnce("2*x").mockResolvedValueOnce("2");
    const context = createContext("POST", {
      expression: "y^2",
      variable: "y",
      order: 2,
    });

    await derivativeHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(200);
    expect(context.res.body).toEqual({ result: "2" });
    expect(mockedCallNewton.mock.calls).toEqual([
      ["derive", "x^2"],
      ["derive", "2*x"],
    ]);
  });

  it("returns upstream errors as a server error", async () => {
    mockedCallNewton.mockRejectedValue(new Error("Newton unavailable"));
    const context = createContext("POST", {
      expression: "x^2",
      variable: "x",
      order: 1,
    });

    await derivativeHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(500);
    expect(context.res.body).toEqual({ error: "Newton unavailable" });
  });
});

describe("integral API handler", () => {
  it("rejects methods other than POST and requires both definite bounds", async () => {
    const wrongMethod = createContext("GET", {});
    await integralHandler(wrongMethod.req, wrongMethod.res);
    expect(wrongMethod.res.statusCode).toBe(405);

    const missingBound = createContext("POST", {
      expression: "x",
      variable: "x",
      integralType: "definite",
      lowerBound: "0",
    });
    await integralHandler(missingBound.req, missingBound.res);
    expect(missingBound.res.statusCode).toBe(400);
    expect(missingBound.res.body).toEqual({ error: "Both bounds are required." });
  });

  it("evaluates a definite integral from the returned antiderivative", async () => {
    mockedCallNewton.mockResolvedValue("x^2 + C");
    const context = createContext("POST", {
      expression: "2*x",
      variable: "x",
      integralType: "definite",
      lowerBound: "0",
      upperBound: "3",
    });

    await integralHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(200);
    expect(context.res.body).toEqual({ result: "9" });
    expect(mockedCallNewton).toHaveBeenCalledWith("integrate", "2*x");
  });

  it("restores a non-default variable for indefinite integrals", async () => {
    mockedCallNewton.mockResolvedValue("x^2 / 2 + C");
    const context = createContext("POST", {
      expression: "y",
      variable: "y",
      integralType: "indefinite",
    });

    await integralHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(200);
    expect(context.res.body).toEqual({ result: "y^2 / 2 + C" });
    expect(mockedCallNewton).toHaveBeenCalledWith("integrate", "x");
  });

  it("returns upstream errors as a server error", async () => {
    mockedCallNewton.mockRejectedValue(new Error("Newton unavailable"));
    const context = createContext("POST", {
      expression: "x",
      variable: "x",
      integralType: "indefinite",
    });

    await integralHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(500);
    expect(context.res.body).toEqual({ error: "Newton unavailable" });
  });
});
