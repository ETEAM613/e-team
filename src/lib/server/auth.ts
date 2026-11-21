import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { execute, query } from "./db";
import { migrate } from "./migrate";
import type { Gender } from "@/lib/data";

// Comptes et sessions.
// - Mots de passe : chiffrés avec scrypt + sel aléatoire (jamais stockés en clair).
// - Session : jeton aléatoire dans un cookie httpOnly ; seule son empreinte SHA-256 est en base.

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const COOKIE = "eteam_session";
const SESSION_DAYS = 30;

export type Role = "eleve" | "parent" | "enseignant" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  role: Role;
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, saltB64, keyB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const key = await scryptAsync(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(key, expected);
}

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Adresses e-mail qui deviennent administrateur (variable d'environnement ADMIN_EMAILS, séparées par des virgules). */
export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await execute("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)", [sha256(token), userId, expires]);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await execute("DELETE FROM sessions WHERE token_hash = ?", [sha256(token)]);
  jar.delete(COOKIE);
}

/** Utilisateur connecté (ou null). Un compte suspendu est traité comme déconnecté. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !process.env.DATABASE_URL) return null;
  await migrate();
  const rows = await query<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: Gender;
    role: Role;
  }>(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.gender, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP() AND u.status = 'active'`,
    [sha256(token)],
  );
  const u = rows[0];
  if (!u) return null;
  return { id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name, gender: u.gender, role: u.role };
});

export async function requireUser(next = "/mon-compte") {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?suite=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/connexion?suite=/admin");
  return user;
}
