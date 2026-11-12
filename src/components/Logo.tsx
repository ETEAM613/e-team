import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="e-team, accueil">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gold-400 text-ink">
        {/* Livre ouvert stylisé */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5Z" />
          <path d="M12 6v13" />
        </svg>
      </span>
      <span className={`whitespace-nowrap text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        e-team
        <span className={`ml-2 hidden text-xs font-semibold sm:inline ${light ? "text-navy-200" : "text-muted"}`}>
          La Torah Connectée
        </span>
      </span>
    </Link>
  );
}
