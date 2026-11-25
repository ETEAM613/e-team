// Données de démonstration. Elles seront remplacées par la base de données
// à l'étape suivante (profils réels, cours, binômes, cagnotte).

/** Publics qu'un enseignant accepte : adultes (homme/femme) et enfants (garçon/fille). */
export type Audience = "homme" | "femme" | "garcon" | "fille";

/** Genre indiqué à l'inscription : il détermine ce que l'utilisateur voit sur tout le site. */
export type Gender = "homme" | "femme";

export type Moment = "matin" | "apres-midi" | "soir";

export type Teacher = {
  id: string;
  name: string;
  title: string;
  gender: "homme" | "femme";
  /** Publics acceptés par l'enseignant. */
  accepts: Audience[];
  subjects: string[];
  languages: string[];
  levels: string[];
  rating: number;
  reviews: number;
  lessons: number;
  students: number;
  country: string;
  headline: string;
  bio: string;
  experience: string[];
  available: Moment[];
  /** Statut « Disponible maintenant » pour le module SOS. */
  availableNow: boolean;
  gradient: string;
  verified: boolean;
  /** Moyens de cours acceptés : vidéo e-team, appel WhatsApp, appel téléphonique. */
  callModes?: CallMode[];
};

export type CallMode = "video" | "whatsapp" | "phone";

export const CALL_MODES: { value: CallMode; label: string; short: string }[] = [
  { value: "video", label: "Vidéo sur e-team", short: "Vidéo" },
  { value: "whatsapp", label: "Appel WhatsApp", short: "WhatsApp" },
  { value: "phone", label: "Appel téléphonique", short: "Téléphone" },
];

export const SUBJECTS = [
  "Guemara",
  "Michna",
  "Halakha",
  "Paracha",
  "Tanakh",
  "Moussar",
  "Hassidout",
  "Emouna",
  "Pirké Avot",
  "Histoire juive",
  "Lecture de l'hébreu",
  "Bar-Mitsva",
  "Bat-Mitsva",
  "Kodech (enfants)",
] as const;

export const LANGUAGES = ["Français", "Hébreu", "Anglais"] as const;

export const MOMENTS: { value: Moment; label: string }[] = [
  { value: "matin", label: "Matin" },
  { value: "apres-midi", label: "Après-midi" },
  { value: "soir", label: "Soir" },
];

