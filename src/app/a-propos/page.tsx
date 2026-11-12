import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Baby, HeartHandshake, MessageCircle, Search, Sparkles, TrendingUp } from "lucide-react";
import PageHero from "@/components/PageHero";
import { btn, eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Qui sommes-nous ?" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos de e-team"
        title={<>Une connexion d&apos;âme à âme, une plateforme humaine.</>}
        text="Pour que chacun puisse trouver « son Rav, son moment, son étude »."
        gradient="from-ink via-brand-900 to-brand-600"
      />

      <div className="container-page grid gap-14 py-16 lg:grid-cols-2">
        <section>
          <p className={eyebrow}>Qui sommes-nous ?</p>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/85">
            <p>e-team est une plateforme innovante dédiée à tous les publics, quel que soit leur niveau de connaissance en Torah.</p>
            <p>
              Notre objectif est simple mais fondamental : permettre à chacun de fixer des rendez-vous d&apos;étude personnalisés, en ligne,
              à son rythme, avec un enseignant ou une enseignante qualifiée.
            </p>
            <p>
              Cette initiative est née d&apos;un constat fort : le public a soif d&apos;études authentiques, vivantes, interactives. Beaucoup
              ne veulent plus simplement écouter des cours passivement. Ils cherchent un lien, un échange, une vraie transmission.
            </p>
            <p>
              Fort de mon expérience en tant que directeur d&apos;institutions d&apos;étude, entouré de nombreux Avrekhim, Rabbanim et
              enseignants engagés, j&apos;ai voulu créer un pont entre ceux qui veulent donner et ceux qui veulent recevoir.
            </p>
          </div>
        </section>

        <section>
          <p className={eyebrow}>Ce que nous faisons</p>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">
            Mettre en relation les maîtres de Torah et les personnes en quête de savoir, dans un cadre structuré, accessible et bienveillant.
          </p>
          <div className="mt-6 space-y-3">
            {[
              { href: "/enseignants", icon: Search, t: "Pour les hommes", d: "Havruta, suivi avec des Rabbanim, études sur mesure.", c: "from-brand-500 to-indigo-700" },
              { href: "/femmes", icon: HeartHandshake, t: "Pour les femmes", d: "Entre femmes, avec des enseignantes qualifiées, même en journée.", c: "from-pink-500 to-fuchsia-600" },
              { href: "/enfants", icon: Baby, t: "Pour les enfants", d: "Kodech, renforcement scolaire, étude quotidienne.", c: "from-amber-400 to-orange-500" },
            ].map(({ href, icon: Icon, t, d, c }) => (
              <Link key={t} href={href} className="group flex items-center gap-4 rounded-[1.5rem] border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-lg">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white ${c}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold">{t}</span>
                  <span className="block text-sm text-muted">{d}</span>
                </span>
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="container-page">
        <div className="mesh-dark rounded-[2.5rem] p-8 text-white sm:p-12">
          <h2 className="max-w-3xl text-4xl font-extrabold">Ce qui nous rend uniques</h2>
          <p className="mt-4 max-w-3xl text-lg text-white/75">
            Il existe des milliers de cours de Torah en ligne, et c&apos;est une richesse. Mais la véritable étude, celle qui transforme
            profondément, c&apos;est celle où l&apos;élève peut :
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, t: "Poser ses questions" },
              { icon: MessageCircle, t: "Exprimer ses doutes" },
              { icon: HeartHandshake, t: "Recevoir une réponse personnalisée" },
              { icon: TrendingUp, t: "Échanger et progresser" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="glass rounded-3xl p-5">
                <Icon className="h-6 w-6 text-brand-300" />
                <p className="mt-3 font-bold">{t}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 font-display text-2xl font-extrabold sm:text-3xl">
            Nous ne proposons pas seulement d&apos;écouter la Torah. <span className="text-gradient">Nous vous offrons de l&apos;étudier, de l&apos;intérioriser et de la vivre.</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/enseignants" className={btn.light}>Trouver mon enseignant <ArrowRight className="h-5 w-5" /></Link>
            <Link href="/comment-ca-marche" className={btn.ghostLight}>Découvrir comment ça marche</Link>
          </div>
        </div>
      </section>
    </>
  );
}
