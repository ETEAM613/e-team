import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Search,
  Video,
  Star,
  MessageCircle,
  HelpCircle,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  Mail,
  ChevronDown,
} from "lucide-react";
import { FAQ, SPACES, SUBJECTS, TEACHERS, TESTIMONIALS } from "@/lib/data";
import Avatar from "@/components/Avatar";

const SPACE_STYLE: Record<string, string> = {
  hommes: "bg-navy-700 text-white",
  femmes: "bg-gold-300 text-ink",
  enfants: "bg-[#f4c9b3] text-ink",
};

export default function Home() {
  const featured = TEACHERS.filter((t) => t.superTeacher).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="container-page grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Des enseignants disponibles aujourd&apos;hui
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Son Rav, son moment,{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">son étude.</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-4 rounded bg-gold-300 sm:h-5" aria-hidden />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Étudiez la Torah en direct avec un Rav ou une enseignante qualifiée, en cours particulier ou en havruta,
            à votre rythme et quel que soit votre niveau.
          </p>

          <form action="/enseignants" className="mt-8 flex flex-col gap-2 rounded-2xl border-2 border-ink bg-white p-2 shadow-[6px_6px_0_0_var(--color-ink)] sm:flex-row">
            <label className="flex flex-1 flex-col px-3 py-1.5">
              <span className="text-xs font-bold text-muted">Je veux étudier</span>
              <select name="matiere" className="bg-transparent font-semibold text-ink outline-none" defaultValue="">
                <option value="">Toutes les matières</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <div className="hidden w-px bg-line sm:block" />
            <label className="flex flex-1 flex-col px-3 py-1.5">
              <span className="text-xs font-bold text-muted">Espace</span>
              <select name="espace" className="bg-transparent font-semibold text-ink outline-none" defaultValue="">
                <option value="">Tous les espaces</option>
                {SPACES.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </select>
            </label>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-6 py-3 font-bold text-ink transition hover:bg-gold-300">
              <Search className="h-5 w-5" /> Trouver
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-sm text-muted">
            <div className="flex -space-x-2">
              {TEACHERS.slice(0, 4).map((t) => (
                <Avatar key={t.id} name={t.name} color={t.color} size={32} className="rounded-full ring-2 ring-cream" />
              ))}
            </div>
            <span>
              <strong className="text-ink">4,9/5</strong> de moyenne sur plus de 600 avis d&apos;élèves
            </span>
          </div>
        </div>

        {/* Visuel : aperçu d'un cours confirmé */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-3xl bg-gold-300" aria-hidden />
          <div className="relative rounded-3xl border-2 border-ink bg-white p-6">
            <div className="flex items-center gap-4">
              <Avatar name={TEACHERS[0].name} color={TEACHERS[0].color} size={64} />
              <div>
                <p className="font-extrabold">{TEACHERS[0].name}</p>
                <p className="text-sm text-muted">Guemara · Baba Metsia</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> 4,9 <span className="font-normal text-muted">(128 avis)</span>
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 text-center text-sm">
              {["Dim 15", "Lun 16", "Mar 17", "Mer 18"].map((d, i) => (
                <div key={d} className={`rounded-xl border-2 py-2 font-bold ${i === 1 ? "border-ink bg-ink text-white" : "border-line"}`}>
                  {d}
                  <span className={`block text-xs font-semibold ${i === 1 ? "text-gold-300" : "text-muted"}`}>
                    {["20:00", "20:30", "21:00", "07:00"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-navy-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-navy-700">
                <CheckCircle2 className="h-5 w-5 text-green-600" /> Cours confirmé — lundi 16 à 20:30
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                <Video className="h-4 w-4" /> Lien Google Meet créé automatiquement
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <Mail className="h-4 w-4" /> Envoyé par e-mail à l&apos;élève et au Rav
              </p>
            </div>
          </div>
          <div className="absolute -bottom-8 left-4 flex items-center gap-3 rounded-2xl border-2 border-ink bg-white px-4 py-3 shadow-[4px_4px_0_0_var(--color-ink)]">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-100">
              <MessageCircle className="h-5 w-5 text-gold-700" />
            </span>
            <div className="text-sm">
              <p className="font-bold">Nouveau message</p>
              <p className="text-muted">« À ce soir pour notre havruta ! »</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section className="border-y border-line bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-4">
          {[
            ["120+", "enseignants qualifiés"],
            ["14", "matières de Torah"],
            ["3", "espaces : Hommes, Femmes, Enfants"],
            ["4,9 ★", "note moyenne des cours"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-3xl font-extrabold text-ink">{n}</p>
              <p className="mt-1 text-sm text-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ESPACES */}
      <section className="container-page py-20">
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">Un espace adapté à chacun</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Pas de cours impersonnels : des rencontres vivantes, de vrais moments d&apos;étude connectés mais humains.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SPACES.map((s) => (
            <Link
              key={s.slug}
              href={`/espaces/${s.slug}`}
              className={`group flex flex-col rounded-3xl p-7 transition hover:-translate-y-1 ${SPACE_STYLE[s.slug]}`}
            >
              <h3 className="text-2xl font-extrabold">{s.title}</h3>
              <p className="mt-2 font-semibold opacity-80">{s.tagline}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm font-medium">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 font-bold">
                Découvrir <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="bg-sand py-20">
        <div className="container-page">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Comment ça marche ?</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "1. Trouvez votre enseignant",
                text: "Filtrez par matière, espace, langue, horaires et budget. Consultez les profils, les avis et les disponibilités.",
              },
              {
                icon: CalendarCheck,
                title: "2. Fixez votre créneau",
                text: "Réservez un cours d'essai de 25 minutes en quelques clics. Vous recevez la confirmation par e-mail.",
              },
              {
                icon: Video,
                title: "3. Étudiez en direct",
                text: "Le lien Google Meet est créé automatiquement et envoyé à chacun. Un rappel vous est envoyé avant le cours.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border-2 border-ink bg-white p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400">
                  <Icon className="h-6 w-6 text-ink" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENSEIGNANTS EN VEDETTE */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Nos enseignants recommandés</h2>
            <p className="mt-3 text-lg text-muted">Des Rabbanim, Avrekhim et enseignantes engagés dans la transmission.</p>
          </div>
          <Link href="/enseignants" className="inline-flex items-center gap-2 font-bold text-ink underline-offset-4 hover:underline">
            Voir tous les enseignants <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((t) => (
            <Link
              key={t.id}
              href={`/enseignants/${t.id}`}
              className="group rounded-3xl border border-line bg-white p-6 transition hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]"
            >
              <Avatar name={t.name} color={t.color} size={72} />
              <p className="mt-4 text-lg font-extrabold">{t.name}</p>
              <p className="text-sm text-muted">{t.title}</p>
              <p className="mt-3 font-semibold">{t.headline}</p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                <span className="flex items-center gap-1 font-bold">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> {t.rating.toFixed(1).replace(".", ",")}
                  <span className="font-normal text-muted">({t.reviews})</span>
                </span>
                <span className="font-bold">{t.price} € <span className="font-normal text-muted">/ 50 min</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CE QUI NOUS REND UNIQUES */}
      <section className="bg-ink py-20 text-white">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Ne pas seulement écouter la Torah. <span className="text-gold-300">L&apos;étudier, l&apos;intérioriser, la vivre.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-navy-100">
              Il existe des milliers de cours de Torah en ligne, et c&apos;est une richesse. Mais la véritable étude, celle qui
              transforme, c&apos;est la relation de maître à élève. Même à distance, e-team la recrée.
            </p>
            <Link href="/a-propos" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3 font-bold text-ink hover:bg-gold-300">
              Qui sommes-nous ? <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: HelpCircle, t: "Poser ses questions", d: "Chaque question compte et reçoit sa réponse." },
              { icon: MessageCircle, t: "Exprimer ses doutes", d: "Un espace de confiance, sans jugement." },
              { icon: HeartHandshake, t: "Une réponse personnalisée", d: "Un enseignant dédié qui vous connaît." },
              { icon: TrendingUp, t: "Échanger et progresser", d: "Un suivi régulier pour avancer vraiment." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <Icon className="h-6 w-6 text-gold-300" />
                <p className="mt-3 font-bold">{t}</p>
                <p className="mt-1 text-sm text-navy-200">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="container-page py-20">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Ils étudient avec e-team</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-line">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink">« {t.text} »</blockquote>
              <figcaption className="mt-5 text-sm font-bold text-muted">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* DEVENIR ENSEIGNANT */}
      <section className="container-page">
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-gold-300 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">Vous enseignez la Torah ?</h2>
            <p className="mt-4 max-w-xl text-lg text-ink/80">
              Rejoignez e-team, fixez vos horaires et vos tarifs, et transmettez à des élèves motivés du monde entier.
              Réservations, rappels et liens de cours sont gérés automatiquement.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <Link href="/devenir-enseignant" className="inline-flex items-center gap-2 rounded-xl bg-ink px-7 py-4 font-bold text-white hover:bg-navy-700">
              Devenir enseignant <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page max-w-3xl py-20">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Questions fréquentes</h2>
        <div className="mt-8 divide-y divide-line rounded-3xl border border-line bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
