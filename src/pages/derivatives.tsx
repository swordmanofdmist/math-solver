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

const DERIVATIVE_RECENT_KEY = "math-solver:recent-derivatives";

const derivativeExamples = [
  { expression: "x^3 + 2x", variable: "x", order: "1" },
  { expression: "sin(x) + x^2", variable: "x", order: "1" },
  { expression: "x^4 - 3x^2 + 7", variable: "x", order: "2" },
  { expression: "e^x + 5x", variable: "x", order: "1" },
];

export default function DerivativesPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [order, setOrder] = useState("1");
  const [recentEquations, setRecentEquations] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRecentEquations(readRecentEquations(DERIVATIVE_RECENT_KEY));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleGenerateExample() {
    const example =
      derivativeExamples[Math.floor(Math.random() * derivativeExamples.length)];

    setExpression(example.expression);
    setVariable(example.variable);
    setOrder(example.order);
    setError("");
    setResult("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    const parsedOrder = Number(order);
    const trimmedExpression = expression.trim();
    const trimmedVariable = variable.trim();

    if (!trimmedExpression) {
      setError("Enter a function before solving.");
      setLoading(false);
      return;
    }

    if (!trimmedVariable) {
      setError("Enter the variable to differentiate by.");
      setLoading(false);
      return;
    }

    if (!Number.isInteger(parsedOrder) || parsedOrder < 1) {
      setError("Derivative order must be a whole number greater than 0.");
      setLoading(false);
      return;
    }

    setRecentEquations(
      rememberRecentEquation(
        DERIVATIVE_RECENT_KEY,
        `d^${parsedOrder}/d${trimmedVariable}^${parsedOrder} (${trimmedExpression})`,
      ),
    );

    try {
      const response = await fetch("/api/derivative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: trimmedExpression,
          variable: trimmedVariable,
          order: parsedOrder,
        }),
      });
      const data = (await response.json()) as {
        result?: string;
        error?: string;
      };

      if (!response.ok || !data.result) {
        throw new Error(data.error || "Could not solve the derivative.");
      }

      setResult(
        `d^${parsedOrder}/d${trimmedVariable}^${parsedOrder} (${trimmedExpression}) = ${data.result}`,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not solve the derivative.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Derivative Solver | Math Solver</title>
      </Head>

      <section className="page-header">
        <h1>Derivative Solver</h1>
        <p>
          Enter a function and choose which derivative order should be solved.
        </p>
      </section>

      <SolverNavigation
        previous={{ href: "/series", label: "Series" }}
        next={{ href: "/integrals", label: "Integrals" }}
      />

      <section className="solver-helper-row">
        <button type="button" className="example-button" onClick={handleGenerateExample}>
          Generate example
        </button>
        <RecentEquationsNote equations={recentEquations} />
      </section>

      <form className="solver-form" onSubmit={handleSubmit}>
        <MathInput
          id="derivative-expression"
          label="Function"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="Example: x^3 + 2x"
          required
        />
        <div className="form-row">
          <MathInput
            id="derivative-variable"
            label="Variable"
            value={variable}
            onChange={(event) => setVariable(event.target.value)}
            placeholder="x"
            required
          />
          <MathInput
            id="derivative-order"
            label="Derivative order"
            type="number"
            min={1}
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Solving..." : "Solve derivative"}
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
