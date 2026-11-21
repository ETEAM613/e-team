"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Recharge la conversation toutes les 8 secondes pour afficher les nouveaux messages. */
export default function AutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 8000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