export const TEACHERS: Teacher[] = [
  {
    id: "rav-david-cohen",
    name: "Rav David Cohen",
    title: "Rav · Roch Collel",
    gender: "homme",
    accepts: ["homme"],
    subjects: ["Guemara", "Halakha", "Moussar"],
    languages: ["Français", "Hébreu"],
    levels: ["Débutant", "Intermédiaire", "Avancé"],
    rating: 4.9,
    reviews: 128,
    lessons: 2140,
    students: 64,
    country: "Israël",
    headline: "La Guemara pas à pas, avec méthode et clarté",
    bio: "Roch Collel depuis quinze ans, j'accompagne aussi bien ceux qui ouvrent une Guemara pour la première fois que ceux qui veulent approfondir les Richonim. Mon objectif : que vous deveniez autonome dans votre étude.",
    experience: ["Roch Collel à Jérusalem (15 ans)", "Semikha du Rabbinat d'Israël", "Auteur de fiches d'étude sur Baba Metsia"],
    available: ["matin", "soir"],
    availableNow: true,
    gradient: "from-violet-500 to-indigo-600",
    verified: true,
  },
  {
    id: "rabbanit-sarah-levy",
    name: "Rabbanit Sarah Lévy",
    title: "Enseignante · Halakha pour les femmes",
    gender: "femme",
    accepts: ["femme", "fille"],
    subjects: ["Halakha", "Emouna", "Paracha"],
    languages: ["Français", "Anglais"],
    levels: ["Débutant", "Intermédiaire"],
    rating: 5.0,
    reviews: 94,
    lessons: 1320,
    students: 51,
    country: "France",
    headline: "La Halakha du quotidien, expliquée simplement",
    bio: "Enseignante depuis douze ans dans des séminaires de jeunes filles, j'aime rendre la Halakha concrète et vivante. Chaque cours part de vos questions de la vie réelle.",
    experience: ["Enseignante en séminaire (12 ans)", "Conférencière pour les femmes", "Accompagnement de futures mariées"],
    available: ["matin", "apres-midi"],
    availableNow: true,
    gradient: "from-pink-500 to-rose-500",
    verified: true,
  },
  {
    id: "yossef-benhamou",
    name: "Yossef Benhamou",
    title: "Avrekh · Havruta",
    gender: "homme",
    accepts: ["homme", "garcon"],
    subjects: ["Guemara", "Michna", "Paracha"],
    languages: ["Français", "Hébreu"],
    levels: ["Débutant", "Intermédiaire"],
    rating: 4.8,
    reviews: 57,
    lessons: 860,
    students: 33,
    country: "Israël",
    headline: "Votre havruta du soir, régulière et motivante",
    bio: "Avrekh au Collel, j'étudie en havruta depuis toujours. Je vous propose un rendez-vous fixe pour avancer ensemble dans un traité, à votre rythme.",
    experience: ["Avrekh au Collel (8 ans)", "Havrutot en ligne depuis 2021", "Moniteur en Talmud Torah"],
    available: ["soir"],
    availableNow: false,
    gradient: "from-sky-500 to-blue-600",
    verified: true,
  },
  {
    id: "myriam-attal",
    name: "Myriam Attal",
    title: "Morah · Kodech pour enfants",
    gender: "femme",
    accepts: ["fille", "femme"],
    subjects: ["Kodech (enfants)", "Lecture de l'hébreu", "Bat-Mitsva"],
    languages: ["Français", "Hébreu"],
    levels: ["Débutant", "Intermédiaire"],
    rating: 4.9,
    reviews: 112,
    lessons: 1980,
    students: 72,
    country: "France",
    headline: "Lire, comprendre et aimer le Kodech",
    bio: "Maîtresse de Kodech en école juive, j'aide les filles de 5 à 12 ans à lire couramment l'hébreu et à prendre confiance. Les parents reçoivent un petit bilan après chaque cours.",
    experience: ["Maîtresse de Kodech (10 ans)", "Méthode de lecture ludique", "Préparation Bat-Mitsva"],
    available: ["apres-midi", "soir"],
    availableNow: false,
    gradient: "from-orange-400 to-pink-500",
    verified: true,
  },
  {
    id: "rav-eliyahou-azoulay",
    name: "Rav Eliyahou Azoulay",
    title: "Rav · Préparation Bar-Mitsva",
    gender: "homme",
    accepts: ["garcon", "homme"],
    subjects: ["Bar-Mitsva", "Paracha", "Halakha"],
    languages: ["Français", "Hébreu", "Anglais"],
    levels: ["Débutant", "Intermédiaire"],
    rating: 4.9,
    reviews: 76,
    lessons: 1150,
    students: 48,
    country: "Israël",
    headline: "Une Bar-Mitsva préparée avec sérieux et joie",
    bio: "Lecture de la Paracha avec les Teamim, Tefilin, Drasha : je prépare le jeune garçon en douceur pour qu'il vive ce jour avec fierté.",
    experience: ["Plus de 300 Bar-Mitsva préparées", "Ba'al Kriya", "Rav de communauté (6 ans)"],
    available: ["apres-midi", "soir"],
    availableNow: true,
    gradient: "from-teal-400 to-emerald-600",
    verified: true,
  },
  {
    id: "hanna-zerbib",
    name: "Hanna Zerbib",
    title: "Enseignante · Tanakh et histoire juive",
    gender: "femme",
    accepts: ["femme"],
    subjects: ["Tanakh", "Histoire juive", "Pirké Avot"],
    languages: ["Français"],
    levels: ["Débutant", "Intermédiaire", "Avancé"],
    rating: 4.7,
    reviews: 41,
    lessons: 540,
    students: 27,
    country: "Canada",
    headline: "Les grands récits du Tanakh, au cœur de notre histoire",
    bio: "Diplômée en études juives, je propose un parcours vivant à travers le Tanakh et l'histoire du peuple juif, avec des textes et des discussions.",
    experience: ["Diplôme d'études juives", "Animatrice de cercles d'étude (7 ans)"],
    available: ["matin", "apres-midi"],
    availableNow: true,
    gradient: "from-fuchsia-500 to-purple-600",
    verified: true,
  },
  {
    id: "rav-mordekhai-sebbag",
    name: "Rav Mordekhaï Sebbag",
    title: "Rav · Hassidout et Emouna",
    gender: "homme",
    accepts: ["homme"],
    subjects: ["Hassidout", "Emouna", "Moussar"],
    languages: ["Français", "Hébreu"],
    levels: ["Intermédiaire", "Avancé"],
    rating: 5.0,
    reviews: 63,
    lessons: 920,
    students: 29,
    country: "Israël",
    headline: "Trouver sa place et sa force dans l'étude",
    bio: "J'accompagne ceux qui cherchent du sens : Tanya, Moussar, Emouna. Un cours qui nourrit l'âme et donne des forces pour la semaine.",
    experience: ["Machpia en Yechiva (10 ans)", "Conférences en France et en Israël"],
    available: ["matin", "soir"],
    availableNow: false,
    gradient: "from-indigo-500 to-violet-700",
    verified: true,
  },
  {
    id: "noa-bitton",
    name: "Noa Bitton",
    title: "Morah · Paracha et Michna pour enfants",
    gender: "femme",
    accepts: ["fille"],
    subjects: ["Paracha", "Michna", "Kodech (enfants)"],
    languages: ["Français", "Anglais"],
    levels: ["Débutant"],
    rating: 4.8,
    reviews: 38,
    lessons: 610,
    students: 31,
    country: "Belgique",
    headline: "La Paracha de la semaine racontée aux enfants",
    bio: "Chaque semaine, une aventure : on lit, on raconte, on joue avec la Paracha. Les enfants repartent avec une question à poser à table le Chabbat.",
    experience: ["Animatrice en Talmud Torah (6 ans)", "Créatrice de fiches Paracha pour enfants"],
    available: ["apres-midi"],
    availableNow: true,
    gradient: "from-amber-400 to-orange-500",
    verified: true,
  },
];

