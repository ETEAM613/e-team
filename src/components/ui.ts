// Classes réutilisables pour garder un style cohérent sur tout le site.

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-50",
  dark:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-ink-soft",
  light:
    "inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-ink transition hover:bg-brand-50",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-full border-2 border-line bg-white px-6 py-3 font-bold text-ink transition hover:border-ink",
  ghostLight:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10",
};

export const card = "rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgba(14,11,38,0.04)]";

export const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 font-medium text-ink outline-none transition placeholder:text-muted/60 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export const chip = "rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700";

export const eyebrow = "text-sm font-bold uppercase tracking-[0.14em] text-brand-500";
