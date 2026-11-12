import type { Metadata } from "next";
import { Suspense } from "react";
import TeacherSearch from "./TeacherSearch";
import { eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trouver un enseignant",
};

type SP = Promise<{ matiere?: string; pour?: string }>;

async function Results({ searchParams }: { searchParams: SP }) {
  const { matiere = "", pour = "" } = await searchParams;
  return <TeacherSearch key={`${matiere}|${pour}`} initialSubject={matiere} initialAudience={pour} />;
}

export default function TeachersPage({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <section className="mesh-light border-b border-line">
        <div className="container-page py-12">
          <p className={eyebrow}>Recherche principale</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Trouvez votre enseignant de Torah</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Navigation libre. Votre premier cours est offert, avec l&apos;enseignant de votre choix.
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
