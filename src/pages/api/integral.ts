import {
  callNewton,
  normalizeVariable,
  restoreVariable,
} from "@/lib/newton";
import { evaluate, format, subtract } from "mathjs";
import type { NextApiRequest, NextApiResponse } from "next";

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
        ? evaluateDefiniteIntegral(
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

function evaluateDefiniteIntegral(
  antiderivative: string,
  lowerBound: string,
  upperBound: string,
) {
  const expression = antiderivative.replace(/\s*\+\s*C\s*$/, "");
  const upperValue = evaluate(expression, { x: evaluate(upperBound) });
  const lowerValue = evaluate(expression, { x: evaluate(lowerBound) });

  return format(subtract(upperValue, lowerValue), { precision: 14 });
}
