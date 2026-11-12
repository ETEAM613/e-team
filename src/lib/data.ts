// Données de démonstration. Elles seront remplacées par la base de données
// (Supabase) à l'étape suivante : profils réels des enseignants, avis, disponibilités.

export type SpaceSlug = "hommes" | "femmes" | "enfants";

export type Teacher = {
  id: string;
  name: string;
  title: string;
  spaces: SpaceSlug[];
  subjects: string[];
  languages: string[];
  levels: string[];
  price: number; // € par cours de 50 min
  trialPrice: number; // € pour le cours d'essai de 25 min
  rating: number;
  reviews: number;
  lessons: number;
  students: number;
  country: string;
  headline: string;
  bio: string;
  experience: string[];
  available: ("matin" | "apres-midi" | "soir")[];
  color: string;
  superTeacher?: boolean;
};

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

export const SPACES: {
  slug: SpaceSlug;
  title: string;
  tagline: string;
  description: string;
  points: string[];
  subjects: string[];
}[] = [
  {
    slug: "hommes",
    title: "Espace Hommes",
    tagline: "Havruta, Guemara et suivi avec des Rabbanim",
    description:
      "Étudiez en binôme ou en cours particulier avec des Avrekhim et des Rabbanim expérimentés, selon vos horaires et votre niveau.",
    points: [
      "Études en havruta (binôme)",
      "Suivi avec des Rabbanim expérimentés",
      "Études sur mesure selon les horaires et niveaux",
    ],
    subjects: ["Guemara", "Michna", "Halakha", "Paracha", "Moussar", "Hassidout"],
  },
  {
    slug: "femmes",
    title: "Espace Femmes",
    tagline: "Apprendre entre femmes, avec des enseignantes qualifiées",
    description:
      "Un cadre bienveillant pour étudier et échanger en toute simplicité, même en journée, sans attendre un rendez-vous avec un Rav.",
    points: [
      "Apprentissage entre femmes avec des enseignantes qualifiées",
      "Halakha, histoire juive et vie juive quotidienne",
      "Moments d'étude accessibles même en journée",
    ],
    subjects: ["Halakha", "Paracha", "Emouna", "Histoire juive", "Tanakh", "Pirké Avot"],
  },
  {
    slug: "enfants",
    title: "Espace Enfants",
    tagline: "Des bases solides en Kodech, chaque jour",
    description:
      "Un suivi régulier pour consolider ce qui est appris à l'école et donner à l'enfant le goût de l'étude.",
    points: [
      "Suivi régulier des matières de Kodech",
      "Renforcement du niveau acquis à l'école",
      "Études quotidiennes en ligne pour fixer des bases solides",
    ],
    subjects: ["Kodech (enfants)", "Lecture de l'hébreu", "Paracha", "Michna", "Bar-Mitsva", "Bat-Mitsva"],
  },
];

