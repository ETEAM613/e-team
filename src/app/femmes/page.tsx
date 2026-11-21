import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import PageHero from "@/components/PageHero";
import Unavailable from "@/components/Unavailable";
import { getCurrentUser } from "@/lib/server/auth";
import { listTeachers } from "@/lib/server/teachers";
import WomenSpace from "./WomenSpace";

export const metadata: Metadata = { title: "Espace Femmes" };

export default async function WomenPage() {
  const user = await getCurrentUser();
  const isMan = user?.gender === "homme";
  const teachers = isMan ? [] : (await listTeachers("femme")).filter((t) => t.accepts.includes("femme"));
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
        {isMan ? <Unavailable /> : <WomenSpace teachers={teachers} loggedIn={!!user} />}
      </div>
    </>
  );
}
