"use client";

import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import type { Audience } from "@/lib/data";
import { setAudience, useAudience } from "@/lib/audience";
import AudiencePicker from "./AudiencePicker";

/**
 * Affiche le contenu seulement si le profil choisi y a accès.
 * Aperçu : à l'étape 2, ce contrôle sera fait par le serveur (compte connecté).
 */
export default function AudienceGate({
  allowed,
  children,
  lockedTitle = "Contenu non accessible",
  lockedText = "Ce contenu n'est pas visible avec votre profil actuel.",
  pickerTitle,
}: {
  allowed: Audience[];
  children: ReactNode;
  lockedTitle?: string;
  lockedText?: string;
  pickerTitle?: string;
}) {
  const audience = useAudience();

  if (!audience) return <AudiencePicker allowed={undefined} title={pickerTitle} />;

  if (!allowed.includes(audience)) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50">
          <Lock className="h-7 w-7 text-brand-500" />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold">{lockedTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">{lockedText}</p>
        <button onClick={() => setAudience(null)} className="mt-6 text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
          Changer de profil
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
