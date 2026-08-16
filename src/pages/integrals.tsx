import MathInput from "@/components/MathInput";
import SolverNavigation from "@/components/SolverNavigation";
import Head from "next/head";
import type { FormEvent } from "react";
import { useState } from "react";

type IntegralType = "indefinite" | "definite";

export default function IntegralsPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [integralType, setIntegralType] =
    useState<IntegralType>("indefinite");
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    if (!expression.trim()) {
      setError("Enter a function before solving.");
      setLoading(false);
      return;
    }

    if (!variable.trim()) {
      setError("Enter the variable to integrate by.");
      setLoading(false);
      return;
    }

    if (
      integralType === "definite" &&
      (!lowerBound.trim() || !upperBound.trim())
    ) {
      setError("Enter both bounds for a definite integral.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/integral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: expression.trim(),
          variable: variable.trim(),
          integralType,
          lowerBound: lowerBound.trim(),
          upperBound: upperBound.trim(),
        }),
      });
      const data = (await response.json()) as {
        result?: string;
        error?: string;
      };

      if (!response.ok || !data.result) {
        throw new Error(data.error || "Could not solve the integral.");
      }

      const bounds =
        integralType === "definite"
          ? ` from ${lowerBound.trim()} to ${upperBound.trim()}`
          : "";

      setResult(
        `${integralType} integral of ${expression.trim()} with respect to ${variable.trim()}${bounds} = ${data.result}`,
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
