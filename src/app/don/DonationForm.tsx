"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import DemoForm from "@/components/DemoForm";
import { input } from "@/components/ui";

const AMOUNTS = [18, 36, 80, 180, 360];
const PER_LESSON = 8;

export default function DonationForm() {
  const [amount, setAmount] = useState(80);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);

  const value = custom ? Math.max(0, Number(custom) || 0) : amount;
  const lessons = Math.floor(value / PER_LESSON);

  return (
    <DemoForm className="rounded-[2rem] border border-line bg-white p-7 sm:p-9">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
        {[false, true].map((m) => (
          <button
            key={String(m)}
            type="button"
            onClick={() => setMonthly(m)}
            className={`rounded-full py-2.5 text-sm font-bold transition ${monthly === m ? "bg-white shadow-sm" : "text-muted"}`}
          >
            {m ? "Don mensuel" : "Don ponctuel"}
          </button>
        ))}
      </div>

      <p className="mt-7 font-bold">Montant</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAmount(a);
              setCustom("");
            }}
            className={`rounded-2xl py-4 font-display text-xl font-extrabold transition ${
              !custom && amount === a ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30" : "bg-surface hover:bg-pink-50"
            }`}
          >
            {a} €
          </button>
        ))}
      </div>
      <label className="mt-3 block">
        <span className="sr-only">Autre montant</span>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Autre montant (€)"
          className={input}
        />
      </label>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 p-5 ring-1 ring-pink-100">
        <p className="font-display text-2xl font-extrabold text-rose-600">
          = {lessons} cours offert{lessons > 1 ? "s" : ""}
          {monthly ? " chaque mois" : ""}
        </p>
        <p className="mt-1 text-sm text-muted">à un élève qui n&apos;en a pas les moyens</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Nom</span>
          <input required autoComplete="name" className={input} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">E-mail (pour le reçu)</span>
          <input type="email" required autoComplete="email" className={input} />
        </label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-pink-500" /> Rester anonyme sur le tableau de transparence
      </label>

      <button
        disabled={value <= 0}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110 disabled:opacity-50"
      >
        <Heart className="h-5 w-5 fill-white" /> Donner {value} €{monthly ? " / mois" : ""}
      </button>
      <p className="mt-3 text-center text-xs text-muted">Paiement sécurisé par Stripe · reçu envoyé par e-mail</p>
    </DemoForm>
  );
}
