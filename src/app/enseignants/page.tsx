import type { Metadata } from "next";
import { Suspense } from "react";
import TeacherSearch from "./TeacherSearch";

export const metadata: Metadata = {
  title: "Trouver un enseignant",
};

type SP = Promise<{ matiere?: string; public?: string }>;

async function Results({ searchParams }: { searchParams: SP }) {
  const { matiere = "", public: pub = "" } = await searchParams;
  return <TeacherSearch key={`${matiere}|${pub}`} initialSubject={matiere} initialPublic={pub} />;
}

export default function TeachersPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="mesh-light border-b border-line">
        <div className="container-page py-10">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Trouvez votre enseignant de Torah</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Votre premier cours est offert. Affinez avec les filtres : matière, niveau, horaires…
          </p>
        </div>
      </section>
      <div className="container-page py-8">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-white" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
