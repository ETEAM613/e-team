"use client";

import { useActionState, useEffect } from "react";
import { Phone, Video } from "lucide-react";
import { startLesson } from "@/app/actions/lessons";
import type { CallMode } from "@/lib/data";

const LABELS: Record<CallMode, { label: string; sub: string; tone: string; icon: React.ReactNode }> = {
  video: { label: "Vidéo sur e-team", sub: "Directement dans le site", tone: "from-brand-500 to-indigo-700", icon: <Video className="h-6 w-6" /> },
  whatsapp: {
    label: "Appel WhatsApp",
    sub: "Ouvre WhatsApp, puis appuyez sur 📞",
    tone: "from-emerald-500 to-green-600",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    ),
  },
  phone: { label: "Appel téléphonique", sub: "Compose le numéro de l'enseignant", tone: "from-sky-500 to-blue-600", icon: <Phone className="h-6 w-6" /> },
};

/** Boutons « Commencer le cours » : enregistre le début, puis ouvre la vidéo, WhatsApp ou le téléphone. */
export default function StartPanel({ lessonId, modes }: { lessonId: string; modes: CallMode[] }) {
  const [state, action, pending] = useActionState(startLesson, undefined);

  useEffect(() => {
    if (state?.href) window.location.href = state.href;
  }, [state]);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="lesson" value={lessonId} />
      <p className="font-extrabold">Commencer le cours :</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {modes.map((m) => (
          <button
            key={m}
            name="mode"
            value={m}
            disabled={pending}
            className={`flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br p-4 text-left text-white shadow-lg transition hover:brightness-110 disabled:opacity-60 ${LABELS[m].tone}`}
          >
            {LABELS[m].icon}
            <span className="font-extrabold">{LABELS[m].label}</span>
            <span className="text-xs text-white/80">{LABELS[m].sub}</span>
          </button>
        ))}
      </div>
      {state?.error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{state.error}</p>}
    </form>
  );
}
