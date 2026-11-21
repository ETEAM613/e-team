"use client";

import { useActionState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { sendMessage } from "@/app/actions/messages";

export default function Composer({ conversationId, teacher }: { conversationId: string; teacher: string }) {
  const [state, action, pending] = useActionState(sendMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="border-t border-line p-3">
      <input type="hidden" name="conversationId" value={conversationId} />
      <input type="hidden" name="teacher" value={teacher} />
      {state?.error && <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{state.error}</p>}
      <div className="flex items-end gap-2">
        <textarea
          name="body"
          required
          rows={2}
          maxLength={2000}
          placeholder="Écrivez votre message…"
          className="max-h-40 min-h-12 flex-1 resize-y rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          onKeyDown={(e) => {
            // Entrée pour envoyer, Maj+Entrée pour aller à la ligne
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <button
          disabled={pending}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-50"
          aria-label="Envoyer"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
