"use client";

import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";

/**
 * Formulaire temporaire : affiche un message tant que la base de données
 * (comptes, messagerie) n'est pas encore branchée.
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
        <p className="mt-4 flex gap-2 rounded-xl bg-navy-50 p-3 text-sm text-navy-700" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Aperçu : les comptes et l&apos;envoi seront activés à la prochaine étape (base de données).
        </p>
      )}
    </form>
  );
}

export const inputCls =
  "w-full rounded-xl border-2 border-line bg-white px-4 py-3 font-medium text-ink outline-none transition placeholder:text-muted/60 focus:border-ink";
