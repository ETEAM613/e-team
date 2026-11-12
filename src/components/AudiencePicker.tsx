"use client";

import { Baby, User, UserRound, Sparkles } from "lucide-react";
import { AUDIENCES, type Audience } from "@/lib/data";
import { setAudience, useAudience } from "@/lib/audience";

const ICONS: Record<Audience, { icon: typeof User; tone: string }> = {
  homme: { icon: User, tone: "from-violet-500 to-indigo-600" },
  femme: { icon: UserRound, tone: "from-pink-500 to-rose-500" },
  garcon: { icon: Baby, tone: "from-sky-500 to-blue-600" },
  fille: { icon: Sparkles, tone: "from-amber-400 to-orange-500" },
};

/** Grande sélection « Pour qui est le cours ? » */
export default function AudiencePicker({
  allowed,
  title = "Pour qui cherchez-vous un cours ?",
  subtitle = "Les enseignants affichés dépendent de votre réponse : séparation stricte hommes / femmes.",
}: {
  allowed?: Audience[];
  title?: string;
  subtitle?: string;
}) {
  const current = useAudience();
  const options = AUDIENCES.filter((a) => !allowed || allowed.includes(a.value));

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-muted">{subtitle}</p>
      <div className={`mt-6 grid gap-3 ${options.length > 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
        {options.map((a) => {
          const { icon: Icon, tone } = ICONS[a.value];
          const active = current === a.value;
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => setAudience(a.value)}
              className={`group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                active ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white ${tone}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold">{a.label}</span>
                <span className="block text-sm text-muted">{a.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Petit sélecteur compact affiché au-dessus des résultats. */
export function AudienceSwitch() {
  const current = useAudience();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-muted">Pour :</span>
      {AUDIENCES.map((a) => (
        <button
          key={a.value}
          type="button"
          onClick={() => setAudience(a.value)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
            current === a.value ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink"
          }`}
        >
          {a.short}
        </button>
      ))}
    </div>
  );
}
