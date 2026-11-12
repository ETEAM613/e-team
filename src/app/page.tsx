import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Compass,
  Gift,
  HandCoins,
  Heart,
  HeartHandshake,
  Mail,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { AUDIENCES, FAQ, SUBJECTS, TESTIMONIALS, TRANSPARENCY } from "@/lib/data";
import ModulesGrid from "@/components/ModulesGrid";
import { btn, eyebrow } from "@/components/ui";

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="mesh-dark relative overflow-hidden text-white">
        <div className="container-page grid items-center gap-14 pb-24 pt-14 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-20">
          <div>
            <p className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
              <Gift className="h-4 w-4 text-amber-300" /> Votre premier cours est offert
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[0.98] sm:text-7xl">
              Son Rav, son moment, <span className="text-gradient">son étude.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Étudiez la Torah en direct avec un Rav ou une enseignante vérifiés. Cours particuliers, cours en direct gratuits,
              SOS en 1:1 et binômes d&apos;étude.
            </p>

            <form action="/enseignants" className="mt-9 flex flex-col gap-2 rounded-[1.75rem] bg-white p-2 text-ink shadow-2xl shadow-brand-900/40 sm:flex-row">
              <label className="flex flex-1 flex-col rounded-2xl px-4 py-2 hover:bg-surface">
                <span className="text-xs font-bold text-muted">Je veux étudier</span>
                <select name="matiere" className="bg-transparent font-bold outline-none" defaultValue="">
                  <option value="">Toutes les matières</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <div className="hidden w-px bg-line sm:block" />
              <label className="flex flex-1 flex-col rounded-2xl px-4 py-2 hover:bg-surface">
                <span className="text-xs font-bold text-muted">Pour qui ?</span>
                <select name="pour" className="bg-transparent font-bold outline-none" defaultValue="">
                  <option value="" disabled>Choisir…</option>
                  {AUDIENCES.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </label>
              <button className={`${btn.primary} !py-4 sm:!px-8`}>
                <Search className="h-5 w-5" /> Rechercher
              </button>
            </form>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
              <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand-300" /> Enseignants vérifiés</li>
              <li className="flex items-center gap-2"><Video className="h-4 w-4 text-brand-300" /> Lien Meet automatique</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-300" /> Hommes et femmes séparés</li>
            </ul>
          </div>

          {/* Visuel : cartes flottantes */}
          <div className="relative mx-auto hidden h-[460px] w-full max-w-md sm:block lg:max-w-none" aria-hidden>
            <div className="absolute inset-x-6 top-0 rounded-[2rem] bg-white p-6 text-ink shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-extrabold">Ma semaine d&apos;étude</p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">3 cours</span>
              </div>
              <div className="mt-5 grid grid-cols-5 gap-2 text-center text-sm">
                {["Dim", "Lun", "Mar", "Mer", "Jeu"].map((d, i) => (
                  <div
                    key={d}
                    className={`rounded-2xl py-3 font-bold ${
                      i === 1 ? "bg-brand-500 text-white" : i === 3 ? "bg-pink-100 text-pink-700" : "bg-surface"
                    }`}
                  >
                    {d}
                    <span className="mt-1 block text-xs font-semibold opacity-80">{["—", "20:30", "—", "07:15", "—"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-surface p-4">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Cours confirmé — lundi 20:30
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Video className="h-4 w-4" /> Lien Google Meet créé automatiquement</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted"><Mail className="h-4 w-4" /> Envoyé par e-mail à l&apos;élève et à l&apos;enseignant</p>
              </div>
            </div>

            <div className="animate-float absolute -left-2 top-[300px] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink shadow-xl sm:-left-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
                <Zap className="h-5 w-5 fill-white" />
              </span>
              <div className="text-sm">
                <p className="font-bold">SOS · 5 enseignants</p>
                <p className="flex items-center gap-1.5 text-muted"><span className="live-dot !h-1.5 !w-1.5" /> disponibles maintenant</p>
              </div>
            </div>

            <div className="animate-float absolute -right-2 top-[370px] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink shadow-xl [animation-delay:1.5s] sm:-right-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-600 text-white">
                <Radio className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold">Cours en direct · gratuit</p>
                <p className="text-muted">Ce soir 20:30 · 38 inscrits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 MODULES */}
      <section className="container-page relative -mt-14 lg:-mt-20">
        <ModulesGrid />
      </section>

      {/* BINÔME */}
      <section className="container-page mt-4">
        <Link
          href="/binome"
          className="group flex flex-col gap-6 rounded-[2rem] border border-line bg-white p-7 transition hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 sm:flex-row sm:items-center sm:p-9"
        >
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white">
            <Users className="h-8 w-8" />
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold sm:text-3xl">Binôme — trouvez votre partenaire d&apos;étude</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Gratuit</span>
            </div>
            <p className="mt-1 text-muted">Étudiez en havruta avec une personne de votre niveau. Réservé aux comptes vérifiés.</p>
          </div>
          <span className="inline-flex items-center gap-2 font-bold text-emerald-700">
            Voir les binômes <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      {/* PARCOURS */}
      <section className="container-page py-24">
        <p className={eyebrow}>Comment ça marche</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">De la découverte à votre premier cours, en 4 étapes</h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Compass, t: "Explorez", d: "Parcourez les enseignants et les cours librement, sans créer de compte.", c: "from-brand-400 to-brand-600" },
            { icon: CalendarCheck, t: "Réservez", d: "Inscription en un clic avec Google ou un formulaire très court.", c: "from-sky-400 to-blue-600" },
            { icon: Gift, t: "Essai gratuit", d: "1er cours offert. Pas convaincu ? Un 2e essai gratuit avec un autre enseignant.", c: "from-pink-400 to-rose-500" },
            { icon: HandCoins, t: "Votre choix", d: "Sponsorisez vos cours, ou demandez un sponsoring si vous en avez besoin.", c: "from-amber-400 to-orange-500" },
          ].map(({ icon: Icon, t, d, c }, i) => (
            <li key={t} className="relative rounded-3xl border border-line bg-white p-7">
              <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-surface">{i + 1}</span>
              <span className={`relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white ${c}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="relative mt-6 text-xl font-extrabold">{t}</h3>
              <p className="relative mt-2 leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SPONSORING : CHOIX A / B */}
      <section className="mesh-light border-y border-line py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrow}>Après votre essai</p>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Personne ne reste sans étudier</h2>
            <p className="mt-4 text-lg text-muted">
              Chacun choisit : soutenir l&apos;étude, ou être soutenu. Dans les deux cas, vous continuez avec votre enseignant.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/40 blur-3xl" aria-hidden />
              <span className="relative inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20">Option A</span>
              <h3 className="relative mt-5 text-3xl font-extrabold">Je sponsorise</h3>
              <p className="relative mt-3 text-white/75">
                Vous financez vos propres cours et faites vivre la plateforme. Une seule facture par mois, selon les cours suivis.
              </p>
              <ul className="relative mt-6 space-y-3">
                {["Facturation mensuelle sécurisée", "Accès aux cours particuliers et au SOS", "« Vous avez sponsorisé 12 cours ! »"].map((x) => (
                  <li key={x} className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" /> {x}</li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 p-8 text-white sm:p-10">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold ring-1 ring-white/30">Option B</span>
              <h3 className="mt-5 text-3xl font-extrabold">Je demande un sponsoring</h3>
              <p className="mt-3 text-white/85">
                Les moyens ne doivent jamais empêcher d&apos;étudier. Envoyez votre demande : l&apos;équipe répond sous 24 h.
              </p>
              <ul className="mt-6 space-y-3">
                {["Demande confidentielle avec justificatif", "Réponse de l'équipe sous 24 h", "10 cours offerts par la cagnotte de dons"].map((x) => (
                  <li key={x} className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0" /> {x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section className="container-page py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className={eyebrow}>Dons & transparence</p>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">100 % des dons vont aux élèves</h2>
            <p className="mt-4 text-lg text-muted">
              Chaque don alimente la cagnotte qui finance les cours des élèves sponsorisés. Les comptes sont publics, mis à jour chaque mois.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/don" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-bold text-white shadow-lg shadow-pink-500/30 hover:brightness-110">
                <Heart className="h-5 w-5 fill-white" /> Faire un don
              </Link>
              <Link href="/transparence" className={btn.outline}>Voir le tableau de transparence</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: eur.format(TRANSPARENCY.collected), l: "collectés depuis le lancement", c: "from-brand-500 to-indigo-700" },
              { v: String(TRANSPARENCY.sponsoredStudents), l: "élèves sponsorisés", c: "from-pink-500 to-rose-500" },
              { v: TRANSPARENCY.fundedLessons.toLocaleString("fr-FR"), l: "cours financés", c: "from-teal-400 to-sky-600" },
              { v: String(TRANSPARENCY.donors), l: "donateurs", c: "from-amber-400 to-orange-500" },
            ].map((s) => (
              <div key={s.l} className={`rounded-3xl bg-gradient-to-br p-6 text-white ${s.c}`}>
                <p className="font-display text-3xl font-extrabold sm:text-4xl">{s.v}</p>
                <p className="mt-1 text-sm text-white/85">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="container-page">
        <div className="mesh-dark overflow-hidden rounded-[2.5rem] px-7 py-14 text-white sm:px-14">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-extrabold sm:text-5xl">
                Ne pas seulement écouter la Torah. <span className="text-gradient">L&apos;étudier, l&apos;intérioriser, la vivre.</span>
              </h2>
              <p className="mt-6 text-lg text-white/75">
                La véritable étude, celle qui transforme, c&apos;est la relation de maître à élève. Même à distance, e-team la recrée.
              </p>
              <Link href="/a-propos" className={`${btn.light} mt-8`}>
                Qui sommes-nous ? <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Sparkles, t: "Poser ses questions", d: "Chaque question reçoit sa réponse." },
                { icon: HeartHandshake, t: "Exprimer ses doutes", d: "Un espace de confiance, sans jugement." },
                { icon: Star, t: "Une réponse personnalisée", d: "Un enseignant dédié qui vous connaît." },
                { icon: Users, t: "Échanger et progresser", d: "Un suivi régulier pour avancer vraiment." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="glass rounded-3xl p-5">
                  <Icon className="h-6 w-6 text-brand-300" />
                  <p className="mt-3 font-bold">{t}</p>
                  <p className="mt-1 text-sm text-white/65">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="container-page py-24">
        <p className={eyebrow}>Témoignages</p>
        <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Ils étudient avec e-team</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.name} className={`flex flex-col rounded-3xl p-7 ${i === 1 ? "bg-brand-500 text-white" : "border border-line bg-white"}`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed">« {t.text} »</blockquote>
              <figcaption className={`mt-6 text-sm font-bold ${i === 1 ? "text-white/80" : "text-muted"}`}>{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className={eyebrow}>FAQ</p>
          <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Questions fréquentes</h2>
          <p className="mt-4 text-muted">Une autre question ? <Link href="/contact" className="font-bold text-brand-600 hover:underline">Écrivez-nous</Link>.</p>
        </div>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-3xl border border-line bg-white px-6 py-5 open:border-brand-200 open:shadow-lg open:shadow-brand-500/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface transition group-open:rotate-180 group-open:bg-brand-500 group-open:text-white">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-page mt-24 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-500 to-indigo-700 p-9 text-white">
          <h2 className="text-3xl font-extrabold">Prêt à commencer ?</h2>
          <p className="mt-2 text-white/80">Fixez votre créneau. Trouvez votre enseignant. Entamez votre parcours.</p>
          <Link href="/enseignants" className={`${btn.light} mt-7`}>
            Mon premier cours gratuit <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="rounded-[2rem] border border-line bg-white p-9">
          <h2 className="text-3xl font-extrabold">Vous enseignez la Torah ?</h2>
          <p className="mt-2 text-muted">Rejoignez e-team : réservations, rappels et liens de cours sont gérés pour vous.</p>
          <Link href="/devenir-enseignant" className={`${btn.dark} mt-7`}>
            Devenir enseignant <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
