import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/server/auth";
import { unreadCount } from "@/lib/server/messages";
import { openSosForTeacher } from "@/lib/server/sos";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "e-team — La Torah Connectée",
    template: "%s · e-team",
  },
  description:
    "Étudiez la Torah en direct avec un Rav ou une enseignante qualifiée. Premier cours gratuit, cours en direct gratuits, SOS 1:1 et binômes d'étude.",
  // Version d'aperçu : ne pas apparaître dans Google tant que le site n'est pas lancé
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const unread = user ? await unreadCount(user.id) : 0;
  const sos = user?.role === "enseignant" ? (await openSosForTeacher(user)).length : 0;
  return (
    <html lang="fr" className={`${jakarta.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="bg-amber-300 px-4 py-2 text-center text-xs font-bold text-ink sm:text-sm">
          🚧 Version d&apos;aperçu — site en construction. Les enseignants, avis et chiffres affichés sont des exemples.
        </div>
        <Header user={user ? { firstName: user.firstName, gender: user.gender, role: user.role, unread, sos } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
