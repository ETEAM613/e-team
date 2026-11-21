import Link from "next/link";
import { btn } from "./ui";

/** Affiché quand un contenu ne correspond pas au compte connecté. */
export default function Unavailable() {
  return (
    <div className="rounded-3xl border border-line bg-white p-10 text-center">
      <h2 className="text-2xl font-extrabold">Cette page n&apos;est pas disponible</h2>
      <p className="mx-auto mt-2 max-w-md text-muted">Découvrez les enseignants et les cours proposés pour vous.</p>
      <Link href="/enseignants" className={`${btn.primary} mt-6`}>Voir les enseignants</Link>
    </div>
  );
}
