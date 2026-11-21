import mysql from "mysql2/promise";

// Connexion unique à la base MySQL/MariaDB (Hostinger en ligne, MariaDB locale en test).
// L'adresse vient de la variable d'environnement DATABASE_URL, jamais du code.

const globalForDb = globalThis as unknown as { eteamPool?: mysql.Pool };

export function pool(): mysql.Pool {
  if (!globalForDb.eteamPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL manquant : configurez la base de données.");
    globalForDb.eteamPool = mysql.createPool({
      uri: url,
      connectionLimit: 5,
      charset: "utf8mb4",
      timezone: "Z",
      dateStrings: false,
    });
  }
  return globalForDb.eteamPool;
}

/** Requête SELECT : renvoie les lignes. Les paramètres sont toujours échappés. */
export async function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool().query(sql, params);
  return rows as T[];
}

/** Requête d'écriture (INSERT/UPDATE/DELETE). */
export async function execute(sql: string, params: unknown[] = []) {
  const [result] = await pool().execute(sql, params as never[]);
  return result as mysql.ResultSetHeader;
}
