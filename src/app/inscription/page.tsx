import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Inscription" };

type SP = Promise<{ role?: string }>;

async function Form({ searchParams }: { searchParams: SP }) {
  const { role } = await searchParams;
  return <SignupForm initialRole={role === "enseignant" ? "enseignant" : "eleve"} />;
}

export default function SignupPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-14">
        <Suspense fallback={<div className="h-[640px] w-full max-w-lg animate-pulse rounded-[2rem] bg-white" />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
