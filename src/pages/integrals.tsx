import MathInput from "@/components/MathInput";
import RecentEquationsNote from "@/components/RecentEquationsNote";
import ResultPanel from "@/components/ResultPanel";
import SolverNavigation from "@/components/SolverNavigation";
import {
  readRecentEquations,
  rememberRecentEquation,
} from "@/lib/recentEquations";
import { useI18n } from "@/lib/i18n";
import { integralExamples, pickRandomExample } from "@/lib/solverExamples";
import Head from "next/head";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type IntegralType = "indefinite" | "definite";

const INTEGRAL_RECENT_KEY = "math-solver:recent-integrals";

export default function IntegralsPage() {
  const { t } = useI18n();
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
    const example = pickRandomExample(integralExamples, expression);

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
      setError(t.integral.errors.expression);
      setLoading(false);
      return;
    }

    if (!trimmedVariable) {
      setError(t.integral.errors.variable);
      setLoading(false);
      return;
    }

    if (
      integralType === "definite" &&
      (!trimmedLowerBound || !trimmedUpperBound)
    ) {
      setError(t.integral.errors.bounds);
      setLoading(false);
      return;
    }

    const typeLabel =
      integralType === "definite"
        ? t.integral.definite
        : t.integral.indefinite;

    setRecentEquations(
      rememberRecentEquation(
        INTEGRAL_RECENT_KEY,
        t.integral.recentText(
          typeLabel,
          trimmedExpression,
          trimmedVariable,
          integralType === "definite" ? trimmedLowerBound : "",
          integralType === "definite" ? trimmedUpperBound : "",
        ),
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
        throw new Error(t.integral.errors.solve);
      }

      setResult(t.integral.resultText(
        typeLabel,
        trimmedExpression,
        trimmedVariable,
        integralType === "definite" ? trimmedLowerBound : "",
        integralType === "definite" ? trimmedUpperBound : "",
        data.result,
      ));
    } catch {
      setError(t.integral.errors.solve);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{t.integral.pageTitle}</title>
      </Head>

      <section className="page-header">
        <h1>{t.integral.heading}</h1>
        <p>{t.integral.intro}</p>
      </section>

      <SolverNavigation
        previous={{ href: "/derivatives", label: t.common.derivatives }}
        next={{ href: "/series", label: t.common.series }}
      />

      <section className="solver-helper-row">
        <button type="button" className="example-button" onClick={handleGenerateExample}>
          {t.common.generateExample}
        </button>
        <RecentEquationsNote equations={recentEquations} />
      </section>

      <form className="solver-form" onSubmit={handleSubmit}>
        <MathInput
          id="integral-expression"
          label={t.common.function}
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder={`${t.common.example}: x^2 + sin(x)`}
          required
        />

        <MathInput
          id="integral-variable"
          label={t.common.variable}
          value={variable}
          onChange={(event) => setVariable(event.target.value)}
          placeholder="x"
          required
        />

        <fieldset className="radio-group">
          <legend>{t.integral.type}</legend>
          <label>
            <input
              type="radio"
              name="integral-type"
              value="indefinite"
              checked={integralType === "indefinite"}
              onChange={() => setIntegralType("indefinite")}
            />
            {t.integral.indefinite}
          </label>
          <label>
            <input
              type="radio"
              name="integral-type"
              value="definite"
              checked={integralType === "definite"}
              onChange={() => setIntegralType("definite")}
            />
            {t.integral.definite}
          </label>
        </fieldset>

        {integralType === "definite" && (
          <div className="form-row">
            <MathInput
              id="lower-bound"
              label={t.integral.lowerBound}
              value={lowerBound}
              onChange={(event) => setLowerBound(event.target.value)}
              placeholder="0"
              required
            />
            <MathInput
              id="upper-bound"
              label={t.integral.upperBound}
              value={upperBound}
              onChange={(event) => setUpperBound(event.target.value)}
              placeholder="1"
              required
            />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t.integral.solving : t.integral.solve}
        </button>
      </form>

      {result && <ResultPanel result={result} />}
    </>
  );
}
