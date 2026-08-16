import MathInput from "@/components/MathInput";
import SolverNavigation from "@/components/SolverNavigation";
import Head from "next/head";
import type { FormEvent } from "react";
import { useState } from "react";

export default function SeriesPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("n");
  const [startValue, setStartValue] = useState("1");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    if (!expression.trim()) {
      setError("Enter a series term before analyzing.");
      setLoading(false);
      return;
    }

    if (!variable.trim()) {
      setError("Enter the index variable.");
      setLoading(false);
      return;
    }

    if (!startValue.trim()) {
      setError("Enter the starting index value.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: expression.trim(),
          variable: variable.trim(),
          startValue: startValue.trim(),
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
        `Sum of ${expression.trim()} from ${variable.trim()} = ${startValue.trim()} to infinity: ${data.result}`,
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
