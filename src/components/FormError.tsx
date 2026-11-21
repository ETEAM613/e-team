import { CheckCircle2, CircleAlert } from "lucide-react";

/** Message d'erreur ou de confirmation renvoyé par un formulaire serveur. */
export default function FormError({ state }: { state: { error?: string; ok?: string } | undefined }) {
  if (state?.error)
    return (
      <p className="flex gap-2 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700" role="alert">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
      </p>
    );
  if (state?.ok)
    return (
      <p className="flex gap-2 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700" role="status">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {state.ok}
      </p>
    );
  return null;
}
