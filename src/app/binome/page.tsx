import type { Metadata } from "next";
import { Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import AudienceGate from "@/components/AudienceGate";
import BinomeBoard from "./BinomeBoard";

export const metadata: Metadata = { title: "Binôme — partenaire d'étude" };

export default function BinomePage() {
  return (
    <>
      <PageHero
        eyebrow="Binôme · gratuit entre pairs"
        title="Trouvez votre partenaire d'étude"
        text="Étudiez en havruta avec une personne de votre niveau, aux horaires qui vous conviennent. Réservé aux comptes vérifiés, hommes et femmes séparés."
        gradient="from-emerald-400 via-emerald-500 to-teal-600"
        icon={<Users className="h-7 w-7" />}
      />
      <div className="container-page py-10">
        <AudienceGate
          allowed={["homme", "femme"]}
          pickerTitle="Qui cherche un binôme ?"
          lockedTitle="Binôme réservé aux adultes"
          lockedText="Le Binôme met en relation des adultes vérifiés. Pour un enfant, choisissez un enseignant dans l'espace Enfants."
        >
          <BinomeBoard />
        </AudienceGate>
      </div>
    </>
  );
}
