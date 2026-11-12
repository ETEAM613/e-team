import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <p className="text-6xl font-extrabold text-gold-400">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">Cette page arrive bientôt</h1>
      <p className="mt-3 max-w-md text-muted">La page que vous cherchez n&apos;existe pas encore ou a été déplacée.</p>
      <Link href="/" className="mt-8 rounded-xl bg-ink px-6 py-3 font-bold text-white hover:bg-navy-700">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
