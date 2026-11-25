// Outils de fuseaux horaires, sans bibliothèque (utilisés côté serveur et navigateur).
// Les cours sont toujours enregistrés en UTC ; chacun les voit dans son propre fuseau.

export const TIMEZONES = [
  { value: "Europe/Paris", label: "France (Paris)" },
  { value: "Asia/Jerusalem", label: "Israël (Jérusalem)" },
  { value: "Europe/Brussels", label: "Belgique (Bruxelles)" },
  { value: "Europe/Zurich", label: "Suisse (Genève)" },
  { value: "America/Montreal", label: "Canada (Montréal)" },
  { value: "Europe/London", label: "Royaume-Uni (Londres)" },
  { value: "America/New_York", label: "États-Unis (New York)" },
] as const;

export const isTimezone = (tz: string) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/** Tranches de la journée affichées dans les agendas. */
export const BANDS = [
  { key: "matin", label: "Matin", from: 6, to: 12 },
  { key: "apres-midi", label: "Après-midi", from: 12, to: 18 },
  { key: "soir", label: "Soir", from: 18, to: 24 },
  { key: "nuit", label: "Nuit", from: 0, to: 6 },
] as const;

export const bandOf = (hour: number) => BANDS.find((b) => hour >= b.from && hour < b.to)!;

/** Composantes de date/heure d'un instant dans un fuseau donné. weekday : 0 = dimanche. */
export function zonedParts(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")) % 24,
    minute: Number(get("minute")),
    weekday: weekdays.indexOf(get("weekday")),
  };
}

/** Instant UTC correspondant à une heure « murale » dans un fuseau (gère l'heure d'été). */
export function zonedToUtc(year: number, month: number, day: number, hour: number, minute: number, tz: string): Date {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  let guess = wall;
  for (let i = 0; i < 2; i++) {
    const p = zonedParts(new Date(guess), tz);
    const seen = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
    guess += wall - seen;
  }
  return new Date(guess);
}
