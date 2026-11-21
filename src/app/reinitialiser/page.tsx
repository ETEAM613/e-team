import type { Metadata } from "next";
import ResetForm from "./ResetForm";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ jeton?: string }> }) {
  const { jeton = "" } = await searchParams;
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-16">
        <ResetForm token={jeton} />
      </div>
    </div>
  );
}
