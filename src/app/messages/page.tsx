import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { btn } from "@/components/ui";

export const metadata: Metadata = { title: "Messagerie" };

export default function MessagesPage() {
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-[1.75rem] bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-xl shadow-brand-500/30">
          <MessageCircle className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-4xl font-extrabold">Messagerie</h1>
        <p className="mt-3 max-w-md text-lg text-muted">
          Connectez-vous pour échanger avec vos enseignants et vos élèves. Vous êtes notifié par e-mail à chaque nouveau message.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/connexion" className={btn.dark}>Connexion</Link>
          <Link href="/inscription" className={btn.primary}>S&apos;inscrire</Link>
        </div>
      </div>
    </div>
  );
}
