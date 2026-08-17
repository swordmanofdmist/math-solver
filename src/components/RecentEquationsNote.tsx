type RecentEquationsNoteProps = {
  equations: string[];
};

export default function RecentEquationsNote({
  equations,
}: RecentEquationsNoteProps) {
  return (
    <aside className="sticky-note" aria-label="Recent equations">
      <h2>Recent equations</h2>
      {equations.length > 0 ? (
        <ol>
          {equations.map((equation) => (
            <li key={equation}>{equation}</li>
          ))}
        </ol>
      ) : (
        <p>No equations yet.</p>
      )}
    </aside>
  );
}
