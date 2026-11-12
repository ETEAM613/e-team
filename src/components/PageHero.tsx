import type { ReactNode } from "react";

/** En-tête coloré commun aux pages intérieures. */
export default function PageHero({
  eyebrow,
  title,
  text,
  gradient = "from-brand-500 via-brand-600 to-indigo-700",
  icon,
  children,
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  gradient?: string;
  icon?: ReactNode;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className="container-page pt-6">
      <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br px-7 py-12 sm:px-12 sm:py-16 ${gradient} ${dark ? "text-ink" : "text-white"}`}>
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-black/10 blur-3xl" aria-hidden />
        <div className="relative max-w-3xl">
          {icon && (
            <span className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl ring-1 ${dark ? "bg-white/40 ring-white/50" : "bg-white/15 ring-white/25"}`}>
              {icon}
            </span>
          )}
          {eyebrow && <p className={`text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-ink/60" : "text-white/70"}`}>{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.02] sm:text-6xl">{title}</h1>
          {text && <p className={`mt-5 max-w-2xl text-lg ${dark ? "text-ink/75" : "text-white/85"}`}>{text}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
