import type { Metadata } from "next";
import { Suspense } from "react";
import TeacherSearch from "./TeacherSearch";

export const metadata: Metadata = {
  title: "Trouver un enseignant",
};

type SP = Promise<{ matiere?: string; espace?: string }>;

async function Results({ searchParams }: { searchParams: SP }) {
  const { matiere = "", espace = "" } = await searchParams;
  return <TeacherSearch key={`${matiere}|${espace}`} initialSubject={matiere} initialSpace={espace} />;
}

export default function TeachersPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Trouvez votre enseignant de Torah</h1>
      <p className="mt-2 text-muted">
        Choisissez parmi des Rabbanim, Avrekhim et enseignantes qualifiés. Réservez un cours d&apos;essai en quelques clics.
      </p>
      <Suspense fallback={<div className="mt-6 h-96 animate-pulse rounded-2xl bg-sand" />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
