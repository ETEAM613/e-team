import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, GraduationCap, Heart, PiggyBank, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import { TRANSPARENCY } from "@/lib/data";
import { eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Transparence" };

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function TransparencyPage() {
  const T = TRANSPARENCY;
  const max = Math.max(...T.months.map((m) => m.collected));
  const balance = T.collected - T.distributed;

  return (
    <>
      <PageHero
        eyebrow="Tableau de transparence · public"
        title="Où va chaque euro donné"
        text="La cagnotte de dons finance exclusivement les cours des élèves sponsorisés. Les enseignants sont rémunérés 8 € par cours financé."
        gradient="from-ink via-brand-900 to-brand-700"
        icon={<BarChart3 className="h-7 w-7" />}
      />

      <div className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: PiggyBank, v: eur.format(T.collected), l: "Dons collectés", c: "from-brand-500 to-indigo-700" },
            { icon: GraduationCap, v: eur.format(T.distributed), l: "Versés aux enseignants", c: "from-teal-400 to-sky-600" },
            { icon: Users, v: String(T.sponsoredStudents), l: "Élèves sponsorisés", c: "from-pink-500 to-rose-500" },
            { icon: Heart, v: T.fundedLessons.toLocaleString("fr-FR"), l: "Cours financés", c: "from-amber-400 to-orange-500" },
          ].map(({ icon: Icon, v, l, c }) => (
            <div key={l} className={`rounded-[2rem] bg-gradient-to-br p-6 text-white ${c}`}>
              <Icon className="h-6 w-6 text-white/80" />
              <p className="mt-6 font-display text-3xl font-extrabold">{v}</p>
              <p className="mt-1 text-sm text-white/85">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-[2rem] border border-line bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-extrabold">6 derniers mois</h2>
              <div className="flex gap-4 text-sm font-semibold">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-500" /> Collecté</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-400" /> Versé</span>
              </div>
            </div>
            <div className="mt-8 flex h-64 items-end gap-3 sm:gap-6" role="img" aria-label="Dons collectés et versés par mois">
              {T.months.map((m) => (
                <div key={m.label} className="flex h-full flex-1 flex-col justify-end">
                  <div className="flex flex-1 items-end justify-center gap-1">
                    <div className="w-1/2 max-w-7 rounded-t-lg bg-brand-500" style={{ height: `${(m.collected / max) * 100}%` }} title={`Collecté : ${eur.format(m.collected)}`} />
                    <div className="w-1/2 max-w-7 rounded-t-lg bg-teal-400" style={{ height: `${(m.distributed / max) * 100}%` }} title={`Versé : ${eur.format(m.distributed)}`} />
                  </div>
                  <p className="mt-2 text-center text-xs font-bold text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-line bg-white p-7">
            <h2 className="text-2xl font-extrabold">Répartition</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="flex justify-between text-sm font-semibold"><span>Dons → élèves sponsorisés</span><span>100 %</span></dt>
                <dd className="mt-2 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
              </div>
              <div>
                <dt className="flex justify-between text-sm font-semibold"><span>Rémunération par cours financé</span><span>{T.teacherPayPerLesson} €</span></dt>
                <dd className="mt-1 text-sm text-muted">versés à l&apos;enseignant</dd>
              </div>
              <div>
                <dt className="flex justify-between text-sm font-semibold"><span>Solde disponible</span><span>{eur.format(balance)}</span></dt>
                <dd className="mt-1 text-sm text-muted">≈ {Math.floor(balance / T.teacherPayPerLesson)} cours à financer</dd>
              </div>
              <div>
                <dt className="flex justify-between text-sm font-semibold"><span>Donateurs</span><span>{T.donors}</span></dt>
              </div>
            </dl>
            <Link
              href="/don"
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-bold text-white shadow-lg shadow-pink-500/30"
            >
              <Heart className="h-5 w-5 fill-white" /> Faire un don
            </Link>
          </section>
        </div>

        <p className={`${eyebrow} mt-10 text-center !normal-case !tracking-normal !text-muted`}>
          Données d&apos;exemple — le tableau sera alimenté automatiquement par les vrais dons et cours.
        </p>
      </div>
    </>
  );
}
