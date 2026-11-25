"use client";

/** Affiche une date dans le fuseau horaire du navigateur du visiteur. */
export default function LocalTime({ iso, mode = "full" }: { iso: string; mode?: "full" | "time" | "day" }) {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions =
    mode === "time"
      ? { hour: "2-digit", minute: "2-digit" }
      : mode === "day"
        ? { weekday: "long", day: "numeric", month: "long" }
        : { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" };
  return (
    <time dateTime={iso} suppressHydrationWarning className="first-letter:uppercase">
      {new Intl.DateTimeFormat("fr-FR", opts).format(d)}
    </time>
  );
}
