import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Inscription" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string; genre?: string }> }) {
  if (await getCurrentUser()) redirect("/mon-compte");
  const { role, genre } = await searchParams;
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-14">
        <SignupForm
          initialRole={role === "enseignant" ? "enseignant" : role === "parent" ? "parent" : "eleve"}
          initialGender={genre === "homme" || genre === "femme" ? genre : null}
        />
      </div>
    </div>
  );
}
