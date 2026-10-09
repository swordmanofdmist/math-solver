import { useI18n } from "@/lib/i18n";

type RecentEquationsNoteProps = {
  equations: string[];
};

export default function RecentEquationsNote({
  equations,
}: RecentEquationsNoteProps) {
  const { t } = useI18n();

  return (
    <aside className="sticky-note" aria-label={t.common.recentEquations}>
      <h2>{t.common.recentEquations}</h2>
      {equations.length > 0 ? (
        <ol>
          {equations.map((equation) => (
            <li key={equation}>{equation}</li>
          ))}
        </ol>
      ) : (
        <p>{t.common.noEquations}</p>
      )}
    </aside>
  );
}
