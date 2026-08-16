import Head from "next/head";
import Link from "next/link";

const operationDefinitions = [
  {
    title: "Derivative",
    label: "Differentiation",
    href: "/derivatives",
    sourceHref: "https://www.britannica.com/science/calculus-mathematics",
    sourceLabel: "Encyclopaedia Britannica, calculus",
    description:
      "A derivative describes a function's rate of change. Britannica explains differential calculus as the part of calculus concerned with instantaneous rates of change and the slope of a curve at a point.",
  },
  {
    title: "Integral",
    label: "Integration",
    href: "/integrals",
    sourceHref: "https://www.britannica.com/science/calculus-mathematics",
    sourceLabel: "Encyclopaedia Britannica, calculus",
    description:
      "An integral represents accumulation. Britannica describes integral calculus as summing infinitely many small parts to determine a whole, such as the area under a curve.",
  },
  {
    title: "Series",
    label: "Convergence",
    href: "/series",
    sourceHref:
      "https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Series",
    sourceLabel: "Encyclopaedia Britannica (1911), Series",
    description:
      "A mathematical series is an ordered succession of quantities. For infinite series, Britannica describes convergence as the partial sums approaching a definite finite limit.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Math Solver</title>
        <meta
          name="description"
          content="A Next.js math solver for derivatives, integrals, and series."
        />
      </Head>

      <section className="page-header home-hero">
        <h1>Math Solver</h1>
        <p>
          Enter calculus and series problems, choose the right solver, and get
          a structured result from the app.
        </p>
      </section>

      <section className="cover-image-section" aria-label="Calculus terms cover">
        <img
          src="https://cdn.iacedcalculus.com/uploads/2024/08/Calculus-Terms-1024x791.png"
          alt="Illustrated calculus terms reference chart"
        />
      </section>

      <section className="definitions" aria-labelledby="definitions-heading">
        <div className="section-heading">
          <p>Operations</p>
          <h2 id="definitions-heading">What each solver means</h2>
        </div>
        <div className="definition-grid">
          {operationDefinitions.map((operation) => (
            <article className="definition-card" key={operation.title}>
              <Link className="definition-card-link" href={operation.href}>
                <span className="sr-only">Open {operation.title} solver</span>
              </Link>
              <div>
                <p className="definition-label">{operation.label}</p>
                <h3>{operation.title}</h3>
                <p>{operation.description}</p>
              </div>
              <div className="definition-actions">
                <a
                  href={operation.sourceHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Source: {operation.sourceLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="manual">
        <h2>User manual</h2>
        <ol>
          <li>Choose a solver from the navigation bar.</li>
          <li>Enter the math expression using variables like x or n.</li>
          <li>Fill in extra options such as derivative order or integral bounds.</li>
          <li>Submit the form to preview the request that will later be sent to the API.</li>
        </ol>
      </section>
    </>
  );
}