export const TEACHERS: Teacher[] = [
  {
    id: "rav-david-cohen",
    name: "Rav David Cohen",
    title: "Rav · Roch Collel",
    spaces: ["hommes"],
    subjects: ["Guemara", "Halakha", "Moussar"],
    languages: ["Français", "Hébreu"],
    levels: ["Débutant", "Intermédiaire", "Avancé"],
    price: 35,
    trialPrice: 10,
    rating: 4.9,
    reviews: 128,
    lessons: 2140,
    students: 64,
    country: "Israël",
    headline: "La Guemara pas à pas, avec méthode et clarté",
    bio: "Roch Collel depuis quinze ans, j'accompagne aussi bien ceux qui ouvrent une Guemara pour la première fois que ceux qui veulent approfondir les Richonim. Mon objectif : que vous deveniez autonome dans votre étude.",
    experience: ["Roch Collel à Jérusalem (15 ans)", "Semikha du Rabbinat d'Israël", "Auteur de fiches d'étude sur Baba Metsia"],
    available: ["matin", "soir"],
    color: "#1f2d66",
    superTeacher: true,
  },
  {
    id: "rabbanit-sarah-levy",
    name: "Rabbanit Sarah Lévy",
    title: "Enseignante · Halakha pour les femmes",
    spaces: ["femmes"],
    subjects: ["Halakha", "Emouna", "Paracha"],
    languages: ["Français", "Anglais"],
    levels: ["Débutant", "Intermédiaire"],
    price: 30,
    trialPrice: 8,
    rating: 5.0,
    reviews: 94,
    lessons: 1320,
    students: 51,
    country: "France",
    headline: "La Halakha du quotidien, expliquée simplement",
    bio: "Enseignante depuis douze ans dans des séminaires de jeunes filles, j'aime rendre la Halakha concrète et vivante. Chaque cours part de vos questions de la vie réelle.",
    experience: ["Enseignante en séminaire (12 ans)", "Conférencière pour les femmes", "Accompagnement de futures mariées"],
    available: ["matin", "apres-midi"],
    color: "#94650a",
    superTeacher: true,
  },
  {
    id: "yossef-benhamou",
    name: "Yossef Benhamou",
    title: "Avrekh · Havruta",
    spaces: ["hommes"],
    subjects: ["Guemara", "Michna", "Paracha"],
    languages: ["Français", "Hébreu"],
    levels: ["Débutant", "Intermédiaire"],
    price: 22,
    trialPrice: 5,
    rating: 4.8,
    reviews: 57,
    lessons: 860,
    students: 33,
    country: "Israël",
    headline: "Votre havruta du soir, régulière et motivante",
    bio: "Avrekh au Collel, j'étudie en havruta depuis toujours. Je vous propose un rendez-vous fixe pour avancer ensemble dans un traité, à votre rythme.",
    experience: ["Avrekh au Collel (8 ans)", "Havrutot en ligne depuis 2021"],
    available: ["soir"],
    color: "#3a4f9c",
  },
  {
    id: "myriam-attal",
    name: "Myriam Attal",
    title: "Morah · Kodech pour enfants",
    spaces: ["enfants", "femmes"],
    subjects: ["Kodech (enfants)", "Lecture de l'hébreu", "Bat-Mitsva"],
    languages: ["Français", "Hébreu"],
    levels: ["Débutant", "Intermédiaire"],
    price: 25,
    trialPrice: 0,
    rating: 4.9,
    reviews: 112,
    lessons: 1980,
    students: 72,
    country: "France",
    headline: "Lire, comprendre et aimer le Kodech",
    bio: "Maîtresse de Kodech en école juive, j'aide les enfants de 5 à 12 ans à lire couramment l'hébreu et à prendre confiance. Les parents reçoivent un petit bilan après chaque cours.",
    experience: ["Maîtresse de Kodech (10 ans)", "Méthode de lecture ludique", "Préparation Bat-Mitsva"],
    available: ["apres-midi", "soir"],
    color: "#b4532a",
    superTeacher: true,
  },
  {
    id: "rav-eliyahou-azoulay",
    name: "Rav Eliyahou Azoulay",
    title: "Rav · Préparation Bar-Mitsva",
    spaces: ["enfants", "hommes"],
    subjects: ["Bar-Mitsva", "Paracha", "Halakha"],
    languages: ["Français", "Hébreu", "Anglais"],
    levels: ["Débutant", "Intermédiaire"],
    price: 32,
    trialPrice: 10,
    rating: 4.9,
    reviews: 76,
    lessons: 1150,
    students: 48,
    country: "Israël",
    headline: "Une Bar-Mitsva préparée avec sérieux et joie",
    bio: "Lecture de la Paracha avec les Teamim, Tefilin, Drasha : je prépare le jeune garçon en douceur pour qu'il vive ce jour avec fierté.",
    experience: ["Plus de 300 Bar-Mitsva préparées", "Ba'al Kriya", "Rav de communauté (6 ans)"],
    available: ["apres-midi", "soir"],
    color: "#2f6b5a",
  },
  {
    id: "hanna-zerbib",
    name: "Hanna Zerbib",
    title: "Enseignante · Tanakh et histoire juive",
    spaces: ["femmes"],
    subjects: ["Tanakh", "Histoire juive", "Pirké Avot"],
    languages: ["Français"],
    levels: ["Débutant", "Intermédiaire", "Avancé"],
    price: 26,
    trialPrice: 6,
    rating: 4.7,
    reviews: 41,
    lessons: 540,
    students: 27,
    country: "Canada",
    headline: "Les grands récits du Tanakh, au cœur de notre histoire",
    bio: "Diplômée en études juives, je propose un parcours vivant à travers le Tanakh et l'histoire du peuple juif, avec des textes et des discussions.",
    experience: ["Diplôme d'études juives", "Animatrice de cercles d'étude (7 ans)"],
    available: ["matin", "apres-midi"],
    color: "#6b3a8a",
  },
  {
    id: "rav-mordekhai-sebbag",
    name: "Rav Mordekhaï Sebbag",
    title: "Rav · Hassidout et Emouna",
    spaces: ["hommes"],
    subjects: ["Hassidout", "Emouna", "Moussar"],
    languages: ["Français", "Hébreu"],
    levels: ["Intermédiaire", "Avancé"],
    price: 40,
    trialPrice: 12,
    rating: 5.0,
    reviews: 63,
    lessons: 920,
    students: 29,
    country: "Israël",
    headline: "Trouver sa place et sa force dans l'étude",
    bio: "J'accompagne ceux qui cherchent du sens : Tanya, Moussar, Emouna. Un cours qui nourrit l'âme et donne des forces pour la semaine.",
    experience: ["Machpia en Yechiva (10 ans)", "Conférences en France et en Israël"],
    available: ["matin", "soir"],
    color: "#1f2d66",
  },
  {
    id: "noa-bitton",
    name: "Noa Bitton",
    title: "Morah · Paracha et Michna pour enfants",
    spaces: ["enfants"],
    subjects: ["Paracha", "Michna", "Kodech (enfants)"],
    languages: ["Français", "Anglais"],
    levels: ["Débutant"],
    price: 20,
    trialPrice: 0,
    rating: 4.8,
    reviews: 38,
    lessons: 610,
    students: 31,
    country: "Belgique",
    headline: "La Paracha de la semaine racontée aux enfants",
    bio: "Chaque semaine, une aventure : on lit, on raconte, on joue avec la Paracha. Les enfants repartent avec une question à poser à table le Chabbat.",
    experience: ["Animatrice en Talmud Torah (6 ans)", "Créatrice de fiches Paracha pour enfants"],
    available: ["apres-midi"],
    color: "#c2410c",
  },
];

