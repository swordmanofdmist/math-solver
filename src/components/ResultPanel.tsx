import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ResultPanelProps = {
  result: string;
  children?: ReactNode;
};

export default function ResultPanel({ result, children }: ResultPanelProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(resetTimeout.current);
  }, []);

  async function handleCopy() {
    if (!navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.clearTimeout(resetTimeout.current);
      resetTimeout.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="result-panel" aria-live="polite">
      <div className="result-header">
        <div className="result-title-group">
          <span className="result-status-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m6.5 12.5 3.3 3.3 7.7-8" />
            </svg>
          </span>
          <div>
            <p className="result-kicker">{t.common.solutionComplete}</p>
            <h2>{t.common.result}</h2>
          </div>
        </div>
        <button
          type="button"
          className={`result-copy-button${copied ? " result-copy-button-copied" : ""}`}
          onClick={() => void handleCopy()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {copied ? (
              <path d="m5 12.5 4 4 10-10" />
            ) : (
              <>
                <rect x="8" y="8" width="11" height="11" rx="2" />
                <path d="M16 8V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h1" />
              </>
            )}
          </svg>
          <span>{copied ? t.common.copied : t.common.copyResult}</span>
        </button>
      </div>

      <div className="result-equation">
        <div className="result-equation-content">{children ?? result}</div>
      </div>
    </section>
  );
}
