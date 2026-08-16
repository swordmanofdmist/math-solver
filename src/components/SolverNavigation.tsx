import Link from "next/link";

type SolverLink = {
  href: string;
  label: string;
};

type SolverNavigationProps = {
  previous: SolverLink;
  next: SolverLink;
};

export default function SolverNavigation({
  previous,
  next,
}: SolverNavigationProps) {
  return (
    <nav className="solver-side-nav" aria-label="Switch solver">
      <Link className="solver-side-button solver-side-button-left" href={previous.href}>
        <span aria-hidden="true">&larr;</span>
        <span>{previous.label}</span>
      </Link>
      <Link className="solver-side-button solver-side-button-right" href={next.href}>
        <span>{next.label}</span>
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </nav>
  );
}