export function getTeacher(id: string) {
  return TEACHERS.find((t) => t.id === id);
}

const teachesKids = (t: Teacher) => t.accepts.includes("garcon") || t.accepts.includes("fille");

/** Enseignants visibles : tous avant l'inscription, puis uniquement ceux du même genre que le compte. */
export function teachersFor(gender: Gender | null) {
  return gender ? TEACHERS.filter((t) => t.gender === gender) : TEACHERS;
}

/** Une fiche est visible si elle correspond au compte, ou si l'enseignant prend des enfants (réservation parent). */
export function canSeeTeacher(t: Teacher, gender: Gender | null) {
  return !gender || t.gender === gender || teachesKids(t);
}

/** Enseignants de l'espace Enfants, éventuellement filtrés par genre de l'enfant. */
export function kidsTeachers(child: "garcon" | "fille" | null) {
  return TEACHERS.filter((t) => (child ? t.accepts.includes(child) : teachesKids(t)));
}

/** Cours en direct : sessions de groupe gratuites, validées par l'admin, jusqu'à 7 jours à l'avance. */
export type LiveSession = {
  id: string;
  title: string;
  teacherId: string;
  audience: Audience[];
  dayOffset: number; // 0 = aujourd'hui … 6
  time: string;
  duration: number;
  subject: string;
  enrolled: number;
  capacity: number;
};

export const LIVE_SESSIONS: LiveSession[] = [
  { id: "l1", title: "Daf Yomi expliqué", teacherId: "rav-david-cohen", audience: ["homme"], dayOffset: 0, time: "20:30", duration: 45, subject: "Guemara", enrolled: 38, capacity: 60 },
  { id: "l2", title: "La Halakha du Chabbat, simplement", teacherId: "rabbanit-sarah-levy", audience: ["femme"], dayOffset: 0, time: "10:00", duration: 40, subject: "Halakha", enrolled: 52, capacity: 80 },
  { id: "l3", title: "La Paracha racontée aux enfants", teacherId: "noa-bitton", audience: ["fille"], dayOffset: 1, time: "17:30", duration: 30, subject: "Paracha", enrolled: 21, capacity: 30 },
  { id: "l4", title: "Pirké Avot : une Michna par semaine", teacherId: "hanna-zerbib", audience: ["femme"], dayOffset: 2, time: "14:00", duration: 45, subject: "Pirké Avot", enrolled: 17, capacity: 50 },
  { id: "l5", title: "Tanya pour débutants", teacherId: "rav-mordekhai-sebbag", audience: ["homme"], dayOffset: 2, time: "07:15", duration: 30, subject: "Hassidout", enrolled: 44, capacity: 60 },
  { id: "l6", title: "Préparer sa Bar-Mitsva : les Tefilin", teacherId: "rav-eliyahou-azoulay", audience: ["garcon"], dayOffset: 3, time: "18:00", duration: 40, subject: "Bar-Mitsva", enrolled: 12, capacity: 25 },
  { id: "l7", title: "Michna Berakhot en havruta géante", teacherId: "yossef-benhamou", audience: ["homme", "garcon"], dayOffset: 4, time: "21:00", duration: 50, subject: "Michna", enrolled: 29, capacity: 60 },
  { id: "l8", title: "Emouna au quotidien", teacherId: "rabbanit-sarah-levy", audience: ["femme"], dayOffset: 6, time: "11:00", duration: 45, subject: "Emouna", enrolled: 33, capacity: 80 },
];

/** Binôme : demandes de partenaires d'étude entre pairs (comptes vérifiés uniquement). */
export type BinomeRequest = {
  id: string;
  firstName: string;
  city: string;
  audience: "homme" | "femme";
  subject: string;
  level: string;
  moments: Moment[];
  text: string;
  initials: string;
  gradient: string;
};

