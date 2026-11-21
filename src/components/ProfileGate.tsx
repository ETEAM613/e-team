"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { Gender } from "@/lib/data";
import { useGender } from "@/lib/profile";
import { btn } from "./ui";

/**
 * Masque un contenu pour les comptes d'un certain genre (ex. l'espace Femmes pour un compte homme).
 * Avant l'inscription, tout est visible. Aperçu : à l'étape 2, ce contrôle sera fait par le serveur.
 */
export default function ProfileGate({ hideFor, children }: { hideFor: Gender[]; children: ReactNode }) {
  const gender = useGender();

  if (gender && hideFor.includes(gender)) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center">
        <h2 className="text-2xl font-extrabold">Cette page n&apos;est pas disponible</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">Découvrez les enseignants et les cours proposés pour vous.</p>
        <Link href="/enseignants" className={`${btn.primary} mt-6`}>Voir les enseignants</Link>
      </div>
    );
  }

  return <>{children}</>;
}
