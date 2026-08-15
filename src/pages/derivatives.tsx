import MathInput from "@/components/MathInput";
import Head from "next/head";
import type { FormEvent } from "react";
import { useState } from "react";

export default function DerivativesPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [order, setOrder] = useState("1");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    const parsedOrder = Number(order);

    if (!expression.trim()) {
      setError("Enter a function before solving.");
      setLoading(false);
      return;
    }

    if (!variable.trim()) {
      setError("Enter the variable to differentiate by.");
      setLoading(false);
      return;
    }

    if (!Number.isInteger(parsedOrder) || parsedOrder < 1) {
      setError("Derivative order must be a whole number greater than 0.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/derivative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: expression.trim(),
          variable: variable.trim(),
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
        `d^${parsedOrder}/d${variable.trim()}^${parsedOrder} (${expression.trim()}) = ${data.result}`,
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
