import type { Metadata } from "next";
import { Zap } from "lucide-react";
import PageHero from "@/components/PageHero";
import SosBoard from "./SosBoard";

export const metadata: Metadata = { title: "SOS — un enseignant tout de suite" };

export default function SosPage() {
  return (
    <>
      <PageHero
        eyebrow="SOS · 1:1 instantané"
        title="Une question ? Un enseignant, maintenant."
        text="Halakha urgente, passage difficile, besoin de parler : connectez-vous en quelques secondes avec un enseignant disponible."
        gradient="from-rose-500 via-red-500 to-orange-500"
        icon={<Zap className="h-7 w-7 fill-white" />}
      />
      <div className="container-page py-10">
        <SosBoard />
      </div>
    </>
  );
}
