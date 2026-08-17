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
          <a href="https://www.linkedin.com/" rel="noreferrer" target="_blank">
            LinkedIn
          </a>
          <a href="https://www.britannica.com/" rel="noreferrer" target="_blank">
            Britannica
          </a>
          <a
            href="https://www.wolframalpha.com/"
            rel="noreferrer"
            target="_blank"
          >
            WolframAlpha
          </a>
        </nav>
      </header>
      <main className="page-container">{children}</main>
      <footer className="site-footer">
        <p>
          Math Solver helps practice derivatives, integrals, and series. Built
          by Konstantin and Codex.
        </p>
      </footer>
    </>
  );
}
