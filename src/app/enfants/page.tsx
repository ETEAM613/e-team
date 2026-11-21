import type { Metadata } from "next";
import { Baby } from "lucide-react";
import PageHero from "@/components/PageHero";
import ChildrenSpace from "./ChildrenSpace";

export const metadata: Metadata = { title: "Espace Enfants" };

export default function ChildrenPage() {
  return (
    <>
      <PageHero
        eyebrow="Espace Enfants"
        title="Des bases solides en Kodech, chaque jour"
        text="Kodech, lecture, Paracha, Bar et Bat-Mitsva : des cours adaptés à chaque enfant, avec un suivi pour les parents."
        gradient="from-amber-300 via-amber-400 to-orange-400"
        icon={<Baby className="h-7 w-7" />}
        dark
      />
      <div className="container-page py-10">
        <ChildrenSpace />
      </div>
    </>
  );
}
