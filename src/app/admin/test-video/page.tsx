import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/server/auth";
import { dailyEnabled, ensureRoom, meetingToken } from "@/lib/server/daily";
import { nowMs } from "@/lib/server/clock";
import { btn } from "@/components/ui";

export const metadata: Metadata = { title: "Test vidéo" };

/** Page réservée à l'admin : vérifie que la vidéo Daily fonctionne (salle de test de 30 min). */
export default async function TestVideoPage() {
  const admin = await requireAdmin();

  if (!dailyEnabled()) {
    return (
      <div className="container-page max-w-2xl py-12">
        <h1 className="text-3xl font-extrabold">Test vidéo</h1>
        <p className="mt-3 rounded-2xl bg-rose-50 p-4 font-semibold text-rose-700">
          La clé DAILY_API_KEY n&apos;est pas encore active sur le site. Vérifiez la variable dans hPanel, puis attendez la fin du redéploiement.
        </p>
      </div>
    );
  }

  let room: { url: string; token: string } | null = null;
  let error = "";
  try {
    const start = new Date(nowMs());
    // Une salle de test par tranche de 30 min (une salle expirée ne peut pas être réutilisée)
    const r = await ensureRoom(`test${Math.floor(start.getTime() / 1800000)}`, start, 30);
    const token = await meetingToken(r.name, `${admin.firstName} (test)`, true, new Date(start.getTime() + 60 * 60000));
    room = { url: r.url, token };
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <div className="container-page max-w-6xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Test vidéo</h1>
          <p className="mt-1 text-muted">Autorisez la caméra et le micro quand le navigateur le demande.</p>
        </div>
        <Link href="/admin" className={btn.outline}>Retour à l&apos;admin</Link>
      </div>
      {error ? (
        <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">Daily a refusé la connexion : {error}</p>
      ) : (
        room && (
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-ink">
            <iframe
              src={`${room.url}?t=${room.token}`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="h-[72vh] min-h-[480px] w-full"
              title="Test vidéo e-team"
            />
          </div>
        )
      )}
    </div>
  );
}
