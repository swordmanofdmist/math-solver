import Link from "next/link";
import { useI18n, type Locale } from "@/lib/i18n";
import { useRouter } from "next/router";
import type { ChangeEvent, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { locale, t } = useI18n();

  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;

    document.cookie = `NEXT_LOCALE=${nextLocale}; max-age=31536000; path=/; SameSite=Lax`;
    void router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: nextLocale },
    );
  }

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          {t.common.appName}
        </Link>
        <div className="header-actions">
          <nav className="nav-links" aria-label={t.common.mainNavigation}>
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
          <label className="language-picker">
            <span>{t.common.language}</span>
            <select value={locale} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="mk">Македонски</option>
            </select>
          </label>
        </div>
      </header>
      <main className="page-container">{children}</main>
      <footer className="site-footer">
        <p>{t.common.footer}</p>
      </footer>
    </>
  );
}