export function getTeacher(id: string) {
  return TEACHERS.find((t) => t.id === id);
}

export function getSpace(slug: string) {
  return SPACES.find((s) => s.slug === slug);
}

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
    name: "Rachel, maman de Nathan (9 ans)",
    text: "Nathan lit maintenant couramment. Il attend son cours avec impatience, et je reçois un petit bilan après chaque séance.",
  },
];

export const FAQ = [
  {
    q: "Comment se déroule un cours ?",
    a: "Les cours ont lieu en visio sur Google Meet. Dès qu'un cours est confirmé, le lien est créé automatiquement et envoyé par e-mail à l'élève et à l'enseignant. Il apparaît aussi dans votre tableau de bord.",
  },
  {
    q: "Qu'est-ce que le cours d'essai ?",
    a: "Un premier cours de 25 minutes pour faire connaissance avec l'enseignant, définir vos objectifs et vérifier que le courant passe. Certains enseignants l'offrent gratuitement.",
  },
  {
    q: "Puis-je changer d'enseignant ?",
    a: "Bien sûr. Vous pouvez à tout moment essayer un autre enseignant, sans frais supplémentaires.",
  },
  {
    q: "Les espaces Hommes et Femmes sont-ils séparés ?",
    a: "Oui. Dans l'espace Femmes, les cours sont donnés par des enseignantes. Dans l'espace Hommes, par des Rabbanim et des Avrekhim.",
  },
  {
    q: "Quel niveau faut-il pour commencer ?",
    a: "Aucun. e-team s'adresse à tous les publics, du grand débutant à l'étudiant confirmé. L'enseignant adapte le cours à votre niveau.",
  },
];
