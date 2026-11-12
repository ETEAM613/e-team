"use client";

import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";

/**
 * Formulaire temporaire : affiche un message tant que la base de données
 * (comptes, messagerie, paiements) n'est pas encore branchée.
 */
export default function DemoForm({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {children}
      {sent && (
        <p className="mt-4 flex gap-2 rounded-2xl bg-brand-50 p-3 text-sm text-brand-700" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Aperçu : cette action sera activée à la prochaine étape (comptes et base de données).
        </p>
      )}
    </form>
  );
}
