import type { Metadata } from "next";
import TeacherSearch from "./TeacherSearch";
import { getCurrentUser } from "@/lib/server/auth";
import { listTeachers } from "@/lib/server/teachers";

export const metadata: Metadata = {
  title: "Trouver un enseignant",
};

export default async function TeachersPage({ searchParams }: { searchParams: Promise<{ matiere?: string; public?: string }> }) {
  const { matiere = "", public: pub = "" } = await searchParams;
  const user = await getCurrentUser();
  // Tri fait côté serveur : un compte ne reçoit que les enseignants qui lui correspondent.
  const teachers = await listTeachers(user?.gender ?? null);

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
        <TeacherSearch
          key={`${matiere}|${pub}`}
          teachers={teachers}
          gender={user?.gender ?? null}
          initialSubject={matiere}
          initialPublic={pub}
        />
      </div>
    </>
  );
}
