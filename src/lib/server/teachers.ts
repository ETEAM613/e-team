import "server-only";
import { query } from "./db";
import { migrate } from "./migrate";
import { TEACHERS, type Audience, type CallMode, type Gender, type Moment, type Teacher } from "@/lib/data";

// Sans base configurée (ex. copie de secours), on affiche les profils de démonstration.
const hasDb = () => !!process.env.DATABASE_URL;

// Accès aux profils enseignants. Le tri hommes/femmes est fait ICI, côté serveur :
// un compte ne reçoit jamais les profils qu'il ne doit pas voir.

export type TeacherStatus = "draft" | "pending" | "approved" | "rejected";

export type TeacherRow = {
  id: string;
  user_id: string | null;
  slug: string;
  display_name: string;
  title: string;
  gender: Gender;
  accepts: string;
  subjects: string;
  languages: string;
  levels: string;
  available: string;
  experience: string;
  headline: string;
  bio: string;
  country: string;
  status: TeacherStatus;
  admin_note: string | null;
  available_now: number;
  rating: string | number;
  reviews: number;
  lessons: number;
  students: number;
  gradient: string;
  is_demo: number;
  timezone: string;
  call_modes: string;
  phone: string | null;
};

const list = <T,>(json: string): T[] => {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export function toTeacher(r: TeacherRow): Teacher {
  return {
    id: r.slug,
    name: r.display_name,
    title: r.title,
    gender: r.gender,
    accepts: list<Audience>(r.accepts),
    subjects: list<string>(r.subjects),
    languages: list<string>(r.languages),
    levels: list<string>(r.levels),
    available: list<Moment>(r.available),
    experience: list<string>(r.experience),
    headline: r.headline,
    bio: r.bio,
    country: r.country,
    availableNow: !!r.available_now,
    rating: Number(r.rating),
    reviews: r.reviews,
    lessons: r.lessons,
    students: r.students,
    gradient: r.gradient,
    verified: r.status === "approved",
    callModes: r.call_modes ? list<CallMode>(r.call_modes) : ["video"],
  };
}

const teachesKids = (t: Teacher) => t.accepts.includes("garcon") || t.accepts.includes("fille");

/** Enseignants validés visibles : tous pour un visiteur, uniquement ceux du même genre pour un compte. */
export async function listTeachers(viewerGender: Gender | null): Promise<Teacher[]> {
  if (!hasDb()) return viewerGender ? TEACHERS.filter((t) => t.gender === viewerGender) : TEACHERS;
  await migrate();
  const rows = viewerGender
    ? await query<TeacherRow>("SELECT * FROM teacher_profiles WHERE status = 'approved' AND gender = ?", [viewerGender])
    : await query<TeacherRow>("SELECT * FROM teacher_profiles WHERE status = 'approved'");
  return rows.map(toTeacher);
}

/** Enseignants pour enfants (validés). */
export async function listKidsTeachers(): Promise<Teacher[]> {
  if (!hasDb()) return TEACHERS.filter(teachesKids);
  await migrate();
  const rows = await query<TeacherRow>("SELECT * FROM teacher_profiles WHERE status = 'approved'");
  return rows.map(toTeacher).filter(teachesKids);
}

/**
 * Fiche d'un enseignant pour un visiteur donné. Renvoie null si elle n'existe pas,
 * n'est pas validée, ou ne correspond pas au compte (sauf enseignant pour enfants).
 */
export async function getTeacherForViewer(slug: string, viewerGender: Gender | null): Promise<Teacher | null> {
  let t: Teacher | undefined;
  if (!hasDb()) t = TEACHERS.find((x) => x.id === slug);
  else {
    await migrate();
    const rows = await query<TeacherRow>("SELECT * FROM teacher_profiles WHERE slug = ? AND status = 'approved'", [slug]);
    t = rows[0] ? toTeacher(rows[0]) : undefined;
  }
  if (!t) return null;
  if (viewerGender && t.gender !== viewerGender && !teachesKids(t)) return null;
  return t;
}

export async function getTeacherRowByUser(userId: string): Promise<TeacherRow | null> {
  await migrate();
  const rows = await query<TeacherRow>("SELECT * FROM teacher_profiles WHERE user_id = ?", [userId]);
  return rows[0] ?? null;
}
