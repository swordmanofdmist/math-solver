import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          Math Solver
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/derivatives">Derivatives</Link>
          <Link href="/integrals">Integrals</Link>
          <Link href="/series">Series</Link>
        </nav>
      </header>
      <main className="page-container">{children}</main>
    </>
  );
}
