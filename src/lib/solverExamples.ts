export type DerivativeExample = {
  expression: string;
  variable: string;
  order: string;
};

export type IntegralExample = {
  expression: string;
  variable: string;
  integralType: "indefinite" | "definite";
  lowerBound: string;
  upperBound: string;
};

export type SeriesExample = {
  expression: string;
  variable: string;
  startValue: string;
};

const sequence = (length: number) =>
  Array.from({ length }, (_, index) => index + 1);

export const derivativeExamples: DerivativeExample[] = [
  ...sequence(40).map((value) => ({
    expression: `${value}*x^${(value % 5) + 2} + ${value + 1}*x - ${(value % 7) + 1}`,
    variable: "x",
    order: "1",
  })),
  ...sequence(25).map((value) => ({
    expression: `${value + 1}*y^${(value % 4) + 3} - ${value}*y^2 + ${value + 2}`,
    variable: "y",
    order: "2",
  })),
  ...sequence(15).map((value) => ({
    expression: `${value + 2}*t^${(value % 3) + 4} + ${value}*t^3 - ${value + 1}*t`,
    variable: "t",
    order: "3",
  })),
  ...sequence(10).map((value) => ({
    expression: `${value}*sin(x) + ${value + 1}*cos(x)`,
    variable: "x",
    order: "1",
  })),
  ...sequence(10).map((value) => ({
    expression: `${value}*e^x + x^${(value % 4) + 2}`,
    variable: "x",
    order: "1",
  })),
];

const indefiniteIntegral = (
  expression: string,
  variable = "x",
): IntegralExample => ({
  expression,
  variable,
  integralType: "indefinite",
  lowerBound: "",
  upperBound: "",
});

const definiteIntegral = (
  expression: string,
  lowerBound: string,
  upperBound: string,
): IntegralExample => ({
  expression,
  variable: "x",
  integralType: "definite",
  lowerBound,
  upperBound,
});

export const integralExamples: IntegralExample[] = [
  ...sequence(35).map((value) =>
    indefiniteIntegral(
      `${value}*x^${(value % 6) + 1} + ${value + 2}*x - ${(value % 5) + 1}`,
    ),
  ),
  ...sequence(25).map((value) =>
    definiteIntegral(
      `${value + 1}*x^${(value % 5) + 1} + ${value}*x`,
      String(value % 3),
      String((value % 5) + 4),
    ),
  ),
  ...sequence(15).map((value) =>
    indefiniteIntegral(
      `${value + 2}*y^${(value % 5) + 2} - ${value}*y + ${value + 1}`,
      "y",
    ),
  ),
  ...sequence(15).map((value) =>
    indefiniteIntegral(`${value}*sin(x) + ${value + 1}*cos(x)`),
  ),
  ...sequence(10).map((value) =>
    definiteIntegral(`${value}*sin(x)`, "0", "pi"),
  ),
];

export const seriesExamples: SeriesExample[] = [
  { expression: "1 / n^2", variable: "n", startValue: "1" },
  { expression: "1 / n", variable: "n", startValue: "1" },
  { expression: "1 / 2^n", variable: "n", startValue: "1" },
  { expression: "n / (n^3 + 1)", variable: "n", startValue: "1" },
  { expression: "(-1)^n / n", variable: "n", startValue: "1" },
  { expression: "1 / n^3", variable: "n", startValue: "1" },
  { expression: "1 / sqrt(n)", variable: "n", startValue: "1" },
  { expression: "1 / (n * log(n))", variable: "n", startValue: "2" },
  { expression: "1 / (n * log(n)^2)", variable: "n", startValue: "2" },
  { expression: "n / 2^n", variable: "n", startValue: "1" },
  { expression: "n^2 / 3^n", variable: "n", startValue: "1" },
  { expression: "(1 / 2)^n", variable: "n", startValue: "1" },
  { expression: "(-1)^n / sqrt(n)", variable: "n", startValue: "1" },
  { expression: "1 / (n * (n + 1))", variable: "n", startValue: "1" },
  { expression: "1 / (2*n + 1)", variable: "n", startValue: "1" },
  { expression: "1 / (n^2 + 1)", variable: "n", startValue: "1" },
  { expression: "sin(n) / n^2", variable: "n", startValue: "1" },
  { expression: "cos(n) / n", variable: "n", startValue: "1" },
  { expression: "factorial(n) / n^n", variable: "n", startValue: "1" },
  { expression: "1 / factorial(n)", variable: "n", startValue: "1" },
  { expression: "n^3 / 2^n", variable: "n", startValue: "1" },
  { expression: "(3 / 4)^n", variable: "n", startValue: "1" },
  { expression: "1 / n^(3 / 2)", variable: "n", startValue: "1" },
  { expression: "log(n) / n^2", variable: "n", startValue: "2" },
  { expression: "1 / (n + 5)", variable: "n", startValue: "1" },
];

export function pickRandomExample<T extends { expression: string }>(
  examples: readonly T[],
  currentExpression: string,
) {
  const availableExamples = examples.filter(
    (example) => example.expression !== currentExpression,
  );
  const choices = availableExamples.length > 0 ? availableExamples : examples;

  return choices[Math.floor(Math.random() * choices.length)];
}
