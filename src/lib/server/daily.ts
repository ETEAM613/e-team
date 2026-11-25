import "server-only";

// Vidéo des cours via Daily (https://www.daily.co).
// Variable d'environnement : DAILY_API_KEY. Sans clé, la vidéo e-team n'est pas proposée.

const API = "https://api.daily.co/v1";

export const dailyEnabled = () => !!process.env.DAILY_API_KEY;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}`, "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Daily ${path} : ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Salle privée d'un cours : ouverte 15 min avant, fermée 30 min après la fin prévue. */
export async function ensureRoom(lessonId: string, startsAt: Date, durationMin: number): Promise<{ name: string; url: string }> {
  const name = `eteam-${lessonId.replace(/-/g, "").slice(0, 20)}`;
  const nbf = Math.floor(startsAt.getTime() / 1000) - 15 * 60;
  const exp = Math.floor(startsAt.getTime() / 1000) + (durationMin + 30) * 60;
  try {
    return await call<{ name: string; url: string }>(`/rooms/${name}`);
  } catch {
    return call<{ name: string; url: string }>("/rooms", {
      method: "POST",
      body: JSON.stringify({
        name,
        privacy: "private",
        properties: { nbf, exp, eject_at_room_exp: true, enable_chat: true, enable_screenshare: true, lang: "fr", max_participants: 6 },
      }),
    });
  }
}

/** Jeton d'accès nominatif à la salle (le Rav est « propriétaire »). */
export async function meetingToken(roomName: string, userName: string, isOwner: boolean, expiresAt: Date) {
  const { token } = await call<{ token: string }>("/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: { room_name: roomName, user_name: userName, is_owner: isOwner, exp: Math.floor(expiresAt.getTime() / 1000) },
    }),
  });
  return token;
}

/** Durée réelle (minutes) pendant laquelle au moins 2 personnes étaient ensemble dans la salle. */
export async function videoMinutes(roomName: string): Promise<number | null> {
  const { data } = await call<{ data: { participants: { join_time: number; duration: number }[] }[] }>(
    `/meetings?room=${encodeURIComponent(roomName)}&limit=20`,
  );
  if (!data?.length) return null;
  // On mesure le chevauchement des présences (élève et Rav ensemble)
  const events: [number, number][] = [];
  for (const m of data) for (const p of m.participants ?? []) events.push([p.join_time, +1], [p.join_time + p.duration, -1]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let count = 0;
  let together = 0;
  let since = 0;
  for (const [t, d] of events) {
    if (count >= 2) together += t - since;
    count += d;
    since = t;
  }
  return Math.round(together / 60);
}
