import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Les pages qui dépendent du compte connecté sont rendues à chaque visite.
  // Bibliothèques serveur gardées hors du bundle (connexion MySQL, envoi d'e-mails).
  serverExternalPackages: ["mysql2", "nodemailer"],
};

export default nextConfig;
