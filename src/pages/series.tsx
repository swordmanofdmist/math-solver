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

const SERIES_RECENT_KEY = "math-solver:recent-series";

const seriesExamples = [
  { expression: "1 / n^2", variable: "n", startValue: "1" },
  { expression: "1 / n", variable: "n", startValue: "1" },
  { expression: "1 / 2^n", variable: "n", startValue: "1" },
  { expression: "n / (n^3 + 1)", variable: "n", startValue: "1" },
];

export default function SeriesPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("n");
  const [startValue, setStartValue] = useState("1");
  const [recentEquations, setRecentEquations] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRecentEquations(readRecentEquations(SERIES_RECENT_KEY));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleGenerateExample() {
    const example =
      seriesExamples[Math.floor(Math.random() * seriesExamples.length)];

    setExpression(example.expression);
    setVariable(example.variable);
    setStartValue(example.startValue);
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
    const trimmedStartValue = startValue.trim();

    if (!trimmedExpression) {
      setError("Enter a series term before analyzing.");
      setLoading(false);
      return;
    }

    if (!trimmedVariable) {
      setError("Enter the index variable.");
      setLoading(false);
      return;
    }

    if (!trimmedStartValue) {
      setError("Enter the starting index value.");
      setLoading(false);
      return;
    }

    setRecentEquations(
      rememberRecentEquation(
        SERIES_RECENT_KEY,
        `sum of ${trimmedExpression} from ${trimmedVariable} = ${trimmedStartValue} to infinity`,
      ),
    );

    try {
      const response = await fetch("/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: trimmedExpression,
          variable: trimmedVariable,
          startValue: trimmedStartValue,
        }),
      });
      const data = (await response.json()) as {
        result?: string;
        error?: string;
      };

      if (!response.ok || !data.result) {
        throw new Error(data.error || "Could not analyze the series.");
      }

      setResult(
        `Sum of ${trimmedExpression} from ${trimmedVariable} = ${trimmedStartValue} to infinity: ${data.result}`,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not analyze the series.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Series Solver | Math Solver</title>
      </Head>

      <section className="page-header">
        <h1>Series Solver</h1>
        <p>
          Enter the general term of a series and choose how convergence should
          be checked.
        </p>
      </section>

      <SolverNavigation
        previous={{ href: "/integrals", label: "Integrals" }}
        next={{ href: "/derivatives", label: "Derivatives" }}
      />

      <section className="solver-helper-row">
        <button type="button" className="example-button" onClick={handleGenerateExample}>
          Generate example
        </button>
        <RecentEquationsNote equations={recentEquations} />
      </section>

      <form className="solver-form" onSubmit={handleSubmit}>
        <MathInput
          id="series-expression"
          label="Series term"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="Example: 1 / n^2"
          required
        />

        <div className="form-row">
          <MathInput
            id="series-variable"
            label="Index variable"
            value={variable}
            onChange={(event) => setVariable(event.target.value)}
            placeholder="n"
            required
          />
          <MathInput
            id="series-start"
            label="Start value"
            value={startValue}
            onChange={(event) => setStartValue(event.target.value)}
            placeholder="1"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze series"}
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
