import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  if (await getCurrentUser()) redirect("/mon-compte");
  const { suite } = await searchParams;
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-16">
        <LoginForm next={suite ?? ""} />
      </div>
    </div>
  );
}
