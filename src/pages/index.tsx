import Head from "next/head";
import Link from "next/link";

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

      <section className="page-header">
        <h1>Math Solver</h1>
        <p>
          Enter calculus and series problems, choose the right solver, and
          prepare the request for a solving API.
        </p>
      </section>

      <section className="manual">
        <h2>User manual</h2>
        <ol>
          <li>Choose one of the solvers below.</li>
          <li>Enter the math expression using variables like x or n.</li>
          <li>Fill in extra options such as derivative order or integral bounds.</li>
          <li>Submit the form to preview the request that will later be sent to the API.</li>
        </ol>
      </section>

      <section className="solver-grid" aria-label="Solver choices">
        <Link href="/derivatives" className="solver-card">
          <h2>Derivative Solver</h2>
          <p>Solve basic derivatives up to the n-th order.</p>
        </Link>
        <Link href="/integrals" className="solver-card">
          <h2>Integral Solver</h2>
          <p>Prepare indefinite and definite integral problems.</p>
        </Link>
        <Link href="/series" className="solver-card">
          <h2>Series Solver</h2>
          <p>Check if a series is converging or diverging.</p>
        </Link>
      </section>
    </>
  );
}
