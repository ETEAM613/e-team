"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { input } from "@/components/ui";

/** Test admin : ouvre WhatsApp ou le téléphone exactement comme le bouton « Commencer le cours ». */
export default function TestCallLinks() {
  const [phone, setPhone] = useState("");
  const digits = phone.replace(/\D/g, "");
  const valid = digits.length >= 8;

  return (
    <div className="mt-8 rounded-[2rem] border border-line bg-white p-6">
      <h2 className="text-2xl font-extrabold">Tester WhatsApp et le téléphone</h2>
      <p className="mt-1 text-sm text-muted">
        Faites ce test depuis votre téléphone. Tapez un numéro à appeler (par ex. celui d&apos;un proche) au format international.
      </p>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+33612345678"
        className={`${input} mt-4 max-w-sm`}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={valid ? `https://wa.me/${digits}` : undefined}
          aria-disabled={!valid}
          className={`inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-bold text-white ${valid ? "hover:bg-emerald-600" : "pointer-events-none opacity-40"}`}
        >
          💬 Ouvrir WhatsApp
        </a>
        <a
          href={valid ? `tel:+${digits}` : undefined}
          aria-disabled={!valid}
          className={`inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-bold text-white ${valid ? "hover:bg-sky-600" : "pointer-events-none opacity-40"}`}
        >
          <Phone className="h-5 w-5" /> Appeler
        </a>
      </div>
    </div>
  );
}
