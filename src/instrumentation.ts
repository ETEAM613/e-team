// Exécuté une fois au démarrage du serveur : met la base de données à jour.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) return;
  const { migrate } = await import("./lib/server/migrate");
  try {
    await migrate();
  } catch (err) {
    console.error("[e-team] échec de la mise à jour de la base :", err);
  }
}
