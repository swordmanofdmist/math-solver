import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import AnimatedOperationSymbol from "@/components/AnimatedOperationSymbol";
import { useI18n } from "@/lib/i18n";

const operationLinks = [
  {
    href: "/derivatives",
    surface: "blackboard",
    sourceHref: "https://www.britannica.com/science/calculus-mathematics",
    sourceLabel: "Encyclopaedia Britannica, calculus",
  },
  {
    href: "/integrals",
    surface: "squared-paper",
    sourceHref: "https://www.britannica.com/science/calculus-mathematics",
    sourceLabel: "Encyclopaedia Britannica, calculus",
  },
  {
    href: "/series",
    surface: "whiteboard",
    sourceHref:
      "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Series",
    sourceLabel: "Encyclopaedia Britannica (1911), Series",
  },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <Head>
        <title>{t.common.appName}</title>
        <meta name="description" content={t.home.metaDescription} />
      </Head>

      <section className="page-header home-hero">
        <h1>{t.common.appName}</h1>
        <p>{t.home.intro}</p>
      </section>

      <section className="cover-image-section" aria-label={t.home.coverAria}>
        <Image
          src="https://cdn.iacedcalculus.com/uploads/2024/08/Calculus-Terms-1024x791.png"
          alt={t.home.coverAlt}
          width={1024}
          height={791}
          sizes="(max-width: 1072px) calc(100vw - 48px), 1024px"
          preload
        />
      </section>

      <section className="definitions" aria-labelledby="definitions-heading">
        <div className="section-heading">
          <p>{t.home.operations}</p>
          <h2 id="definitions-heading">{t.home.definitionsHeading}</h2>
        </div>
        <div className="definition-grid">
          {operationLinks.map((link, index) => {
            const operation = t.home.operationsList[index];

            return (
              <article className="operation-pair" key={link.href}>
                <div className="definition-card" tabIndex={0}>
                  <div>
                    <p className="definition-label">{operation.label}</p>
                    <h3>{operation.title}</h3>
                    <p>{operation.description}</p>
                  </div>
                  <div className="definition-actions">
                    <a href={link.sourceHref} rel="noreferrer" target="_blank">
                      {t.home.source}: {link.sourceLabel}
                    </a>
                  </div>
                </div>
                <Link
                  className={`operation-solver-button operation-surface-${link.surface}`}
                  href={link.href}
                  aria-label={t.home.openSolver(operation.title)}
                >
                  <span className="operation-symbol" aria-hidden="true">
                    <AnimatedOperationSymbol index={index} />
                  </span>
                  <span className="operation-button-title">
                    {operation.title}
                  </span>
                  <span className="operation-button-label">
                    {t.home.openSolver(operation.title)}{" "}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="manual">
        <h2>{t.home.manualTitle}</h2>
        <ol>
          {t.home.manualSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
