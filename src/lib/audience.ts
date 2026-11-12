"use client";

import { useSyncExternalStore } from "react";
import type { Audience } from "./data";

// Profil de navigation choisi par le visiteur (« pour qui est le cours »).
// Aperçu côté navigateur : à l'étape 2, la séparation est appliquée par le
// serveur selon le genre du compte et celui de l'enfant.

const KEY = "eteam-audience";
const VALID: Audience[] = ["homme", "femme", "garcon", "fille"];
const listeners = new Set<() => void>();
let memory: Audience | null = null;

function read(): Audience | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return VALID.includes(v as Audience) ? (v as Audience) : memory;
  } catch {
    return memory;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function setAudience(a: Audience | null) {
  memory = a;
  try {
    if (a) window.localStorage.setItem(KEY, a);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* stockage indisponible : on garde la valeur en mémoire */
  }
  listeners.forEach((l) => l());
}

export function useAudience(): Audience | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
