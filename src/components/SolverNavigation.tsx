import Link from "next/link";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <nav className="solver-side-nav" aria-label={t.common.switchSolver}>
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
