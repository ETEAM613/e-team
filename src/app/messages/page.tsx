import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MessageCircle } from "lucide-react";
import { getTeacher } from "@/lib/data";

export const metadata: Metadata = { title: "Messagerie" };

type SP = Promise<{ to?: string }>;

async function Title({ searchParams }: { searchParams: SP }) {
  const { to } = await searchParams;
  const teacher = to ? getTeacher(to) : undefined;
  return <>{teacher ? `Écrire à ${teacher.name}` : "Messagerie"}</>;
}

export default function MessagesPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className="container-page grid place-items-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-gold-400">
        <MessageCircle className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold">
        <Suspense fallback="Messagerie">
          <Title searchParams={searchParams} />
        </Suspense>
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Connectez-vous pour échanger avec vos enseignants et vos élèves. Vous serez notifié par e-mail à chaque nouveau message.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/connexion" className="rounded-xl bg-ink px-6 py-3 font-bold text-white hover:bg-navy-700">Connexion</Link>
        <Link href="/inscription" className="rounded-xl border-2 border-ink px-6 py-3 font-bold hover:bg-white">S&apos;inscrire</Link>
      </div>
    </div>
  );
}
