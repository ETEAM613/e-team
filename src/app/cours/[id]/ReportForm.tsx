"use client";

import { useActionState, useState } from "react";
import { reportLesson } from "@/app/actions/lessons";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

/** Fin du cours : ce qui s'est passé et la durée réelle (sert à comptabiliser et payer les enseignants). */
export default function ReportForm({ lessonId, iAmTeacher, defaultMinutes }: { lessonId: string; iAmTeacher: boolean; defaultMinutes: number }) {
  const [state, action, pending] = useActionState(reportLesson, undefined);
  const [outcome, setOutcome] = useState("done");

  const options = [
    { value: "done", label: "Le cours a eu lieu" },
    { value: "early", label: "Le cours s'est terminé en avance" },
    { value: iAmTeacher ? "student_absent" : "teacher_absent", label: iAmTeacher ? "L'élève n'est pas venu" : "L'enseignant n'est pas venu" },
  ];

  return (
    <form action={action} className="space-y-3 rounded-2xl border border-line p-5">
      <input type="hidden" name="lesson" value={lessonId} />
      <p className="font-extrabold">Fin du cours</p>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input type="radio" name="outcome" value={o.value} checked={outcome === o.value} onChange={() => setOutcome(o.value)} className="accent-[var(--color-brand-500)]" />
            {o.label}
          </label>
        ))}
      </div>
      {(outcome === "done" || outcome === "early") && (
        <label className="block max-w-xs">
          <span className="mb-1 block text-sm font-bold">Durée réelle (minutes)</span>
          <input name="minutes" type="number" min={1} max={180} defaultValue={defaultMinutes} className={`${input} !py-2.5`} />
        </label>
      )}
      <FormError state={state} />
      <button disabled={pending} className={btn.dark}>{pending ? "Enregistrement…" : "Valider"}</button>
    </form>
  );
}
