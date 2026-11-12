import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SPACES } from "@/lib/data";

export const metadata: Metadata = { title: "Qui sommes-nous ?" };

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-bold uppercase tracking-wider text-gold-300">À propos de e-team</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Une connexion d&apos;âme à âme, une plateforme humaine.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy-100">
            Pour que chacun puisse trouver « son Rav, son moment, son étude ».
          </p>
        </div>
      </section>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="text-3xl font-extrabold">Qui sommes-nous ?</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/90">
            <p>
              e-team est une plateforme innovante dédiée à tous les publics, quel que soit leur niveau de connaissance en Torah.
            </p>
            <p>
              Notre objectif est simple mais fondamental : permettre à chacun de fixer des rendez-vous d&apos;étude personnalisés,
              en ligne, à son rythme, avec un enseignant ou une enseignante qualifiée.
            </p>
            <p>
              Cette initiative est née d&apos;un constat fort : le public a soif d&apos;études authentiques, vivantes, interactives.
              Beaucoup ne veulent plus simplement écouter des cours passivement. Ils cherchent un lien, un échange, une vraie transmission.
            </p>
            <p>
              Fort de mon expérience en tant que directeur d&apos;institutions d&apos;étude, entouré de nombreux Avrekhim, Rabbanim et
              enseignants engagés, j&apos;ai voulu créer un pont entre ceux qui veulent donner et ceux qui veulent recevoir.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-extrabold">Ce que nous faisons</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/90">
            Mettre en relation les maîtres de Torah et les personnes en quête de savoir, dans un cadre structuré, accessible et bienveillant.
          </p>
          <div className="mt-6 space-y-4">
            {SPACES.map((s) => (
              <Link key={s.slug} href={`/espaces/${s.slug}`} className="block rounded-2xl bg-white p-5 ring-1 ring-line transition hover:ring-ink">
                <p className="flex items-center justify-between text-lg font-extrabold">
                  {s.title} <ArrowRight className="h-5 w-5" />
                </p>
                <ul className="mt-2 space-y-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" /> {p}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="container-page">
        <div className="rounded-3xl bg-gold-300 p-8 sm:p-12">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ce qui nous rend uniques</h2>
          <p className="mt-4 max-w-3xl text-lg text-ink/80">
            Grâce à notre plateforme, chaque personne a un vis-à-vis réel, un enseignant ou une enseignante dédié(e), avec qui
            étudier régulièrement, poser ses questions et s&apos;engager pleinement dans l&apos;apprentissage.
          </p>
          <p className="mt-4 text-xl font-extrabold">
            Nous ne proposons pas seulement d&apos;écouter la Torah. Nous vous offrons de l&apos;étudier, de l&apos;intérioriser et de la vivre.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/enseignants" className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-bold text-white hover:bg-navy-700">
              Trouver mon enseignant <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/comment-ca-marche" className="rounded-xl border-2 border-ink px-6 py-3.5 font-bold hover:bg-white/50">
              Découvrir comment ça marche
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
