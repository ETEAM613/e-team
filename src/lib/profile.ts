"use client";

import { useSyncExternalStore } from "react";
import type { Gender } from "./data";

// Genre du compte, indiqué à l'inscription. Tant que la base de données n'est pas
// branchée (étape 2), il est mémorisé dans le navigateur pour l'aperçu.
// Avant l'inscription : null, le visiteur voit tout le site.

const KEY = "eteam-genre";
const listeners = new Set<() => void>();
let memory: Gender | null = null;

function read(): Gender | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "homme" || v === "femme" ? v : memory;
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

export function setGender(g: Gender | null) {
  memory = g;
  try {
    if (g) window.localStorage.setItem(KEY, g);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* stockage indisponible : on garde la valeur en mémoire */
  }
  listeners.forEach((l) => l());
}

export function useGender(): Gender | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
