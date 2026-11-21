import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import PageHero from "@/components/PageHero";
import ProfileGate from "@/components/ProfileGate";
import WomenSpace from "./WomenSpace";

export const metadata: Metadata = { title: "Espace Femmes" };

export default function WomenPage() {
  return (
    <>
      <PageHero
        eyebrow="Cours pour les femmes"
        title="Apprendre entre femmes, en toute simplicité"
        text="Halakha, histoire juive, vie juive quotidienne : des enseignantes qualifiées, des moments d'étude accessibles même en journée."
        gradient="from-pink-400 via-pink-500 to-fuchsia-600"
        icon={<HeartHandshake className="h-7 w-7" />}
      />
      <div className="container-page py-10">
        <ProfileGate hideFor={["homme"]}>
          <WomenSpace />
        </ProfileGate>
      </div>
    </>
  );
}
