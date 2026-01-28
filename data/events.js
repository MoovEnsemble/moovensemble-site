// data/events.js
// Tous les événements du site (futurs + passés)
// Tu modifies UNIQUEMENT ici quand tu veux ajouter/changer un événement

export const eventsData = [
  {
    id: "capoeira-pass-vacances-2025",
    title: "Moov'Capoeira – Pass Vacances",
    date: "15–20 février 2025",
    location: "Genève",
    description:
      "Sensibilisation à l'inclusion sociale à travers la capoeira. Ouvert aux enfants et ados.",
    status: "past", // "future" ou "past"
    link: "contact.html#inscription",
    // ← Ici tu ajoutes tes vraies photos et vidéos
    galleryImages: [
      "../assets/images/contenu/2025/capoeira/pass vacances juillet 2025/capoeira-enfants-1.jpg",
      "../assets/images/contenu/2025/capoeira/pass vacances juillet 2025/capoeira-enfants-2.jpg",
      // Ajoute autant de lignes que tu as de photos
    ],

    galleryVideos: [
      "../assets/videos/2025/Capoeira-pass-vacances-(juillet-2025)/video-pass-vacances.mp4",
    ],
  },
  {
    id: "kids-journee-decouverte-2024",
    title: "Moov'Kids – Journée Découverte",
    date: "12 octobre 2024",
    location: "Lausanne",
    description:
      "Activités ludiques et sportives pour les 6-12 ans. Places limitées !",
    status: "past",
    galleryImages: [
      // Si passé → on pourra afficher les photos ici plus tard
      "assets/images/contenu/2024/kids/photo-01.jpg",
      "assets/images/contenu/2024/kids/photo-02.jpg",
    ],
  },
  {
    id: "seniors-atelier-2024",
    title: "Moov'Seniors – Atelier Équilibre",
    date: "5 novembre 2024",
    location: "Genève",
    description: "Exercices doux pour améliorer l’équilibre et la mobilité.",
    status: "past",
    galleryImages: ["assets/images/contenu/2024/seniors/atelier-01.jpg"],
  },
  // ← Ajoute ici d'autres événements quand tu veux (copie-colle un bloc)
];
