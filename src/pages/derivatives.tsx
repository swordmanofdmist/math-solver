import MathInput from "@/components/MathInput";
import RecentEquationsNote from "@/components/RecentEquationsNote";
import ResultPanel from "@/components/ResultPanel";
import SolverNavigation from "@/components/SolverNavigation";
import {
  readRecentEquations,
  rememberRecentEquation,
} from "@/lib/recentEquations";
import { useI18n } from "@/lib/i18n";
import {
  derivativeExamples,
  pickRandomExample,
} from "@/lib/solverExamples";
import Head from "next/head";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

const DERIVATIVE_RECENT_KEY = "math-solver:recent-derivatives";

type DerivativeResult = {
  expression: string;
  order: number;
  value: string;
  variable: string;
};

export default function DerivativesPage() {
  const { t } = useI18n();
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [order, setOrder] = useState("1");
  const [recentEquations, setRecentEquations] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DerivativeResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRecentEquations(readRecentEquations(DERIVATIVE_RECENT_KEY));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleGenerateExample() {
    const example = pickRandomExample(derivativeExamples, expression);

    setExpression(example.expression);
    setVariable(example.variable);
    setOrder(example.order);
    setError("");
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const parsedOrder = Number(order);
    const trimmedExpression = expression.trim();
    const trimmedVariable = variable.trim();

    if (!trimmedExpression) {
      setError(t.derivative.errors.expression);
      setLoading(false);
      return;
    }

    if (!trimmedVariable) {
      setError(t.derivative.errors.variable);
      setLoading(false);
      return;
    }

    if (!Number.isInteger(parsedOrder) || parsedOrder < 1) {
      setError(t.derivative.errors.order);
      setLoading(false);
      return;
    }

    setRecentEquations(
      rememberRecentEquation(
        DERIVATIVE_RECENT_KEY,
        parsedOrder === 1
          ? `d/d${trimmedVariable} (${trimmedExpression})`
          : `d^${parsedOrder}/d${trimmedVariable}^${parsedOrder} (${trimmedExpression})`,
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
        throw new Error(t.derivative.errors.solve);
      }

      setResult({
        expression: trimmedExpression,
        order: parsedOrder,
        value: data.result,
        variable: trimmedVariable,
      });
    } catch {
      setError(t.derivative.errors.solve);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{t.derivative.pageTitle}</title>
      </Head>

      <section className="page-header">
        <h1>{t.derivative.heading}</h1>
        <p>{t.derivative.intro}</p>
      </section>

      <SolverNavigation
        previous={{ href: "/series", label: t.common.series }}
        next={{ href: "/integrals", label: t.common.integrals }}
      />

      <section className="solver-helper-row">
        <button type="button" className="example-button" onClick={handleGenerateExample}>
          {t.common.generateExample}
        </button>
        <RecentEquationsNote equations={recentEquations} />
      </section>

      <form className="solver-form" onSubmit={handleSubmit}>
        <MathInput
          id="derivative-expression"
          label={t.common.function}
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder={`${t.common.example}: x^3 + 2x`}
          required
        />
        <div className="form-row">
          <MathInput
            id="derivative-variable"
            label={t.common.variable}
            value={variable}
            onChange={(event) => setVariable(event.target.value)}
            placeholder="x"
            required
          />
          <MathInput
            id="derivative-order"
            label={t.derivative.order}
            type="number"
            min={1}
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t.derivative.solving : t.derivative.solve}
        </button>
      </form>

      {result && (
        <ResultPanel
          result={t.derivative.resultText(
            result.order,
            result.variable,
            result.expression,
            result.value,
          )}
        >
          <span className="derivative-result">
            <span
              className="derivative-operator"
              role="img"
              aria-label={
                result.order === 1
                  ? `d/d${result.variable}`
                  : `d^${result.order}/d${result.variable}^${result.order}`
              }
            >
              <span aria-hidden="true">
                d{result.order > 1 && <sup>{result.order}</sup>}
              </span>
              <span aria-hidden="true">
                d{result.variable}
                {result.order > 1 && <sup>{result.order}</sup>}
              </span>
            </span>
            <span>({result.expression})</span>
            <span className="derivative-equals">=</span>
            <span className="derivative-answer">{result.value}</span>
          </span>
        </ResultPanel>
      )}
    </>
  );
}
