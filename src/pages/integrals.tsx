import MathInput from "@/components/MathInput";
import RecentEquationsNote from "@/components/RecentEquationsNote";
import SolverNavigation from "@/components/SolverNavigation";
import {
  readRecentEquations,
  rememberRecentEquation,
} from "@/lib/recentEquations";
import Head from "next/head";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type IntegralType = "indefinite" | "definite";

const INTEGRAL_RECENT_KEY = "math-solver:recent-integrals";

const integralExamples = [
  {
    expression: "x^2 + sin(x)",
    variable: "x",
    integralType: "indefinite" as const,
    lowerBound: "",
    upperBound: "",
  },
  {
    expression: "2x + 3",
    variable: "x",
    integralType: "definite" as const,
    lowerBound: "0",
    upperBound: "4",
  },
  {
    expression: "cos(x)",
    variable: "x",
    integralType: "indefinite" as const,
    lowerBound: "",
    upperBound: "",
  },
  {
    expression: "x^3",
    variable: "x",
    integralType: "definite" as const,
    lowerBound: "1",
    upperBound: "2",
  },
];

export default function IntegralsPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [integralType, setIntegralType] =
    useState<IntegralType>("indefinite");
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [recentEquations, setRecentEquations] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRecentEquations(readRecentEquations(INTEGRAL_RECENT_KEY));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleGenerateExample() {
    const example =
      integralExamples[Math.floor(Math.random() * integralExamples.length)];

    setExpression(example.expression);
    setVariable(example.variable);
    setIntegralType(example.integralType);
    setLowerBound(example.lowerBound);
    setUpperBound(example.upperBound);
    setError("");
    setResult("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setLoading(true);
    const trimmedExpression = expression.trim();
    const trimmedVariable = variable.trim();
    const trimmedLowerBound = lowerBound.trim();
    const trimmedUpperBound = upperBound.trim();

    if (!trimmedExpression) {
      setError("Enter a function before solving.");
      setLoading(false);
      return;
    }

    if (!trimmedVariable) {
      setError("Enter the variable to integrate by.");
      setLoading(false);
      return;
    }

    if (
      integralType === "definite" &&
      (!trimmedLowerBound || !trimmedUpperBound)
    ) {
      setError("Enter both bounds for a definite integral.");
      setLoading(false);
      return;
    }

    const bounds =
      integralType === "definite"
        ? ` from ${trimmedLowerBound} to ${trimmedUpperBound}`
        : "";

    setRecentEquations(
      rememberRecentEquation(
        INTEGRAL_RECENT_KEY,
        `${integralType} integral of ${trimmedExpression} d${trimmedVariable}${bounds}`,
      ),
    );

    try {
      const response = await fetch("/api/integral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: trimmedExpression,
          variable: trimmedVariable,
          integralType,
          lowerBound: trimmedLowerBound,
          upperBound: trimmedUpperBound,
        }),
      });
      const data = (await response.json()) as {
        result?: string;
        error?: string;
      };

      if (!response.ok || !data.result) {
        throw new Error(data.error || "Could not solve the integral.");
      }

      setResult(
        `${integralType} integral of ${trimmedExpression} with respect to ${trimmedVariable}${bounds} = ${data.result}`,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not solve the integral.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Integral Solver | Math Solver</title>
      </Head>

      <section className="page-header">
        <h1>Integral Solver</h1>
        <p>
          Enter a function and choose whether the problem is an indefinite or
          definite integral.
        </p>
      </section>

      <SolverNavigation
        previous={{ href: "/derivatives", label: "Derivatives" }}
        next={{ href: "/series", label: "Series" }}
      />

      <section className="solver-helper-row">
        <button type="button" className="example-button" onClick={handleGenerateExample}>
          Generate example
        </button>
        <RecentEquationsNote equations={recentEquations} />
      </section>

      <form className="solver-form" onSubmit={handleSubmit}>
        <MathInput
          id="integral-expression"
          label="Function"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="Example: x^2 + sin(x)"
          required
        />

        <MathInput
          id="integral-variable"
          label="Variable"
          value={variable}
          onChange={(event) => setVariable(event.target.value)}
          placeholder="x"
          required
        />

        <fieldset className="radio-group">
          <legend>Integral type</legend>
          <label>
            <input
              type="radio"
              name="integral-type"
              value="indefinite"
              checked={integralType === "indefinite"}
              onChange={() => setIntegralType("indefinite")}
            />
            Indefinite
          </label>
          <label>
            <input
              type="radio"
              name="integral-type"
              value="definite"
              checked={integralType === "definite"}
              onChange={() => setIntegralType("definite")}
            />
            Definite
          </label>
        </fieldset>

        {integralType === "definite" && (
          <div className="form-row">
            <MathInput
              id="lower-bound"
              label="Lower bound"
              value={lowerBound}
              onChange={(event) => setLowerBound(event.target.value)}
              placeholder="0"
              required
            />
            <MathInput
              id="upper-bound"
              label="Upper bound"
              value={upperBound}
              onChange={(event) => setUpperBound(event.target.value)}
              placeholder="1"
              required
            />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Solving..." : "Solve integral"}
        </button>
      </form>

      {result && (
        <section className="result-panel" aria-live="polite">
          <h2>Result</h2>
          <p>{result}</p>
        </section>
      )}
    </>
  );
}
