import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Baby, GraduationCap, Search, Shield, Trash2 } from "lucide-react";
import { requireUser } from "@/lib/server/auth";
import { myChildren, removeChild } from "@/app/actions/account";
import { logout } from "@/app/actions/auth";
import { btn } from "@/components/ui";
import AddChildForm from "./AddChildForm";
import LessonList from "@/components/LessonList";
import { studentLessons } from "@/lib/server/lessons";

export const metadata: Metadata = { title: "Mon compte" };

const ROLE_LABEL = { eleve: "Élève", parent: "Parent", enseignant: "Enseignant", admin: "Administrateur" } as const;

export default async function AccountPage() {
  const user = await requireUser();
  const children = await myChildren();
  const lessons = await studentLessons(user.id);

  return (
    <div className="container-page max-w-4xl py-12">
      <h1 className="text-4xl font-extrabold">Bonjour {user.firstName} 👋</h1>
      <p className="mt-2 text-muted">Bienvenue dans votre espace e-team.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/enseignants" className="group flex items-center gap-4 rounded-[1.5rem] bg-gradient-to-br from-brand-500 to-indigo-700 p-6 text-white">
          <Search className="h-8 w-8" />
          <span className="flex-1">
            <span className="block text-lg font-extrabold">Trouver un enseignant</span>
            <span className="block text-sm text-white/80">Votre premier cours est offert</span>
          </span>
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </Link>
        {user.role === "enseignant" && (
          <Link href="/espace-enseignant" className="group flex items-center gap-4 rounded-[1.5rem] border border-line bg-white p-6">
            <GraduationCap className="h-8 w-8 text-brand-500" />
            <span className="flex-1 text-lg font-extrabold">Mon profil enseignant</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}
        {user.role === "admin" && (
          <Link href="/admin" className="group flex items-center gap-4 rounded-[1.5rem] border border-line bg-white p-6">
            <Shield className="h-8 w-8 text-brand-500" />
            <span className="flex-1 text-lg font-extrabold">Administration</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Mes cours */}
      <section id="cours" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-extrabold">Mes cours à venir</h2>
        <div className="mt-4">
          <LessonList
            lessons={lessons}
            as="student"
            empty={<>Aucun cours réservé. <Link href="/enseignants" className="font-bold text-brand-600 hover:underline">Réserver mon premier cours (offert)</Link></>}
          />
        </div>
      </section>

      {/* Enfants */}
      <section id="enfants" className="mt-12 scroll-mt-24 rounded-[2rem] border border-line bg-white p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold">
          <Baby className="h-6 w-6 text-amber-500" /> Mes enfants
        </h2>
        <p className="mt-1 text-sm text-muted">Ajoutez vos enfants pour leur réserver des cours avec un enseignant adapté.</p>

        {children.length > 0 && (
          <ul className="mt-5 divide-y divide-line rounded-2xl border border-line">
            {children.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span>
                  <span className="font-bold">{c.first_name}</span>
                  <span className="ml-2 text-sm text-muted">
                    {c.gender === "garcon" ? "Garçon" : "Fille"} · {c.age} ans · {c.level}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Link href={`/enfants`} className="text-sm font-bold text-brand-600 hover:underline">
                    Trouver un enseignant
                  </Link>
                  <form action={removeChild.bind(null, c.id)}>
                    <button className="rounded-full p-2 text-muted hover:bg-rose-50 hover:text-rose-600" aria-label={`Retirer ${c.first_name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        )}
        <AddChildForm />
      </section>

      {/* Informations */}
      <section className="mt-6 rounded-[2rem] border border-line bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold">Mes informations</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Nom</dt><dd className="font-bold">{user.firstName} {user.lastName}</dd></div>
          <div><dt className="text-muted">E-mail</dt><dd className="font-bold">{user.email}</dd></div>
          <div><dt className="text-muted">Type de compte</dt><dd className="font-bold">{ROLE_LABEL[user.role]}</dd></div>
        </dl>
        <form action={logout} className="mt-6">
          <button className={btn.outline}>Se déconnecter</button>
        </form>
      </section>
    </div>
  );
}
