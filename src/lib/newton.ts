const NEWTON_API = "https://newton.vercel.app/api/v2";

type NewtonResponse = {
  operation?: string;
  expression?: string;
  result?: string;
};

export async function callNewton(operation: string, expression: string) {
  const url = `${NEWTON_API}/${operation}/${encodeURIComponent(expression)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Newton API returned status ${response.status}.`);
  }

  const data = (await response.json()) as NewtonResponse;

  if (!data.result) {
    throw new Error("Newton API did not return a result.");
  }

  return data.result;
}

export function normalizeVariable(expression: string, variable: string) {
  if (variable === "x") {
    return expression;
  }

  return replaceVariable(expression, variable, "x");
}

export function restoreVariable(expression: string, variable: string) {
  if (variable === "x") {
    return expression;
  }

  return replaceVariable(expression, "x", variable);
}

function replaceVariable(expression: string, from: string, to: string) {
  const escapedVariable = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return expression.replace(new RegExp(`\\b${escapedVariable}\\b`, "g"), to);
}
