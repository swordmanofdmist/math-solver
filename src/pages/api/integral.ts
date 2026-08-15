import {
  callNewton,
  normalizeVariable,
  restoreVariable,
} from "@/lib/newton";
import { spawn } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

type IntegralResponse = {
  result?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntegralResponse>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed." });
    return;
  }

  const { expression, variable, integralType, lowerBound, upperBound } =
    req.body as {
      expression?: string;
      variable?: string;
      integralType?: "indefinite" | "definite";
      lowerBound?: string;
      upperBound?: string;
    };

  if (!expression || !variable || !integralType) {
    res.status(400).json({
      error: "Expression, variable, and integral type are required.",
    });
    return;
  }

  if (
    integralType === "definite" &&
    (!lowerBound?.trim() || !upperBound?.trim())
  ) {
    res.status(400).json({ error: "Both bounds are required." });
    return;
  }

  try {
    const normalizedExpression = normalizeVariable(expression, variable);
    const antiderivative = await callNewton("integrate", normalizedExpression);
    const result =
      integralType === "definite"
        ? await evaluateAntiderivative(
            antiderivative,
            lowerBound || "",
            upperBound || "",
          )
        : antiderivative;

    res.status(200).json({
      result: restoreVariable(result, variable),
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Could not solve the integral.",
    });
  }
}

function evaluateAntiderivative(
  expression: string,
  lowerBound: string,
  upperBound: string,
) {
  return new Promise<string>((resolve, reject) => {
    const scriptPath = path.join(
      process.cwd(),
      "src",
      "scripts",
      "evaluate_antiderivative.py",
    );
    const pythonPath = path.join(process.cwd(), ".python-libs");
    const python = spawn("python", [scriptPath], {
      env: {
        ...process.env,
        PYTHONPATH: pythonPath,
      },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    python.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    python.stdin.write(
      JSON.stringify({
        expression,
        variable: "x",
        lowerBound,
        upperBound,
      }),
    );
    python.stdin.end();

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || "Could not evaluate the bounds."));
        return;
      }

      try {
        const data = JSON.parse(stdout) as { result?: string };
        if (!data.result) {
          reject(new Error("Could not evaluate the bounds."));
          return;
        }

        resolve(data.result);
      } catch {
        reject(new Error("Could not parse the bound evaluation."));
      }
    });
  });
}
