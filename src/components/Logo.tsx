import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="e-team, accueil">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-pink-500 text-white shadow-lg shadow-brand-500/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5Z" />
          <path d="M12 6v13" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
      </span>
      <span className="leading-none">
        <span className={`font-display block whitespace-nowrap text-xl font-extrabold ${light ? "text-white" : "text-ink"}`}>e-team</span>
        <span className={`hidden whitespace-nowrap text-[11px] font-semibold sm:block ${light ? "text-white/60" : "text-muted"}`}>
          La Torah Connectée
        </span>
      </span>
    </Link>
  );
}
