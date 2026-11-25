"use client";

import { useActionState } from "react";
import { Zap } from "lucide-react";
import { launchSos } from "@/app/actions/sos";
import FormError from "@/components/FormError";
import { input } from "@/components/ui";

export default function LaunchSosForm() {
  const [state, action, pending] = useActionState(launchSos, undefined);
  return (
    <form action={action} className="space-y-4">
      <textarea
        name="question"
        required
        minLength={5}
        maxLength={1000}
        rows={4}
        placeholder="Ex. : J'ai une question de Halakha sur Chabbat que je dois régler avant ce soir."
        className={input}
      />
      <FormError state={state} />
      <button
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 disabled:opacity-60"
      >
        <Zap className="h-5 w-5 fill-white" /> {pending ? "Envoi…" : "Lancer le SOS"}
      </button>
    </form>
  );
}
