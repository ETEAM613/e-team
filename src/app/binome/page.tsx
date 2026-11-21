import type { Metadata } from "next";
import { Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import BinomeBoard from "./BinomeBoard";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Binôme — partenaire d'étude" };

export default async function BinomePage() {
  const user = await getCurrentUser();
  return (
    <>
      <PageHero
        eyebrow="Binôme · gratuit entre pairs"
        title="Trouvez votre partenaire d'étude"
        text="Étudiez en havruta avec une personne de votre niveau, aux horaires qui vous conviennent. Réservé aux comptes vérifiés."
        gradient="from-emerald-400 via-emerald-500 to-teal-600"
        icon={<Users className="h-7 w-7" />}
      />
      <div className="container-page py-10">
        <BinomeBoard gender={user?.gender ?? null} />
      </div>
    </>
  );
}