export const BINOME_REQUESTS: BinomeRequest[] = [
  { id: "b1", firstName: "Ariel", city: "Paris", audience: "homme", subject: "Guemara", level: "Intermédiaire", moments: ["soir"], text: "Je cherche une havruta pour avancer dans Berakhot, 3 soirs par semaine.", initials: "A", gradient: "from-violet-500 to-indigo-600" },
  { id: "b2", firstName: "Elie", city: "Lyon", audience: "homme", subject: "Michna", level: "Débutant", moments: ["matin"], text: "Débutant motivé, 20 minutes chaque matin avant le travail.", initials: "E", gradient: "from-sky-500 to-blue-600" },
  { id: "b3", firstName: "Nathan", city: "Jérusalem", audience: "homme", subject: "Moussar", level: "Avancé", moments: ["soir"], text: "Messilat Yecharim, un chapitre par semaine, avec échange de réflexions.", initials: "N", gradient: "from-teal-400 to-emerald-600" },
  { id: "b4", firstName: "Déborah", city: "Marseille", audience: "femme", subject: "Paracha", level: "Débutant", moments: ["apres-midi"], text: "J'aimerais préparer la Paracha de la semaine avec une autre maman.", initials: "D", gradient: "from-pink-500 to-rose-500" },
  { id: "b5", firstName: "Sarah", city: "Montréal", audience: "femme", subject: "Tanakh", level: "Intermédiaire", moments: ["soir"], text: "Lecture suivie du livre de Chemouel, deux fois par semaine.", initials: "S", gradient: "from-fuchsia-500 to-purple-600" },
  { id: "b6", firstName: "Rivka", city: "Bruxelles", audience: "femme", subject: "Halakha", level: "Intermédiaire", moments: ["matin", "apres-midi"], text: "Étude des lois de Chabbat avec le Kitsour, à mon rythme.", initials: "R", gradient: "from-orange-400 to-pink-500" },
];

/** Tableau de transparence de la cagnotte de dons (exemple). */
export const TRANSPARENCY = {
  collected: 18450,
  distributed: 15920,
  sponsoredStudents: 143,
  fundedLessons: 1990,
  teacherPayPerLesson: 8,
  donors: 312,
  months: [
    { label: "Juin", collected: 2100, distributed: 1840 },
    { label: "Juil.", collected: 2650, distributed: 2320 },
    { label: "Août", collected: 2380, distributed: 2240 },
    { label: "Sept.", collected: 3420, distributed: 2960 },
    { label: "Oct.", collected: 3900, distributed: 3360 },
    { label: "Nov.", collected: 4000, distributed: 3200 },
  ],
};

export const TESTIMONIALS = [
  {
    name: "Daniel, Paris",
    text: "J'avais arrêté d'étudier depuis des années. Grâce à ma havruta du soir, j'ai terminé mon premier traité. Un vrai rendez-vous que je ne manque jamais.",
  },
  {
    name: "Esther, Marseille",
    text: "Enfin un cadre entre femmes où je peux poser toutes mes questions de Halakha sans gêne. Ma Rabbanit est d'une patience incroyable.",
  },
  {
    name: "Rachel, maman de Léa (9 ans)",
    text: "Léa lit maintenant couramment. Elle attend son cours avec impatience, et je reçois un petit bilan après chaque séance.",
  },
];

export const FAQ = [
  {
    q: "Le premier cours est-il vraiment gratuit ?",
    a: "Oui. Votre premier cours est offert, avec l'enseignant de votre choix. Si le courant ne passe pas, un deuxième cours d'essai gratuit vous est offert avec un autre enseignant.",
  },
  {
    q: "Que se passe-t-il après l'essai ?",
    a: "Vous faites un choix : sponsoriser vos cours (et ceux des autres) avec une facturation mensuelle, ou demander un sponsoring si vous en avez besoin. Dans les deux cas, vous continuez à étudier.",
  },
  {
    q: "Comment se déroule un cours ?",
    a: "En visio sur Google Meet. Dès qu'un cours est confirmé, le lien est créé automatiquement et envoyé par e-mail à l'élève et à l'enseignant. Il apparaît aussi dans votre tableau de bord.",
  },
  {
    q: "Avec qui vais-je étudier ?",
    a: "Les femmes étudient avec des enseignantes, les hommes avec des Rabbanim et des enseignants. Il suffit de l'indiquer une fois à l'inscription : le site s'adapte ensuite automatiquement.",
  },
  {
    q: "Comment sont choisis les enseignants ?",
    a: "Chaque enseignant est vérifié par l'équipe e-team : diplômes et contrôle des antécédents, avant toute mise en ligne de son profil.",
  },
  {
    q: "À quoi servent les dons ?",
    a: "100 % des dons financent les cours des élèves sponsorisés. Un tableau de transparence public montre l'utilisation de chaque euro.",
  },
];
