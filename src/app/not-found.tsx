import Link from "next/link";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <p className="text-gradient font-display text-8xl font-extrabold">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">Cette page arrive bientôt</h1>
      <p className="mt-3 max-w-md text-muted">La page que vous cherchez n&apos;existe pas encore ou a été déplacée.</p>
      <Link href="/" className={`${btn.primary} mt-8`}>Retour à l&apos;accueil</Link>
    </div>
  );
}
