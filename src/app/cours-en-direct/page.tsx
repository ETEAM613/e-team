import type { Metadata } from "next";
import { Radio } from "lucide-react";
import PageHero from "@/components/PageHero";
import LiveSchedule from "./LiveSchedule";

export const metadata: Metadata = { title: "Cours en direct" };

export default function LivePage() {
  return (
    <>
      <PageHero
        eyebrow="Cours en direct · 100 % gratuit"
        title="Des cours de groupe, chaque jour"
        text="Programmés jusqu'à 7 jours à l'avance et validés par l'équipe e-team. Inscrivez-vous gratuitement, le lien vous est envoyé par e-mail."
        gradient="from-teal-400 via-cyan-500 to-sky-600"
        icon={<Radio className="h-7 w-7" />}
      />
      <div className="container-page py-10">
        <LiveSchedule />
      </div>
    </>
  );
}
