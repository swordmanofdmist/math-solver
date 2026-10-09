import MathInput from "@/components/MathInput";
import RecentEquationsNote from "@/components/RecentEquationsNote";
import ResultPanel from "@/components/ResultPanel";
import SolverNavigation from "@/components/SolverNavigation";
import {
  readRecentEquations,
  rememberRecentEquation,
} from "@/lib/recentEquations";
import { useI18n } from "@/lib/i18n";
import { pickRandomExample, seriesExamples } from "@/lib/solverExamples";
import Head from "next/head";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

const SERIES_RECENT_KEY = "math-solver:recent-series";

export default function SeriesPage() {
  const { t } = useI18n();
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
    const example = pickRandomExample(seriesExamples, expression);

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
      setError(t.seriesPage.errors.expression);
      setLoading(false);
      return;
    }

    if (!trimmedVariable) {
      setError(t.seriesPage.errors.variable);
      setLoading(false);
      return;
    }

    if (!trimmedStartValue) {
      setError(t.seriesPage.errors.startValue);
      setLoading(false);
      return;
    }

    setRecentEquations(
      rememberRecentEquation(
        SERIES_RECENT_KEY,
        t.seriesPage.recentText(
          trimmedExpression,
          trimmedVariable,
          trimmedStartValue,
        ),
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
        throw new Error(t.seriesPage.errors.analyze);
      }

      setResult(t.seriesPage.resultText(
        trimmedExpression,
        trimmedVariable,
        trimmedStartValue,
        data.result,
      ));
    } catch {
      setError(t.seriesPage.errors.analyze);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{t.seriesPage.pageTitle}</title>
      </Head>

      <section className="page-header">
        <h1>{t.seriesPage.heading}</h1>
        <p>{t.seriesPage.intro}</p>
      </section>

      <SolverNavigation
        previous={{ href: "/integrals", label: t.common.integrals }}
        next={{ href: "/derivatives", label: t.common.derivatives }}
      />

      <section className="solver-helper-row">
        <button type="button" className="example-button" onClick={handleGenerateExample}>
          {t.common.generateExample}
        </button>
        <RecentEquationsNote equations={recentEquations} />
      </section>

      <form className="solver-form" onSubmit={handleSubmit}>
        <MathInput
          id="series-expression"
          label={t.seriesPage.term}
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder={`${t.common.example}: 1 / n^2`}
          required
        />

        <div className="form-row">
          <MathInput
            id="series-variable"
            label={t.seriesPage.indexVariable}
            value={variable}
            onChange={(event) => setVariable(event.target.value)}
            placeholder="n"
            required
          />
          <MathInput
            id="series-start"
            label={t.seriesPage.startValue}
            value={startValue}
            onChange={(event) => setStartValue(event.target.value)}
            placeholder="1"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t.seriesPage.analyzing : t.seriesPage.analyze}
        </button>
      </form>

      {result && <ResultPanel result={result} />}
    </>
  );
}
