import {
  callNewton,
  normalizeVariable,
  restoreVariable,
} from "@/lib/newton";
import type { NextApiRequest, NextApiResponse } from "next";

type DerivativeResponse = {
  result?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DerivativeResponse>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed." });
    return;
  }

  const { expression, variable, order } = req.body as {
    expression?: string;
    variable?: string;
    order?: number;
  };

  if (!expression || !variable || !order) {
    res.status(400).json({ error: "Expression, variable, and order are required." });
    return;
  }

  if (!Number.isInteger(order) || order < 1) {
    res.status(400).json({ error: "Order must be a whole number greater than 0." });
    return;
  }

  try {
    let currentExpression = normalizeVariable(expression, variable);

    for (let step = 0; step < order; step += 1) {
      currentExpression = await callNewton("derive", currentExpression);
    }

    res.status(200).json({
      result: restoreVariable(currentExpression, variable),
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not solve the derivative.",
    });
  }
}
