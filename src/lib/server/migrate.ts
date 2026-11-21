import { execute, query } from "./db";
import { TEACHERS } from "@/lib/data";

// Migrations de la base : exécutées automatiquement au démarrage du serveur
// (voir src/instrumentation.ts). Chaque étape ne s'exécute qu'une seule fois.
// Pour faire évoluer la base, AJOUTER une étape à la fin, ne jamais modifier les anciennes.

const MIGRATIONS: { id: string; sql: string[] }[] = [
  {
    id: "001_comptes",
    sql: [
      `CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(190) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(80) NOT NULL,
        last_name VARCHAR(80) NOT NULL,
        gender ENUM('homme','femme') NOT NULL,
        role ENUM('eleve','parent','enseignant','admin') NOT NULL DEFAULT 'eleve',
        status ENUM('active','suspended') NOT NULL DEFAULT 'active',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS sessions (
        token_hash CHAR(64) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS password_resets (
        token_hash CHAR(64) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        expires_at DATETIME NOT NULL,
        used_at DATETIME NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS children (
        id CHAR(36) PRIMARY KEY,
        parent_id CHAR(36) NOT NULL,
        first_name VARCHAR(80) NOT NULL,
        age TINYINT UNSIGNED NOT NULL,
        gender ENUM('garcon','fille') NOT NULL,
        level VARCHAR(40) NOT NULL DEFAULT 'Débutant',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX (parent_id),
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      `CREATE TABLE IF NOT EXISTS teacher_profiles (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NULL UNIQUE,
        slug VARCHAR(120) NOT NULL UNIQUE,
        display_name VARCHAR(120) NOT NULL,
        title VARCHAR(160) NOT NULL DEFAULT '',
        gender ENUM('homme','femme') NOT NULL,
        accepts TEXT NOT NULL,
        subjects TEXT NOT NULL,
        languages TEXT NOT NULL,
        levels TEXT NOT NULL,
        available TEXT NOT NULL,
        experience TEXT NOT NULL,
        headline VARCHAR(200) NOT NULL DEFAULT '',
        bio TEXT NOT NULL,
        country VARCHAR(80) NOT NULL DEFAULT '',
        status ENUM('draft','pending','approved','rejected') NOT NULL DEFAULT 'draft',
        admin_note VARCHAR(500) NULL,
        available_now TINYINT(1) NOT NULL DEFAULT 0,
        rating DECIMAL(2,1) NOT NULL DEFAULT 0,
        reviews INT NOT NULL DEFAULT 0,
        lessons INT NOT NULL DEFAULT 0,
        students INT NOT NULL DEFAULT 0,
        gradient VARCHAR(80) NOT NULL DEFAULT 'from-violet-500 to-indigo-600',
        is_demo TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (status, gender),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    ],
  },
];

/** Profils de démonstration (marqués is_demo) pour que le site ne soit pas vide au lancement. */
async function seedDemoTeachers() {
  // Une seule fois : si l'admin supprime ensuite les profils de démo, ils ne reviennent pas.
  const seeded = await query("SELECT id FROM schema_migrations WHERE id = 'seed_demo_teachers'");
  if (seeded.length) return;
  const [{ n }] = await query<{ n: number }>("SELECT COUNT(*) AS n FROM teacher_profiles");
  for (const t of Number(n) > 0 ? [] : TEACHERS) {
    await execute(
      `INSERT INTO teacher_profiles
        (id, slug, display_name, title, gender, accepts, subjects, languages, levels, available, experience,
         headline, bio, country, status, available_now, rating, reviews, lessons, students, gradient, is_demo)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?, ?, ?, ?, 1)`,
      [
        t.id, t.name, t.title, t.gender,
        JSON.stringify(t.accepts), JSON.stringify(t.subjects), JSON.stringify(t.languages),
        JSON.stringify(t.levels), JSON.stringify(t.available), JSON.stringify(t.experience),
        t.headline, t.bio, t.country, t.availableNow ? 1 : 0, t.rating, t.reviews, t.lessons, t.students, t.gradient,
      ],
    );
  }
  await execute("INSERT INTO schema_migrations (id) VALUES ('seed_demo_teachers')");
}

let done: Promise<void> | null = null;

export function migrate(): Promise<void> {
  if (!done) {
    done = (async () => {
      await execute(
        `CREATE TABLE IF NOT EXISTS schema_migrations (id VARCHAR(100) PRIMARY KEY, run_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
      );
      const applied = new Set((await query<{ id: string }>("SELECT id FROM schema_migrations")).map((r) => r.id));
      for (const m of MIGRATIONS) {
        if (applied.has(m.id)) continue;
        for (const statement of m.sql) await execute(statement);
        await execute("INSERT INTO schema_migrations (id) VALUES (?)", [m.id]);
        console.log(`[e-team] migration appliquée : ${m.id}`);
      }
      await seedDemoTeachers();
    })().catch((err) => {
      done = null;
      throw err;
    });
  }
  return done;
}
