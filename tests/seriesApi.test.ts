import { EventEmitter } from "node:events";
import type { ChildProcess } from "node:child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { spawn } from "child_process";
import seriesHandler from "../src/pages/api/series";

vi.mock("child_process", async (importOriginal) => {
  const actual = await importOriginal<typeof import("child_process")>();
  return { ...actual, spawn: vi.fn() };
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

function createMockProcess() {
  const process = new EventEmitter();
  const stdout = new EventEmitter();
  const stderr = new EventEmitter();
  const stdin = { write: vi.fn(), end: vi.fn() };
  Object.assign(process, { stdout, stderr, stdin });

  return {
    process: process as unknown as ChildProcess,
    stdout,
    stderr,
    stdin,
  };
}

const mockedSpawn = vi.mocked(spawn);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("series API handler", () => {
  it("rejects methods other than POST", async () => {
    const context = createContext("GET", {});

    await seriesHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(405);
    expect(context.res.body).toEqual({ error: "Only POST requests are allowed." });
    expect(mockedSpawn).not.toHaveBeenCalled();
  });

  it("validates the expression, variable, and start value before spawning Python", async () => {
    const context = createContext("POST", {
      expression: "1/n^2",
      variable: "n",
    });

    await seriesHandler(context.req, context.res);

    expect(context.res.statusCode).toBe(400);
    expect(context.res.body).toEqual({
      error: "Expression, variable, and start value are required.",
    });
    expect(mockedSpawn).not.toHaveBeenCalled();
  });

  it("passes inputs to Python and returns its parsed convergence result", async () => {
    const child = createMockProcess();
    mockedSpawn.mockReturnValue(child.process);
    const payload = { expression: "1/n^2", variable: "n", startValue: "1" };
    const context = createContext("POST", payload);

    await seriesHandler(context.req, context.res);
    child.stdout.emit("data", Buffer.from('{"converges":true,"result":"Converges"}'));
    child.process.emit("close", 0);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "python",
      [expect.stringContaining("src\\scripts\\series_solver.py")],
      expect.objectContaining({
        env: expect.objectContaining({ PYTHONPATH: expect.stringContaining(".python-libs") }),
        stdio: ["pipe", "pipe", "pipe"],
      }),
    );
    expect(child.stdin.write).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(child.stdin.end).toHaveBeenCalledOnce();
    expect(context.res.statusCode).toBe(200);
    expect(context.res.body).toEqual({ converges: true, result: "Converges" });
  });

  it("returns Python errors and malformed output as server errors", async () => {
    const failedChild = createMockProcess();
    mockedSpawn.mockReturnValueOnce(failedChild.process);
    const failedContext = createContext("POST", {
      expression: "1/n",
      variable: "n",
      startValue: "1",
    });

    await seriesHandler(failedContext.req, failedContext.res);
    failedChild.stderr.emit("data", Buffer.from("invalid index variable"));
    failedChild.process.emit("close", 1);

    expect(failedContext.res.statusCode).toBe(500);
    expect(failedContext.res.body).toEqual({ error: "invalid index variable" });

    const malformedChild = createMockProcess();
    mockedSpawn.mockReturnValueOnce(malformedChild.process);
    const malformedContext = createContext("POST", {
      expression: "1/n",
      variable: "n",
      startValue: "1",
    });

    await seriesHandler(malformedContext.req, malformedContext.res);
    malformedChild.stdout.emit("data", Buffer.from("not json"));
    malformedChild.process.emit("close", 0);

    expect(malformedContext.res.statusCode).toBe(500);
    expect(malformedContext.res.body).toEqual({ error: "Could not parse the SymPy result." });
  });
});
